import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Stepper from "./Stepper";

const SHEET_HEIGHT = 168;
const DISMISS_THRESHOLD = 60; // 이 이상 끌어내리면 닫힘으로 처리

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
  transition: ${({ $dragging }) => ($dragging ? "none" : "transform 0.25s ease")};
  will-change: transform;
`;

const DragHandle = styled.div`
  width: 80px;
  height: 4px;
  border-radius: 21px;
  background: #c6c6c6;
  margin-top: 8px;
  cursor: grab;
  touch-action: none;

  &:active {
    cursor: grabbing;
  }
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
  const [dragging, setDragging] = useState(false);
  const [closing, setClosing] = useState(false);
  const dragStartYRef = useRef(0);
  const dragStartTranslateRef = useRef(0);

  // 처음엔 화면 아래(SHEET_HEIGHT만큼)에 숨겨서 그려졌다가, 다음 프레임에 0으로
  // 바뀌면서 transition이 그 변화를 애니메이션으로 보여줌
  useEffect(() => {
    const frame = requestAnimationFrame(() => setTranslateY(0));
    return () => cancelAnimationFrame(frame);
  }, []);

  // 실제로 언마운트하지 않고, 일단 다 내려간 위치로 애니메이션만 시작함
  const requestClose = () => {
    setClosing(true);
    setTranslateY(SHEET_HEIGHT);
  };

  // transform 애니메이션이 끝난 시점에만(그리고 닫는 중일 때만) 진짜로 onClose 호출
  const handleTransitionEnd = (event) => {
    if (event.propertyName === "transform" && closing) {
      onClose();
    }
  };

  const handlePointerDown = (event) => {
    setDragging(true);
    dragStartYRef.current = event.clientY;
    dragStartTranslateRef.current = translateY;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!dragging) return;

    const deltaY = event.clientY - dragStartYRef.current;
    // 위로는 원래 자리보다 더 못 올라가게 0에서 막음
    const next = Math.max(0, dragStartTranslateRef.current + deltaY);
    setTranslateY(next);
  };

  const handlePointerUp = () => {
    if (!dragging) return;

    setDragging(false);

    if (translateY > DISMISS_THRESHOLD) {
      requestClose();
    } else {
      setTranslateY(0);
    }
  };

  const displayValue = formatValue ? formatValue(value) : value;

  return (
    <Overlay onClick={requestClose}>
      <Sheet
        $translateY={translateY}
        $dragging={dragging}
        onClick={(event) => event.stopPropagation()}
        onTransitionEnd={handleTransitionEnd}
      >
        <DragHandle
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />

        <Title>{label}</Title>

        <ControlRow>
          <ValueText>{displayValue}</ValueText>
          <Stepper value={value} min={min} max={max} step={step} onChange={onChange} />
        </ControlRow>
      </Sheet>
    </Overlay>
  );
}