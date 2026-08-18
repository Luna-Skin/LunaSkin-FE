import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
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
  background: #fff;
  border-bottom: 1px solid #e5e5e5;
`;

const BackButton = styled.button`
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
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

const InputArea = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  padding: 10px 28px 14px;
  background: transparent;
`;

const InputBarWrapper = styled.div`
  position: relative;
  z-index: 11;
`;

function getTodayLabel() {
  const now = new Date();

  return `${now.getFullYear()}년 ${
    now.getMonth() + 1
  }월 ${now.getDate()}일`;
}

function normalizeSocketMessage(payload) {
  return {
    id:
      payload.chatMessageId ??
      payload.messageId ??
      `${Date.now()}-${Math.random()}`,

    chatMessageId:
      payload.chatMessageId ??
      payload.messageId,

    role:
      payload.role === "AI"
        ? "bot"
        : payload.role === "USER"
          ? "user"
          : payload.role,

    text: payload.content ?? "",

    image:
      payload.fileUrl ?? null,

    time:
      payload.createdAt ?? formatTime(),

    messageType:
      payload.messageType ?? "TEXT",
  };
}

export default function ChatRoom() {
  const navigate = useNavigate();
  const { chatId } = useParams();

  const {
    getChat,
    fetchChatMessages,
  } = useChatContext();

  const [input, setInput] = useState("");
  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  const [attachedImage, setAttachedImage] =
    useState(null);

  const [messages, setMessages] =
    useState([]);

  const [
    isLoadingMessages,
    setIsLoadingMessages,
  ] = useState(true);

  const [
    socketError,
    setSocketError,
  ] = useState(null);

  const socketRef = useRef(null);

  const photoInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const messageEndRef = useRef(null);

  const chat = getChat(chatId);

  // 방 진입 시 기존 메시지 조회
  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setIsLoadingMessages(true);

        const data =
          await fetchChatMessages(chatId);

        if (isMounted) {
          setMessages(data ?? []);
        }
      } catch (error) {
        console.error(
          "대화 내역을 불러오지 못했습니다.",
          error,
        );

        if (isMounted) {
          setMessages([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingMessages(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [chatId, fetchChatMessages]);

  // 방 진입 시 WebSocket 연결
  useEffect(() => {
    if (!chatId) return undefined;

    setSocketError(null);

    const socket =
      connectChatSocket(chatId, {
        onConnect: () => {
          console.log(
            `[ChatRoom] 소켓 연결 완료: ${chatId}`,
          );
        },

        onMessage: (payload) => {
          const message =
            normalizeSocketMessage(
              payload,
            );

          setMessages((current) => {
            // 같은 메시지가 중복으로 들어오는 경우 방지
            const alreadyExists =
              current.some(
                (item) =>
                  String(item.id) ===
                  String(message.id),
              );

            if (alreadyExists) {
              return current;
            }

            return [...current, message];
          });
        },

        onError: (error) => {
          console.error(
            "AI 응답 오류",
            error,
          );

          setSocketError(
            error?.message ??
              "AI 응답 중 오류가 발생했습니다.",
          );
        },

        onConnectError: (error) => {
          console.error(
            "채팅 소켓 연결 실패",
            error,
          );

          setSocketError(
            "채팅 서버와 연결하지 못했습니다.",
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
  }, [messages]);

  const sendMessage = () => {
    const text = input.trim();

    if (!text && !attachedImage) {
      return;
    }

    if (!text) {
      return;
    }

    const socket = socketRef.current;

    if (!socket) {
      console.warn(
        "채팅 소켓이 연결되지 않았습니다.",
      );
      return;
    }

    const sent =
      socket.sendMessage(text);

    if (!sent) {
      return;
    }

    setInput("");
    setAttachedImage(null);
    setIsMenuOpen(false);
  };

  const handlePhotoAttach = async (
    event,
  ) => {
    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) return;

    try {
      const reader = new FileReader();

      reader.onload = () => {
        setAttachedImage({
          file: selectedFile,
          url: reader.result,
        });

        setIsMenuOpen(false);
      };

      reader.readAsDataURL(
        selectedFile,
      );
    } catch (error) {
      console.error(
        "이미지 선택에 실패했습니다.",
        error,
      );
    }

    event.target.value = "";
  };

  const handleFileAttach = async (
    event,
  ) => {
    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) return;

    try {
      await uploadChatFile(
        chatId,
        selectedFile,
      );

      console.log(
        "파일 업로드 완료",
      );
    } catch (error) {
      console.error(
        "파일 업로드에 실패했습니다.",
        error,
      );
    }

    setIsMenuOpen(false);
    event.target.value = "";
  };

  if (!chat) {
    return (
      <Room>
        <Header>
          <BackButton
            onClick={() =>
              navigate("/chat")
            }
            aria-label="목록으로"
          >
            ‹
          </BackButton>
        </Header>

        <Conversation>
          <DateText>
            대화를 찾을 수 없어요.
          </DateText>
        </Conversation>
      </Room>
    );
  }

  return (
    <Room>
      <Header>
        <BackButton
          onClick={() =>
            navigate("/chat")
          }
          aria-label="목록으로"
        >
          ‹
        </BackButton>
      </Header>

      <Conversation>
        <DateText>
          {getTodayLabel()}
        </DateText>

        {socketError && (
          <div
            style={{
              marginBottom: 12,
              color: "#999",
              fontSize: 11,
              textAlign: "center",
            }}
          >
            {socketError}
          </div>
        )}

        {!isLoadingMessages &&
          messages.map((message) => (
            <ChatBubble
              key={
                message.id ??
                message.chatMessageId
              }
              {...message}
            />
          ))}

        <div ref={messageEndRef} />
      </Conversation>

      <InputArea>
        {isMenuOpen && (
          <ChatPlusMenu
            onPhotoClick={() => {
              photoInputRef.current?.click();
            }}
            onFileClick={() => {
              fileInputRef.current?.click();
            }}
          />
        )}

        <InputBarWrapper>
          <ChatInputBar
            value={input}
            onChange={setInput}
            onSubmit={sendMessage}
            onToggleMenu={() =>
              setIsMenuOpen(
                (current) => !current,
              )
            }
            isMenuOpen={isMenuOpen}
            image={attachedImage?.url}
            onRemoveImage={() =>
              setAttachedImage(null)
            }
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