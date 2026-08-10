import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import ChatBubble, { formatTime } from "../../components/chat/ChatBubble";
import ChatInputBar from "../../components/chat/ChatInputBar";
import ChatPlusMenu from "../../components/chat/ChatPlusMenu";
import ChatSidebar from "../../components/chat/ChatSidebar";

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

// 4-1: 뒤로가기 + 채팅 기록(사이드바) 토글이 있는 얇은 헤더
const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
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

const MenuButton = styled.button`
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border: 0;
  background: transparent;
  color: #333;
  font-size: 18px;
  cursor: pointer;
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

function getTodayLabel() {
  const now = new Date();
  return `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`;
}

// "오후 10시 17분" 형식 (ChatBubble의 formatTime과는 표기가 다름)
function formatTimeWithUnits(date = new Date()) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours < 12 ? "오전" : "오후";
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${period} ${displayHour}시 ${String(minutes).padStart(2, "0")}분`;
}

// 인사말은 항상 표시.
// "투데이스킨 결과 → 챗봇 탭"으로 넘어온 경우에만 분석 결과 안내 메시지를 추가.
// (기본값으로 항상 나오는 메시지가 아님에 주의)
function buildInitialMessages(fromTodaySkin) {
  const now = new Date();

  const messages = [
    {
      id: 1,
      role: "bot",
      text: "안녕하세요! 끼끼의 피부상담소입니다.\n무엇이 궁금하신가요?",
    },
  ];

  if (fromTodaySkin) {
    messages.push({
      id: 2,
      role: "bot",
      text: `오늘의 분석 결과에서 어떤 부분이 궁금하신가요?\n→ ${getTodayLabel()} 투데이스킨 첨부됨`,
      time: formatTimeWithUnits(now),
    });
  }

  return messages;
}

// TODO: 실제 AI 응답 API 연동 필요.
// 피그마 댓글("사용자가 어떤 말을 하던 대답할 수 있어야 함 / 정해진 질문·답변 쌍은 없어야 함")에 따라
// 키워드 매칭(if message.includes("트러블")...) 방식은 걷어냈고, 여기에 실제 엔드포인트만 연결하면 됨.
async function fetchBotReply(userMessage) {
  await new Promise((resolve) => setTimeout(resolve, 600)); // mock 지연
  return `"${userMessage}" 확인했어요. 피부 기록과 생활 습관을 바탕으로 더 정확한 분석을 도와드릴게요.`;
}

export default function ChatRoom() {
  const navigate = useNavigate();
  const location = useLocation();

  // 투데이스킨 탭 → 챗봇 탭으로 이동했을 때만 true.
  // (BottomNav 쪽에서 navigate("/chat", { state: { fromTodaySkin: true } }) 로 넘겨줘야 함)
  const fromTodaySkin = Boolean(location.state?.fromTodaySkin);

  const [messages, setMessages] = useState(() =>
    buildInitialMessages(fromTodaySkin)
  );
  const [input, setInput] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const photoInputRef = useRef(null);
  const messageEndRef = useRef(null);
  const nextIdRef = useRef(fromTodaySkin ? 3 : 2); // 초기 메시지 개수에 따라 다음 id 시작값 분기

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isReplying]);

  const addBotReply = async (userMessage) => {
    setIsReplying(true);
    const replyText = await fetchBotReply(userMessage);

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: nextIdRef.current++,
        role: "bot",
        text: replyText,
        time: formatTime(),
      },
    ]);
    setIsReplying(false);
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
        time: formatTime(),
      },
    ]);

    setInput("");
    setIsMenuOpen(false);
    addBotReply(text);
  };

  // 4-3-1: 사진을 실제로 읽어서(base64) 미리보기로 첨부
  const handlePhotoAttach = (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result;
      const caption = `사진을 첨부했어요: ${selectedFile.name}`;

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: nextIdRef.current++,
          role: "user",
          image: imageUrl,
          text: caption,
          time: formatTime(),
        },
      ]);

      setIsMenuOpen(false);
      addBotReply(caption);
    };
    reader.readAsDataURL(selectedFile);

    event.target.value = "";
  };

  return (
    <Room>
      <Header>
        <BackButton onClick={() => navigate(-1)} aria-label="뒤로가기">
          ‹
        </BackButton>
        <MenuButton
          onClick={() => setIsSidebarOpen(true)}
          aria-label="채팅 기록 열기"
        >
          ☰
        </MenuButton>
      </Header>

      {isSidebarOpen && (
        <ChatSidebar
          onClose={() => setIsSidebarOpen(false)}
          onSelectChat={() => setIsSidebarOpen(false)}
        />
      )}

      <Conversation>
        <DateText>{getTodayLabel()}</DateText>

        {messages.map((message) => (
          <ChatBubble key={message.id} {...message} />
        ))}

        {isReplying && <ChatBubble role="bot" isTyping />}
        <div ref={messageEndRef} />
      </Conversation>

      <InputArea>
        {isMenuOpen && (
          <ChatPlusMenu
            onPhotoClick={() => photoInputRef.current?.click()}
            onFileClick={() => setIsMenuOpen(false)}
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
          onChange={handlePhotoAttach}
        />
      </InputArea>
    </Room>
  );
}