import styled from "styled-components";

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
  border: 1px solid #e7e1ee;
  border-radius: 50%;
  background: #fff;
  font-size: 21px;
`;

const MessageGroup = styled.div`
  max-width: 76%;
`;

const Bubble = styled.div`
  padding: 12px 14px;
  border: ${({ $isUser }) => ($isUser ? "none" : "1px solid #ddd")};
  border-radius: ${({ $isUser }) =>
    $isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px"};
  background: ${({ $isUser }) => ($isUser ? "#C6A5FF" : "#fff")};
  color: #222;
  font-size: 14px;
  line-height: 1.45;
  white-space: pre-wrap;
`;

const Time = styled.p`
  margin-top: 4px;
  color: #aaa;
  font-size: 10px;
`;

export default function ChatBubble({ role, text, time = "오후 2:00" }) {
  const isUser = role === "user";

  return (
    <Row $isUser={isUser}>
      {!isUser && <Avatar>🤓</Avatar>}

      <MessageGroup>
        <Bubble $isUser={isUser}>{text}</Bubble>
        <Time>{time}</Time>
      </MessageGroup>
    </Row>
  );
}