import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ControlButton = styled.button`
  display: flex;
  width: 28px;
  height: 28px;
  justify-content: center;
  align-items: center;
  border-radius: 999px;
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

const ValueText = styled.span`
  color: #000;
  text-align: right;
  font-family: "Pretendard Variable";
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

export default function Stepper({ value, unit, min = 0, max = 12, onChange }) {
  const handleDecrease = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrease = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <Wrapper>
      <ControlButton onClick={handleDecrease} disabled={value <= min}>
        <ButtonLabel>-</ButtonLabel>
      </ControlButton>
      <ValueText>
        {value}{unit}
      </ValueText>
      <ControlButton onClick={handleIncrease} disabled={value >= max}>
        <ButtonLabel>+</ButtonLabel>
      </ControlButton>
    </Wrapper>
  );
}