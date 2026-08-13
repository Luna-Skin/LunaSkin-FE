import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import ChatBubble, { formatTime } from "../../components/chat/ChatBubble";
import ChatInputBar from "../../components/chat/ChatInputBar";
import ChatPlusMenu from "../../components/chat/ChatPlusMenu";
import { useChatContext } from "../../components/chat/ChatContext";
import { requestAIReply } from "../../api/chatApi";

const Room = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 402px;
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

function formatTimeWithUnits(date = new Date()) {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const period = hours < 12 ? "오전" : "오후";

  const displayHour =
    hours % 12 === 0 ? 12 : hours % 12;

  return `${period} ${displayHour}시 ${String(minutes).padStart(
    2,
    "0",
  )}분`;
}

function buildInitialMessages(
  fromTodaySkin,
  attachedDate = getTodayLabel(),
) {
  const now = new Date();

  if (fromTodaySkin) {
    return [
      {
        id: "today-skin-notice",
        role: "bot",
        text: `오늘의 분석 결과에서 어떤 부분이 궁금하신가요?\n→ ${attachedDate} 투데이스킨 첨부됨`,
        time: formatTimeWithUnits(now),
      },
    ];
  }

  return [
    {
      id: "greeting",
      role: "bot",
      text: "안녕하세요! 끼끼의 피부상담소입니다.\n무엇이 궁금하신가요?",
    },
  ];
}

export default function ChatRoom() {
  const navigate = useNavigate();
  const location = useLocation();
  const { chatId } = useParams();

  const {
    getChat,
    setChatMessages,
    updateChatTitleFromAI,
  } = useChatContext();

  const [input, setInput] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const photoInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const messageEndRef = useRef(null);

  const chat = getChat(chatId);

  const fromTodaySkin =
    Boolean(location.state?.fromTodaySkin) ||
    Boolean(chat?.fromTodaySkin);

  const attachedTodaySkinDate =
    location.state?.todaySkinDate ||
    chat?.todaySkinDate ||
    getTodayLabel();

  useEffect(() => {
    if (chat && chat.messages.length === 0) {
      setChatMessages(
        chatId,
        buildInitialMessages(
          fromTodaySkin,
          attachedTodaySkinDate,
        ),
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, chat?.messages.length]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chat?.messages, isReplying]);

  if (!chat) {
    return (
      <Room>
        <Header>
          <BackButton
            onClick={() => navigate("/chat")}
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

  const messages = chat.messages;

  const addBotReply = async (userMessage) => {
    setIsReplying(true);

    try {
      const { reply, suggestedTitle } =
        await requestAIReply({
          chatId,
          messages: [
            ...chat.messages,
            {
              role: "user",
              text: userMessage,
            },
          ],
        });

      setChatMessages(chatId, (current) => [
        ...current,
        {
          id: `${Date.now()}-bot`,
          role: "bot",
          text: reply,
          time: formatTime(),
        },
      ]);

      if (suggestedTitle) {
        updateChatTitleFromAI(
          chatId,
          suggestedTitle,
        );
      }
    } catch (error) {
      setChatMessages(chatId, (current) => [
        ...current,
        {
          id: `${Date.now()}-bot-error`,
          role: "bot",
          text: "죄송해요, 잠시 오류가 발생했어요. 다시 시도해주세요.",
          time: formatTime(),
        },
      ]);
    } finally {
      setIsReplying(false);
    }
  };

  const sendMessage = () => {
    const text = input.trim();

    if (!text) return;

    setChatMessages(chatId, (current) => [
      ...current,
      {
        id: `${Date.now()}-user`,
        role: "user",
        text,
        time: formatTime(),
      },
    ]);

    setInput("");
    setIsMenuOpen(false);

    addBotReply(text);
  };

  // 사진 선택
  const handlePhotoAttach = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    const reader = new FileReader();

    reader.onload = () => {
      const imageUrl = reader.result;

      setChatMessages(chatId, (current) => [
        ...current,
        {
          id: `${Date.now()}-user-img`,
          role: "user",
          image: imageUrl,
          text: `사진을 첨부했어요: ${selectedFile.name}`,
          time: formatTime(),
        },
      ]);

      setIsMenuOpen(false);

      addBotReply(
        `사진을 첨부했어요: ${selectedFile.name}`,
      );
    };

    reader.readAsDataURL(selectedFile);

    event.target.value = "";
  };

  // 파일 선택
  const handleFileAttach = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    const fileMessage =
      `파일을 첨부했어요: ${selectedFile.name}`;

    setChatMessages(chatId, (current) => [
      ...current,
      {
        id: `${Date.now()}-user-file`,
        role: "user",
        text: fileMessage,
        time: formatTime(),
      },
    ]);

    setIsMenuOpen(false);

    addBotReply(fileMessage);

    event.target.value = "";
  };

  return (
    <Room>
      <Header>
        <BackButton
          onClick={() => navigate("/chat")}
          aria-label="목록으로"
        >
          ‹
        </BackButton>
      </Header>

      <Conversation>
        <DateText>
          {getTodayLabel()}
        </DateText>

        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            {...message}
          />
        ))}

        {isReplying && (
          <ChatBubble
            role="bot"
            isTyping
          />
        )}

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