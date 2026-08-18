import styled, { keyframes } from "styled-components";
import kikiAvatar from "../../assets/icons/chat kki kki.svg";

const Row = styled.div`
  display: flex;

  justify-content: ${({ $isUser }) =>
    $isUser
      ? "flex-end"
      : "flex-start"};

  align-items: flex-start;

  gap: 8px;

  width: 100%;
  min-width: 0;

  margin-bottom: 12px;

  font-family: "Pretendard Variable",
    Pretendard, sans-serif;
`;

const Avatar = styled.div`
  display: grid;

  width: 48px;
  height: 48px;

  flex-shrink: 0;

  place-items: center;

  overflow: hidden;

  border: 1.5px solid #eaeaea;
  border-radius: 50%;

  background: #fff;
`;

const AvatarImage = styled.img`
  display: block;

  width: 39px;
  height: 30px;

  object-fit: contain;
`;

const MessageGroup = styled.div`
  min-width: 0;

  max-width: ${({ $isUser }) =>
    $isUser
      ? "calc(100% - 80px)"
      : "calc(100% - 65px - 50px)"};
`;

const Bubble = styled.div`
  width: fit-content;
  max-width: 100%;

  box-sizing: border-box;

  padding: ${({ $hasImage }) =>
    $hasImage
      ? "6px"
      : "12px"};

  border: 1px solid #d9d9d9;

  border-radius: ${({ $isUser }) =>
    $isUser
      ? "16px 16px 4px 16px"
      : "16px"};

  background: ${({ $isUser }) =>
    $isUser
      ? "#cfb4fd"
      : "#fff"};

  color: ${({ $isUser }) =>
    $isUser
      ? "#fff"
      : "#2c2c2c"};

  font-family: "Pretendard Variable",
    Pretendard, sans-serif;
  font-size: 15px;
  font-weight: 500;
  line-height: 20px;

  white-space: pre-wrap;
  overflow-wrap: anywhere;
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

  color: #2c2c2c;

  font-family: "Pretendard Variable",
    Pretendard, sans-serif;
  font-size: 15px;
  font-weight: 500;
  line-height: 20px;

  overflow-wrap: anywhere;
  word-break: break-word;
`;

const Time = styled.p`
  margin: 4px 0 0;

  color: #a7a7a7;

  font-family: "Pretendard Variable",
    Pretendard, sans-serif;
  font-size: 10px;
  font-weight: 500;
  line-height: 20px;
`;

const bounce = keyframes`
  0%, 80%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }

  40% {
    transform: translateY(-3px);
    opacity: 1;
  }
`;

const Dot = styled.span`
  display: inline-block;

  width: 6px;
  height: 6px;

  margin-right: 3px;

  border-radius: 50%;

  background: #b9aecb;

  animation: ${bounce}
    1.2s infinite ease-in-out;

  animation-delay: ${({ $delay }) =>
    $delay}s;

  &:last-child {
    margin-right: 0;
  }
`;

export function formatTime(
  date = new Date(),
) {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const period =
    hours < 12 ? "오전" : "오후";

  const displayHour =
    hours % 12 === 0
      ? 12
      : hours % 12;

  return `${period} ${displayHour}:${String(
    minutes,
  ).padStart(2, "0")}`;
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
          <AvatarImage
            src={kikiAvatar}
            alt="끼끼"
          />
        </Avatar>
      )}

      <MessageGroup
        $isUser={isUser}
      >
        <Bubble
          $isUser={isUser}
          $hasImage={!!image}
        >
          {isTyping ? (
            <>
              <Dot $delay={0} />
              <Dot $delay={0.15} />
              <Dot $delay={0.3} />
            </>
          ) : image ? (
            <>
              <BubbleImage
                src={image}
                alt="첨부 이미지"
              />

              {text && (
                <ImageCaption>
                  {text}
                </ImageCaption>
              )}
            </>
          ) : (
            text
          )}
        </Bubble>

        {!isTyping && (
          <Time>
            {time ?? formatTime()}
          </Time>
        )}
      </MessageGroup>
    </Row>
  );
}