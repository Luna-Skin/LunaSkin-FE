import styled from "styled-components";

const Card = styled.article`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 54px;
  padding: 10px 12px;
  border: 1px solid #e9e9e9;
  border-radius: 14px;
  background: #fff;
`;

const EmojiBox = styled.div`
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border-radius: 9px;
  background: #f4edff;
  font-size: 17px;
`;

const Content = styled.div`
  flex: 1;
  color: #333;
  font-size: 13px;
  font-weight: 500;
`;

const Result = styled.span`
  color: ${({ $color }) => $color};
  font-size: 12px;
  font-weight: 700;
`;

export default function HabitImpactCard({ emoji, title, result, color }) {
  return (
    <Card>
      <EmojiBox>{emoji}</EmojiBox>
      <Content>{title}</Content>
      <Result $color={color}>{result}</Result>
    </Card>
  );
}