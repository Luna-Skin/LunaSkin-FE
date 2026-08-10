import styled, { keyframes } from "styled-components";
import kikiAvatar from "../../assets/images/chat kki kki.png";

const Row = styled.div`
  display: flex;
  justify-content: ${({ $isUser }) => ($isUser ? "flex-end" : "flex-start")};
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 12px;
`;

const Avatar = styled.div`
  display: grid;
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  place-items: center;
  overflow: hidden;
  border: 1px solid #e7e1ee;
  border-radius: 50%;
  background: #fff;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// 4-2-2 / 4-2-3: AI는 오른쪽 여백 65px, 사용자는 왼쪽 여백 80px 이내로 줄바꿈
// (Room max-width 402px, Conversation padding 28px 기준 역산한 값)
const MessageGroup = styled.div`
  max-width: ${({ $isUser }) => ($isUser ? "294px" : "259px")};
`;

const Bubble = styled.div`
  padding: ${({ $hasImage }) => ($hasImage ? "6px" : "12px 14px")};
  border: ${({ $isUser }) => ($isUser ? "none" : "1px solid #ddd")};
  border-radius: ${({ $isUser }) =>
    $isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px"};
  background: ${({ $isUser }) => ($isUser ? "#C6A5FF" : "#fff")};
  color: #222;
  font-size: 14px;
  line-height: 1.45;
  white-space: pre-wrap;
  word-break: break-word;
`;

const BubbleImage = styled.img`
  display: block;
  width: 100%;
  max-width: 220px;
  border-radius: 14px;
`;

const ImageCaption = styled.p`
  margin: 6px 4px 2px;
  font-size: 12px;
  opacity: 0.85;
`;

const Time = styled.p`
  margin-top: 4px;
  color: #aaa;
  font-size: 10px;
`;

const bounce = keyframes`
  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
  40% { transform: translateY(-3px); opacity: 1; }
`;

const Dot = styled.span`
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-right: 3px;
  border-radius: 50%;
  background: #b9aecb;
  animation: ${bounce} 1.2s infinite ease-in-out;
  animation-delay: ${({ $delay }) => $delay}s;

  &:last-child {
    margin-right: 0;
  }
`;

// 다른 곳(ChatRoom)에서도 시간 표시용으로 재사용
export function formatTime(date = new Date()) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours < 12 ? "오전" : "오후";
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${period} ${displayHour}:${String(minutes).padStart(2, "0")}`;
}

export default function ChatBubble({
  role,
  text,
  time,
  image,
  isTyping = false,
}) {
  const isUser = role === "user";

  return (
    <Row $isUser={isUser}>
      {!isUser && (
        <Avatar>
          <AvatarImage src={kikiAvatar} alt="끼끼" />
        </Avatar>
      )}

      <MessageGroup $isUser={isUser}>
        <Bubble $isUser={isUser} $hasImage={!!image}>
          {isTyping ? (
            <>
              <Dot $delay={0} />
              <Dot $delay={0.15} />
              <Dot $delay={0.3} />
            </>
          ) : image ? (
            <>
              <BubbleImage src={image} alt="첨부 이미지" />
              {text && <ImageCaption>{text}</ImageCaption>}
            </>
          ) : (
            text
          )}
        </Bubble>
        {!isTyping && <Time>{time ?? formatTime()}</Time>}
      </MessageGroup>
    </Row>
  );
}