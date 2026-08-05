import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import ChatBubble from "../../components/chat/ChatBubble";
import ChatInputBar from "../../components/chat/ChatInputBar";
import ChatPlusMenu from "../../components/chat/ChatPlusMenu";

const Room = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 402px;
  height: calc(100dvh - 60px);
  margin: 0 auto;
  overflow: hidden;
  background: #f7f1ff;
`;

const Header = styled.header`
  padding: 26px 28px 14px;
  background: #fff;
`;

const Title = styled.h1`
  color: #a47af5;
  font-size: 26px;
  font-weight: 700;
`;

const Conversation = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 24px 28px 16px;
`;

const DateText = styled.p`
  margin-bottom: 16px;
  color: #888;
  text-align: center;
  font-size: 12px;
`;

const InputArea = styled.div`
  position: relative;
  padding: 10px 28px 14px;
  background: #f7f1ff;
`;

const Typing = styled.p`
  margin: 2px 0 12px 50px;
  color: #9987b4;
  font-size: 12px;
`;

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: "bot",
    text: "안녕하세요! 끼끼의 피부상담소입니다.\n무엇이 궁금하신가요?",
  },
];

function getBotReply(message) {
  if (message.includes("트러블") || message.includes("여드름")) {
    return "기록을 보니 생리 D-5부터 트러블이 시작되는 패턴이에요. 지금 피부 상태를 고려해 진정 케어를 추천드려요.";
  }

  if (message.includes("건조") || message.includes("수분")) {
    return "최근 수분 섭취와 피부 기록을 함께 확인해 볼게요. 자극이 적은 보습 제품을 충분히 사용해 주세요.";
  }

  return "메시지를 확인했어요. 피부 기록과 생활 습관을 바탕으로 더 정확한 분석을 도와드릴게요.";
}

export default function ChatRoom() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const photoInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const messageEndRef = useRef(null);
  const nextIdRef = useRef(2);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isReplying]);

  const addBotReply = (message) => {
    setIsReplying(true);

    window.setTimeout(() => {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: nextIdRef.current++,
          role: "bot",
          text: getBotReply(message),
          time: "방금",
        },
      ]);
      setIsReplying(false);
    }, 500);
  };

  const sendMessage = () => {
    const text = input.trim();

    if (!text) return;

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: nextIdRef.current++,
        role: "user",
        text,
        time: "방금",
      },
    ]);

    setInput("");
    setIsMenuOpen(false);
    addBotReply(text);
  };

  const handleAttachment = (event, type) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    const message = `${type}을(를) 첨부했어요: ${selectedFile.name}`;

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: nextIdRef.current++,
        role: "user",
        text: message,
        time: "방금",
      },
    ]);

    setIsMenuOpen(false);
    addBotReply(message);
    event.target.value = "";
  };

  return (
    <Room>
      <Header>
        <Title>ChatKIKI</Title>
      </Header>

      <Conversation>
        <DateText>2026년 8월 25일</DateText>

        {messages.map((message) => (
          <ChatBubble key={message.id} {...message} />
        ))}

        {isReplying && <Typing>끼끼가 답변을 작성 중이에요...</Typing>}
        <div ref={messageEndRef} />
      </Conversation>

      <InputArea>
        {isMenuOpen && (
          <ChatPlusMenu
            onPhotoClick={() => photoInputRef.current?.click()}
            onFileClick={() => fileInputRef.current?.click()}
          />
        )}

        <ChatInputBar
          value={input}
          onChange={setInput}
          onSubmit={sendMessage}
          onToggleMenu={() => setIsMenuOpen((current) => !current)}
          isMenuOpen={isMenuOpen}
        />

        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(event) => handleAttachment(event, "사진")}
        />
        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={(event) => handleAttachment(event, "파일")}
        />
      </InputArea>
    </Room>
  );
}