import styled from "styled-components";

const Box = styled.div`
  display: flex;
  width: 354px;
  padding: 16px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
  border-radius: 18px;
  background: #f0ebf8;
  box-sizing: border-box;
`;

const Title = styled.span`
  color: #a876fc;
  font-family: "Pretendard Variable";
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 18.6px;
`;

const Description = styled.p`
  margin: 0;
  color: rgba(0, 0, 0, 0.7);
  font-family: "Pretendard Variable";
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
`;

export default function AiInsightBox({ title = "AI 인사이트", insight }) {
  return (
    <Box>
      <Title>{title}</Title>
      <Description>{insight}</Description>
    </Box>
  );
}