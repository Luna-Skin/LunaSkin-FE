import { useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";
import ToggleChip from "./ToggleChip";

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

const ChipList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  width: 402px;
  margin-top: 40px;
`;

// 손잡이를 드래그하는 대신 클릭하면 닫힘으로 수정
export default function ChipBottomSheet({ label, options, isSelected, onSelect, onClose }) {
  const sheetRef = useRef(null);

  const [translateY, setTranslateY] = useState(0);
  const [closing, setClosing] = useState(false);

  useLayoutEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return undefined;

    const height = sheet.scrollHeight;
    setTranslateY(height);

    const frame = requestAnimationFrame(() => setTranslateY(0));
    return () => cancelAnimationFrame(frame);
  }, [options]);

  const requestClose = () => {
    const height = sheetRef.current?.scrollHeight ?? 0;
    setClosing(true);
    setTranslateY(height);
  };

  const handleTransitionEnd = (event) => {
    if (event.propertyName === "transform" && closing) {
      onClose();
    }
  };

  return (
    <Overlay onClick={requestClose}>
      <Sheet
        ref={sheetRef}
        $translateY={translateY}
        onClick={(event) => event.stopPropagation()}
        onTransitionEnd={handleTransitionEnd}
      >
        <DragHandle type="button" onClick={requestClose} aria-label="닫기" />

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