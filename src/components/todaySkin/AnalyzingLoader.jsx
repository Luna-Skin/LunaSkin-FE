import styled, { keyframes } from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding-top: 200px;
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.svg`
  transform-origin: 50% 50%;
  animation: ${spin} 0.9s linear infinite;
`;

const Text = styled.p`
  margin: 0;
  color: #000;
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

export default function AnalyzingLoader({ text = "분석 중입니다" }) {
  return (
    <Wrapper>
      <Spinner width="108" height="108" viewBox="0 0 108 108">
        <defs>
          <linearGradient id="analyzingSpinnerGradient" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#E2C9FC" />
            <stop offset="100%" stopColor="#9B6CE8" />
          </linearGradient>
        </defs>
        <circle
          cx="54"
          cy="54"
          r="50"
          fill="none"
          stroke="url(#analyzingSpinnerGradient)"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </Spinner>
      <Text>{text}</Text>
    </Wrapper>
  );
}