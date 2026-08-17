import { useEffect, useState } from "react";
import styled from "styled-components";
import Stepper from "./Stepper";

const SHEET_HEIGHT = 168;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: flex-end;
  z-index: 50;
`;

const Sheet = styled.div`
  width: 402px;
  height: ${SHEET_HEIGHT}px;
  flex-shrink: 0;
  border-radius: 18px 18px 0 0;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  transform: translateY(${({ $translateY }) => $translateY}px);
  transition: transform 0.25s ease;
  will-change: transform;
`;

const DragHandle = styled.button`
  width: 80px;
  height: 4px;
  border-radius: 21px;
  background: #c6c6c6;
  border: none;
  padding: 0;
  margin-top: 8px;
  cursor: pointer;
`;

const Title = styled.p`
  margin: 20px 0 0;
  color: #000;
  font-family: "Pretendard Variable";
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const ControlRow = styled.div`
  width: 354px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 45.5px;
`;

const ValueText = styled.span`
  color: #000;
  text-align: right;
  font-family: "Pretendard Variable";
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

// 손잡이를 드래그하는 대신 클릭하면 닫히도록 수정 
export default function StepperBottomSheet({
  label,
  value,
  min = 0,
  max,
  step = 1,
  formatValue,
  onChange,
  onClose,
}) {
  const [translateY, setTranslateY] = useState(SHEET_HEIGHT);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setTranslateY(0));
    return () => cancelAnimationFrame(frame);
  }, []);

  const requestClose = () => {
    setClosing(true);
    setTranslateY(SHEET_HEIGHT);
  };

  const handleTransitionEnd = (event) => {
    if (event.propertyName === "transform" && closing) {
      onClose();
    }
  };

  const displayValue = formatValue ? formatValue(value) : value;

  return (
    <Overlay onClick={requestClose}>
      <Sheet
        $translateY={translateY}
        onClick={(event) => event.stopPropagation()}
        onTransitionEnd={handleTransitionEnd}
      >
        <DragHandle type="button" onClick={requestClose} aria-label="닫기" />

        <Title>{label}</Title>

        <ControlRow>
          <ValueText>{displayValue}</ValueText>
          <Stepper value={value} min={min} max={max} step={step} onChange={onChange} />
        </ControlRow>
      </Sheet>
    </Overlay>
  );
}