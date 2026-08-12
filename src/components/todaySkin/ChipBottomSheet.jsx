import { useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";
import ToggleChip from "./ToggleChip";

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
  padding-bottom: 32px;
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

const ChipList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  width: 402px;
  margin-top: 40px;
`;

export default function ChipBottomSheet({ label, options, isSelected, onSelect, onClose }) {
  const sheetRef = useRef(null);
  const dragStartYRef = useRef(0);
  const dragStartTranslateRef = useRef(0);

  const [translateY, setTranslateY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [closing, setClosing] = useState(false);

  // 칩 개수(식사 8개 vs 피부상태 4개)에 따라 시트 실제 높이가 달라져서, 렌더링 직후 실제 높이를 재서 그만큼 아래에 숨겨뒀다가 다음 프레임에 0으로
  // 이동시키면서 슬라이드업 애니메이션을 재생함
  useLayoutEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return undefined;

    const height = sheet.scrollHeight;
    setTranslateY(height);

    const frame = requestAnimationFrame(() => setTranslateY(0));
    return () => cancelAnimationFrame(frame);
  }, [options]);

  // 실제로 언마운트하지 않고, 지금 실측한 높이만큼 내려간 위치로 애니메이션만 시작함..
  const requestClose = () => {
    const height = sheetRef.current?.scrollHeight ?? 0;
    setClosing(true);
    setTranslateY(height);
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

  return (
    <Overlay onClick={requestClose}>
      <Sheet
        ref={sheetRef}
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

        <ChipList>
          {options.map((option) => (
            <ToggleChip
              key={option}
              label={option}
              selected={isSelected(option)}
              onClick={() => onSelect(option)}
            />
          ))}
        </ChipList>
      </Sheet>
    </Overlay>
  );
}