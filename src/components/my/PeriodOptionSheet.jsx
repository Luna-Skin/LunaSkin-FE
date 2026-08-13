import { useRef, useState } from "react";
import styled from "styled-components";

const DEFAULT_HEIGHT = 320; // 기본 노출 길이
const MAX_HEIGHT_VH = 80; // 최대로 끌어올렸을 때 화면 대비 비율

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 30;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  background: rgba(0, 0, 0, 0.25);
`;

const Sheet = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  width: min(100%, 402px);
  height: ${({ $height }) => $height}px;
  max-height: ${MAX_HEIGHT_VH}vh;
  border-radius: 18px 18px 0 0;
  background: #fff;
  transition: ${({ $isDragging }) => ($isDragging ? "none" : "height 0.2s ease")};
`;

const HandleArea = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px 0 6px;
  cursor: grab;
  touch-action: none;
`;

const HandleBar = styled.div`
  width: 40px;
  height: 4px;
  border-radius: 2px;
  background: #e0e0e0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px 12px;

  h2 {
    font-size: 16px;
  }
`;

const CloseButton = styled.button`
  border: 0;
  background: transparent;
  color: #aaa;
  font-size: 24px;
  cursor: pointer;
`;

const OptionList = styled.div`
  flex: 1;
  min-height: 0;
  padding: 0 16px 20px;
  overflow-y: auto;

  /* 스크롤은 되지만 스크롤바는 숨김 */
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const OptionButton = styled.button`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 7px 0;
  border: 0;
  background: transparent;
  color: #333;
  text-align: left;
  font-size: 14px;
  cursor: pointer;
`;

const Check = styled.span`
  color: #9b6dff;
  font-size: 18px;
`;

export default function PeriodOptionSheet({
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
}) {
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartY = useRef(0);
  const dragStartHeight = useRef(0);

  const handlePointerDown = (event) => {
    setIsDragging(true);
    dragStartY.current = event.clientY;
    dragStartHeight.current = height;
    event.target.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!isDragging) return;

    const deltaY = dragStartY.current - event.clientY; // 위로 끌면 양수
    const maxHeightPx = window.innerHeight * (MAX_HEIGHT_VH / 100);
    const nextHeight = Math.min(
      maxHeightPx,
      Math.max(160, dragStartHeight.current + deltaY),
    );

    setHeight(nextHeight);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <Overlay>
      <Sheet $height={height} $isDragging={isDragging}>
        <HandleArea
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <HandleBar />
        </HandleArea>

        <Header>
          <h2>{title}</h2>
          <CloseButton type="button" onClick={onClose} aria-label="닫기">
            ×
          </CloseButton>
        </Header>

        <OptionList>
          {options.map((option) => (
            <OptionButton
              key={option}
              type="button"
              onClick={() => onSelect(option)}
            >
              {option}
              {selectedValue === option && <Check>✓</Check>}
            </OptionButton>
          ))}
        </OptionList>
      </Sheet>
    </Overlay>
  );
}