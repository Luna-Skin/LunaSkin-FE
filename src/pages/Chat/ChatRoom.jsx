import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import styled from "styled-components";

import ChatBubble, {
  formatTime,
} from "../../components/chat/ChatBubble";
import ChatInputBar from "../../components/chat/ChatInputBar";
import ChatPlusMenu from "../../components/chat/ChatPlusMenu";
import { useChatContext } from "../../components/chat/ChatContext";
import { connectChatSocket } from "../../api/chatSocket";
import { uploadChatFile } from "../../api/chatApi";

const DEFAULT_GREETING =
  "안녕하세요! 끼끼의 피부상담소입니다.\n무엇이 궁금하신가요?";

const Room = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
  background: #f7f1ff;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid #e5e5e5;
  background: #fff;
`;

const BackButton = styled.button`
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border: 0;
  background: transparent;
  color: #333;
  font-size: 22px;
  cursor: pointer;
`;

const Conversation = styled.main`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 24px 28px 100px;
`;

const DateText = styled.p`
  margin-bottom: 16px;
  color: #888;
  text-align: center;
  font-size: 12px;
`;

const MessageState = styled.p`
  margin-bottom: 12px;
  color: #999;
  text-align: center;
  font-size: 11px;
`;

const InputArea = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  padding: 10px 28px 14px;
`;

const InputBarWrapper = styled.div`
  position: relative;
  z-index: 11;
`;

function getTodayLabel() {
  const now = new Date();

  return `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`;
}

function formatDateLabel(dateString) {
  if (!dateString) return getTodayLabel();

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function formatMessageTime(value) {
  if (!value) return formatTime();

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return formatTime();
  }

  return formatTime(date);
}

function normalizeMessage(message) {
  return {
    ...message,
    id:
      message.id ??
      message.chatMessageId ??
      message.messageId ??
      `${Date.now()}-${Math.random()}`,
    role:
      message.role === "AI"
        ? "bot"
        : message.role === "USER"
          ? "user"
          : message.role,
    text: message.text ?? message.content ?? "",
    image: message.image ?? message.fileUrl ?? null,
    time: formatMessageTime(
      message.time ?? message.createdAt,
    ),
  };
}

function hasSameMessage(messages, nextMessage) {
  return messages.some(
    (message) => String(message.id) === String(nextMessage.id),
  );
}

export default function ChatRoom() {
  const navigate = useNavigate();
  const location = useLocation();
  const { chatId } = useParams();

  const { fetchChatMessages } = useChatContext();

  const fromTodaySkin = Boolean(
    location.state?.fromTodaySkin,
  );

  const todaySkinDate = location.state?.todaySkinDate;

  const [input, setInput] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [attachedImage, setAttachedImage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [socketError, setSocketError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const socketRef = useRef(null);
  const photoInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const messageEndRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    async function loadMessages() {
      try {
        setIsLoadingMessages(true);

        const loadedMessages = await fetchChatMessages(chatId);

        if (!isMounted) return;

        // 백엔드는 최신 메시지부터 주므로, 화면용으로 뒤집는다.
        let nextMessages = [...loadedMessages]
          .reverse()
          .map(normalizeMessage);

        // 투데이스킨에서 온 경우 기본 인사 대신 분석 안내만 표시
        if (fromTodaySkin) {
          nextMessages = nextMessages.filter(
            (message) => message.text !== DEFAULT_GREETING,
          );

          nextMessages.unshift({
            id: `today-skin-notice-${chatId}`,
            role: "bot",
            text:
              "오늘의 분석 결과에서 어떤 부분이 궁금하신가요?\n" +
              `→ ${formatDateLabel(todaySkinDate)} 투데이스킨 첨부됨`,
            time: formatTime(),
          });
        }

        setMessages((current) => {
          const receivedWhileLoading = current.filter(
            (message) => !hasSameMessage(nextMessages, message),
          );

          return [...nextMessages, ...receivedWhileLoading];
        });
      } catch (error) {
        console.error("대화 내역 조회 실패:", error);

        if (isMounted) {
          setMessages([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingMessages(false);
        }
      }
    }

    loadMessages();

    return () => {
      isMounted = false;
    };
  }, [
    chatId,
    fetchChatMessages,
    fromTodaySkin,
    todaySkinDate,
  ]);

  useEffect(() => {
    if (!chatId) return undefined;

    setSocketError(null);

    const socket = connectChatSocket(chatId, {
      onMessage: (payload) => {
        const nextMessage = normalizeMessage(payload);

        setMessages((current) => {
          if (hasSameMessage(current, nextMessage)) {
            return current;
          }

          return [...current, nextMessage];
        });
      },

      onError: (error) => {
        setSocketError(
          error?.message ??
            "AI 답변 중 오류가 발생했어요.",
        );
      },

      onConnectError: () => {
        setSocketError(
          "채팅 서버에 연결하지 못했어요.",
        );
      },
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();

      if (socketRef.current === socket) {
        socketRef.current = null;
      }
    };
  }, [chatId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isUploading]);

  const sendMessage = async () => {
    const text = input.trim();

    if (!text && !attachedImage) return;

    try {
      if (attachedImage) {
        setIsUploading(true);

        // 업로드 후 USER 메시지와 AI 답변은 소켓으로 수신됨
        await uploadChatFile(
          chatId,
          attachedImage.file,
          text,
        );

        setInput("");
        setAttachedImage(null);
        setIsMenuOpen(false);
        return;
      }

      const sent = socketRef.current?.sendMessage(text);

      if (!sent) {
        setSocketError(
          "채팅 서버 연결 후 다시 시도해주세요.",
        );
        return;
      }

      setInput("");
      setIsMenuOpen(false);
    } catch (error) {
      console.error("메시지 전송 실패:", error);
      setSocketError(
        "메시지를 전송하지 못했어요. 다시 시도해주세요.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handlePhotoAttach = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    const reader = new FileReader();

    reader.onload = () => {
      setAttachedImage({
        file: selectedFile,
        url: reader.result,
      });

      setIsMenuOpen(false);
    };

    reader.readAsDataURL(selectedFile);
    event.target.value = "";
  };

  const handleFileAttach = async (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    try {
      setIsUploading(true);

      // 일반 파일도 업로드 API를 통해 메시지로 저장됨
      await uploadChatFile(chatId, selectedFile);

      setIsMenuOpen(false);
    } catch (error) {
      console.error("파일 업로드 실패:", error);
      setSocketError(
        "파일을 업로드하지 못했어요. 다시 시도해주세요.",
      );
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <Room>
      <Header>
        <BackButton
          type="button"
          onClick={() => navigate("/chat")}
          aria-label="채팅 목록으로"
        >
          ‹
        </BackButton>
      </Header>

      <Conversation>
        <DateText>
          {fromTodaySkin
            ? formatDateLabel(todaySkinDate)
            : getTodayLabel()}
        </DateText>

        {socketError && (
          <MessageState>{socketError}</MessageState>
        )}

        {isLoadingMessages && (
          <MessageState>대화를 불러오는 중이에요.</MessageState>
        )}

        {!isLoadingMessages &&
          messages.map((message) => (
            <ChatBubble
              key={message.id}
              {...message}
            />
          ))}

        {isUploading && (
          <MessageState>파일을 전송하는 중이에요.</MessageState>
        )}

        <div ref={messageEndRef} />
      </Conversation>

      <InputArea>
        {isMenuOpen && (
          <ChatPlusMenu
            onPhotoClick={() => photoInputRef.current?.click()}
            onFileClick={() => fileInputRef.current?.click()}
          />
        )}

        <InputBarWrapper>
          <ChatInputBar
            value={input}
            onChange={setInput}
            onSubmit={sendMessage}
            onToggleMenu={() =>
              setIsMenuOpen((current) => !current)
            }
            isMenuOpen={isMenuOpen}
            image={attachedImage?.url}
            onRemoveImage={() => setAttachedImage(null)}
          />
        </InputBarWrapper>

        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handlePhotoAttach}
        />

        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={handleFileAttach}
        />
      </InputArea>
    </Room>
  );
}