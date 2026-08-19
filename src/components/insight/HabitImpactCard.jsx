import styled from "styled-components";

const Card = styled.article`
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 68px;
  padding: 16px;
  box-sizing: border-box;

  border: 1.5px solid rgba(0, 0, 0, 0.1);
  border-radius: 18px;
  background: #fff;

  font-family: "Pretendard Variable", Pretendard, sans-serif;
`;

const EmojiBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 36px;
  height: 36px;
  flex-shrink: 0;

  border-radius: 11px;
  background: #f0e8ff;

  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 20px;
  font-weight: 500;
  line-height: 1;
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;

  color: #2d2d2d;
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
  word-break: keep-all;
`;

const Result = styled.span`
  flex-shrink: 0;

  color: #825FBD;
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: normal;
  white-space: nowrap;
`;

export default function HabitImpactCard({
  emoji,
  title,
  result,
}) {
  return (
    <Card>
      <EmojiBox>{emoji}</EmojiBox>

      <Content>{title}</Content>

      <Result>{result}</Result>
    </Card>
  );
}