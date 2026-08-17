import styled from "styled-components";
import MinusIcon from "../../assets/icons/stepper-minus.svg";
import PlusIcon from "../../assets/icons/stepper-plus.svg";

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
  flex-shrink: 0;
  padding: 0;
  border: 1px solid #ede8f8;
  border-radius: 50%;
  background: #f8f6fc;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }
`;

const ControlIcon = styled.img`
  width: 10px;
  height: 10px;
  object-fit: contain;
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
      <ControlButton
        type="button"
        onClick={handleDecrease}
        disabled={value <= min}
        aria-label="값 감소"
      >
        <ControlIcon src={MinusIcon} alt="" />
      </ControlButton>

      <ControlButton
        type="button"
        onClick={handleIncrease}
        disabled={value >= max}
        aria-label="값 증가"
      >
        <ControlIcon src={PlusIcon} alt="" />
      </ControlButton>
    </Wrapper>
  );
}

function roundToStep(n) {
  return Math.round(n * 10) / 10;
}