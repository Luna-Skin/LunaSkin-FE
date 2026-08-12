import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ControlButton = styled.button`
  display: flex;
  width: 32px;
  height: 32px;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1 / 1;
  border-radius: 1000px;
  border: 1px solid #ede8f8;
  background: #f8f6fc;
  cursor: pointer;
  padding: 0;

  &:disabled {
    cursor: not-allowed;
  }
`;

const ButtonLabel = styled.span`
  color: #2d1b4e;
  text-align: center;
  font-family: "Noto Sans KR";
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
`;

export default function Stepper({ value, min = 0, max = 12, step = 1, onChange }) {
  const handleDecrease = () => {
    if (value > min) onChange(roundToStep(value - step));
  };

  const handleIncrease = () => {
    if (value < max) onChange(roundToStep(value + step));
  };

  return (
    <Wrapper>
      <ControlButton onClick={handleDecrease} disabled={value <= min}>
        <ButtonLabel>-</ButtonLabel>
      </ControlButton>
      <ControlButton onClick={handleIncrease} disabled={value >= max}>
        <ButtonLabel>+</ButtonLabel>
      </ControlButton>
    </Wrapper>
  );
}

function roundToStep(n) {
  return Math.round(n * 10) / 10;
}