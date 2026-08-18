import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import ChatBubble, { formatTime } from "../../components/chat/ChatBubble";
import ChatInputBar from "../../components/chat/ChatInputBar";
import ChatPlusMenu from "../../components/chat/ChatPlusMenu";
import { useChatContext } from "../../components/chat/ChatContext";

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

export default function ChatRoom() {
  const navigate = useNavigate();
  const { chatId } = useParams();

  const { getChat, fetchChatMessages } = useChatContext();

  const [input, setInput] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [attachedImage, setAttachedImage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);

  const photoInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const messageEndRef = useRef(null);

  const chat = getChat(chatId);

  // 방 진입 시 서버에서 대화 내역 불러오기
  // (분석 기반으로 만든 방이면 서버가 이미 "오늘의 분석 결과..." 안내 메시지를
  //  첫 메시지로 넣어서 내려줄 것으로 기대)
  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setIsLoadingMessages(true);
        const data = await fetchChatMessages(chatId);
        if (isMounted) setMessages(data ?? []);
      } catch (error) {
        console.error("대화 내역을 불러오지 못했습니다.", error);
        if (isMounted) setMessages([]);
      } finally {
        if (isMounted) setIsLoadingMessages(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [chatId, fetchChatMessages]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = () => {
    const text = input.trim();

    // 글도 없고 사진도 없으면 전송하지 않음
    if (!text && !attachedImage) return;

    // TODO: WebSocket(/pub/chat/send) 연결되면 여기서 실제 전송
    // 지금은 화면 확인용으로만 로컬에 추가
    const userMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      text,
      image: attachedImage?.url ?? null,
      time: formatTime(),
    };

    setMessages((current) => [...current, userMessage]);

    setInput("");
    setAttachedImage(null);
    setIsMenuOpen(false);
  };

  // 사진 선택
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

  // 파일 선택
  const handleFileAttach = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    // TODO: uploadChatFile(chatId, selectedFile) 연결
    const fileMessage = `파일을 첨부했어요: ${selectedFile.name}`;

    setMessages((current) => [
      ...current,
      {
        id: `${Date.now()}-user-file`,
        role: "user",
        text: fileMessage,
        time: formatTime(),
      },
    ]);

    setIsMenuOpen(false);
    event.target.value = "";
  };

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

        {!isLoadingMessages &&
          messages.map((message) => (
            <ChatBubble
              key={message.id ?? message.messageId}
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