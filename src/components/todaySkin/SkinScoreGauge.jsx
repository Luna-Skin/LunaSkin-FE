import styled from "styled-components";
import SkinScoreRing from "./SkinScoreRing";

const Wrapper = styled.div`
  position: relative;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
`;

const ScoreText = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #2d1b4e;
  font-family: "Pretendard Variable";
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

export default function SkinScoreGauge({ score, size = 100, strokeWidth = 18 }) {
  const clampedScore = Math.min(100, Math.max(0, score));

  return (
    <Wrapper $size={size}>
      <SkinScoreRing progress={clampedScore / 100} size={size} strokeWidth={strokeWidth} />
      <ScoreText>{clampedScore}</ScoreText>
    </Wrapper>
  );
}