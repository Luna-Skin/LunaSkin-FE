import { useEffect, useRef, useState } from "react";
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

import goBackIcon from "../../assets/icons/go back.svg";

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

  background: #f7f2ff;

  font-family: "Pretendard Variable", Pretendard, sans-serif;
`;

const Header = styled.header`
  width: 100%;
  height: 48px;

  box-sizing: border-box;

  display: flex;
  align-items: flex-start;

  padding: 8px 15px 15px 15px;

  background: white;

  border-top: 1px solid #d9d9d9;
  border-bottom: 1px solid #d9d9d9;

  flex-shrink: 0;
`;

const BackButton = styled.button`
  width: 26px;
  height: 26px;

  padding: 0;

  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 0;
  background: transparent;

  cursor: pointer;
`;

const BackIcon = styled.img`
  width: 26px;
  height: 26px;

  display: block;
`;

const Conversation = styled.main`
  flex: 1;
  min-height: 0;

  overflow-y: auto;

  box-sizing: border-box;

  padding: 24px 24px 100px;
`;

const DateText = styled.p`
  margin: 0 0 20px;

  color: #7e7979;

  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;

  text-align: center;
  word-wrap: break-word;
`;

const MessageState = styled.p`
  margin: 0 0 12px;

  color: #a7a7a7;

  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 10px;
  font-weight: 500;
  line-height: 20px;

  text-align: center;
  word-wrap: break-word;
`;

const InputArea = styled.div`
  position: absolute;

  right: 0;
  bottom: 0;
  left: 0;

  z-index: 10;

  box-sizing: border-box;

  padding: 10px 24px 14px;
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

function formatDateLabel(dateString) {
  if (!dateString) {
    return getTodayLabel();
  }

  const date = new Date(
    `${dateString}T00:00:00`,
  );

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return `${date.getFullYear()}년 ${
    date.getMonth() + 1
  }월 ${date.getDate()}일`;
}

function formatMessageTime(value) {
  if (!value) {
    return formatTime();
  }

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

    text:
      message.text ??
      message.content ??
      "",

    image:
      message.image ??
      message.fileUrl ??
      null,

    time: formatMessageTime(
      message.time ??
        message.createdAt,
    ),
  };
}

function hasSameMessage(
  messages,
  nextMessage,
) {
  return messages.some(
    (message) =>
      String(message.id) ===
      String(nextMessage.id),
  );
}

export default function ChatRoom() {
  const navigate = useNavigate();
  const location = useLocation();
  const { chatId } = useParams();

  const { fetchChatMessages, deleteChat } =
    useChatContext();

  const fromTodaySkin = Boolean(
    location.state?.fromTodaySkin,
  );

  const todaySkinDate =
    location.state?.todaySkinDate;

  const isNewChat = Boolean(
    location.state?.isNewChat,
  );

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
  const [socketError, setSocketError] =
    useState(null);
  const [isUploading, setIsUploading] =
    useState(false);
  const [isAiTyping, setIsAiTyping] =
    useState(false);
  const [
    isSocketConnected,
    setIsSocketConnected,
  ] = useState(false);

  const socketRef = useRef(null);

  const photoInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const messageEndRef = useRef(null);

  const isSendingRef = useRef(false);
  const hasSentMessageRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function loadMessages() {
      try {
        setIsLoadingMessages(true);

        const loadedMessages =
          await fetchChatMessages(chatId);

        if (!isMounted) {
          return;
        }

        let nextMessages = [
          ...loadedMessages,
        ]
          .reverse()
          .map(normalizeMessage);

        if (fromTodaySkin) {
          nextMessages =
            nextMessages.filter(
              (message) =>
                message.text !==
                DEFAULT_GREETING,
            );

          nextMessages.unshift({
            id: `today-skin-notice-${chatId}`,
            role: "bot",
            text:
              "오늘의 분석 결과에서 어떤 부분이 궁금하신가요?\n" +
              `→ ${formatDateLabel(
                todaySkinDate,
              )} 투데이스킨 첨부됨`,
            time: formatTime(),
          });
        }

        setMessages((current) => {
          const receivedWhileLoading =
            current.filter(
              (message) =>
                !hasSameMessage(
                  nextMessages,
                  message,
                ),
            );

          return [
            ...nextMessages,
            ...receivedWhileLoading,
          ];
        });
      } catch (error) {
        console.error(
          "[ChatRoom] 대화 내역 조회 실패:",
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
    if (!chatId) {
      return undefined;
    }

    console.log(
      "[ChatRoom] WebSocket 연결 시작:",
      chatId,
    );

    setSocketError(null);
    setIsSocketConnected(false);

    const socket =
      connectChatSocket(chatId, {
        onMessage: (payload) => {
          console.log(
            "[ChatRoom] WebSocket 메시지 수신:",
            payload,
          );

          const nextMessage =
            normalizeMessage(payload);

          if (nextMessage.role === "bot") {
            setIsAiTyping(false);
          }

          setMessages((current) => {
            if (
              hasSameMessage(
                current,
                nextMessage,
              )
            ) {
              return current;
            }

            return [
              ...current,
              nextMessage,
            ];
          });
        },

        onError: (error) => {
          console.error(
            "[ChatRoom] 서버 채팅 오류:",
            error,
          );

          setIsAiTyping(false);

          setSocketError(
            error?.message ??
              "AI 답변 중 오류가 발생했어요.",
          );
        },

        onConnect: () => {
          console.log(
            "[ChatRoom] WebSocket 연결 완료:",
            chatId,
          );

          setIsSocketConnected(true);
          setSocketError(null);
        },

        onDisconnect: () => {
          console.warn(
            "[ChatRoom] WebSocket 연결 종료",
          );

          setIsSocketConnected(false);
        },

        onConnectError: (error) => {
          console.error(
            "[ChatRoom] WebSocket 연결 실패:",
            error,
          );

          setIsSocketConnected(false);
          setIsAiTyping(false);

          setSocketError(
            "채팅 서버에 연결하지 못했어요.",
          );
        },
      });

    socketRef.current = socket;

    return () => {
      console.log(
        "[ChatRoom] WebSocket cleanup:",
        chatId,
      );

      socket.disconnect();

      if (socketRef.current === socket) {
        socketRef.current = null;
      }

      setIsSocketConnected(false);
    };
  }, [chatId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [
    messages,
    isUploading,
    isAiTyping,
  ]);

  const handleGoBack = async () => {
    if (
      isNewChat &&
      !hasSentMessageRef.current
    ) {
      try {
        await deleteChat(chatId);
      } catch (error) {
        console.error(
          "[ChatRoom] 빈 채팅방 삭제 실패:",
          error,
        );
      }
    }

    navigate(-1);
  };

  const sendMessage = async () => {
    if (isSendingRef.current) {
      return;
    }

    console.log(
      "[ChatRoom] sendMessage 호출",
    );

    const text = input.trim();

    console.log(
      "[ChatRoom] 입력값:",
      text,
    );

    if (!text && !attachedImage) {
      return;
    }

    isSendingRef.current = true;

    try {
      if (attachedImage) {
        setIsUploading(true);

        await uploadChatFile(
          chatId,
          attachedImage.file,
          text,
        );

        hasSentMessageRef.current = true;

        setInput("");
        setAttachedImage(null);
        setIsMenuOpen(false);

        return;
      }

      const socket = socketRef.current;

      console.log(
        "[ChatRoom] socket:",
        socket,
      );

      if (!socket) {
        console.error(
          "[ChatRoom] socketRef가 없습니다.",
        );

        setSocketError(
          "채팅 서버에 연결되지 않았어요.",
        );

        return;
      }

      if (!socket.isConnected()) {
        console.warn(
          "[ChatRoom] 아직 WebSocket 연결이 완료되지 않았습니다.",
        );

        setSocketError(
          "채팅 서버 연결 후 다시 시도해주세요.",
        );

        return;
      }

      const sent =
        socket.sendMessage(text);

      console.log(
        "[ChatRoom] 메시지 전송 결과:",
        sent,
      );

      if (!sent) {
        setSocketError(
          "메시지를 전송하지 못했어요. 다시 시도해주세요.",
        );

        return;
      }

      hasSentMessageRef.current = true;

      setInput("");
      setIsMenuOpen(false);
      setSocketError(null);

      setIsAiTyping(true);
    } catch (error) {
      console.error(
        "[ChatRoom] 메시지 전송 실패:",
        error,
      );

      setIsAiTyping(false);

      setSocketError(
        "메시지를 전송하지 못했어요. 다시 시도해주세요.",
      );
    } finally {
      setIsUploading(false);
      isSendingRef.current = false;
    }
  };

  const handlePhotoAttach = (event) => {
    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

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

  const handleFileAttach = async (
    event,
  ) => {
    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    try {
      setIsUploading(true);

      await uploadChatFile(
        chatId,
        selectedFile,
      );

      setIsMenuOpen(false);
    } catch (error) {
      console.error(
        "[ChatRoom] 파일 업로드 실패:",
        error,
      );

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
          onClick={handleGoBack}
          aria-label="뒤로 가기"
        >
          <BackIcon
            src={goBackIcon}
            alt=""
          />
        </BackButton>
      </Header>

      <Conversation>
        <DateText>
          {fromTodaySkin
            ? formatDateLabel(
                todaySkinDate,
              )
            : getTodayLabel()}
        </DateText>

        {!isSocketConnected &&
          !isLoadingMessages && (
            <MessageState>
              채팅 서버에 연결하는 중이에요.
            </MessageState>
          )}

        {socketError && (
          <MessageState>
            {socketError}
          </MessageState>
        )}

        {isLoadingMessages && (
          <MessageState>
            대화를 불러오는 중이에요.
          </MessageState>
        )}

        {!isLoadingMessages &&
          messages.map((message) => (
            <ChatBubble
              key={message.id}
              {...message}
            />
          ))}

        {isAiTyping && (
          <ChatBubble
            role="bot"
            isTyping
          />
        )}

        {isUploading && (
          <MessageState>
            파일을 전송하는 중이에요.
          </MessageState>
        )}

        <div ref={messageEndRef} />
      </Conversation>

      <InputArea>
        {isMenuOpen && (
          <ChatPlusMenu
            onPhotoClick={() =>
              photoInputRef.current?.click()
            }
            onFileClick={() =>
              fileInputRef.current?.click()
            }
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