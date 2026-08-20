import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import checkIcon from "../../assets/icons/check.svg";

const DEFAULT_HEIGHT = 255;
const MAX_HEIGHT = 650;

const DRAG_MOVE_THRESHOLD = 5;
const SNAP_THRESHOLD = 80;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 30;

  display: flex;
  justify-content: center;
  align-items: flex-end;

  background: rgba(0, 0, 0, 0.2);
`;

const Sheet = styled.section`
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  height: ${({ $height }) => $height}px;
  max-height: ${MAX_HEIGHT}px;

  padding: 8px 24px 20px;
  box-sizing: border-box;

  border-radius: 18px 18px 0 0;
  background: #fff;

  transform: translateY(${({ $visible }) => ($visible ? "0" : "100%")});

  transition: ${({ $isDragging }) =>
    $isDragging
      ? "none"
      : "height 0.25s ease, transform 0.25s ease"};

  will-change: height, transform;
`;

const HandleBar = styled.button`
  width: 80px;
  height: 4px;
  flex-shrink: 0;
  padding: 0;
  margin: 0 0 18px;
  border: 0;
  border-radius: 21px;
  background: #c6c6c6;
  cursor: grab;
  touch-action: none;
  &:active {
    cursor: grabbing;
  }
`;

const Header = styled.div`
  width: 100%;

  margin-bottom: 8px;

  color: #000;
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const OptionList = styled.div`
  width: 100%;
  flex: 1;
  min-height: 0;
  padding: 0;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const OptionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 28px;
  padding: 8px 0;
  border: 0;
  background: transparent;
  color: #2c2c2c;
  text-align: left;
  font-family: "Pretendard Variable";
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  cursor: pointer;
`;

const Check = styled.img`
  width: 15px;
  height: 15px;

  flex-shrink: 0;
  object-fit: contain;
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

  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  const dragStartY = useRef(0);
  const dragStartHeight = useRef(DEFAULT_HEIGHT);
  const dragMoved = useRef(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setVisible(true);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const requestClose = () => {
    setClosing(true);
    setVisible(false);
  };

  const handleTransitionEnd = (event) => {
    if (event.propertyName === "transform" && closing) {
      onClose();
    }
  };

  const handlePointerDown = (event) => {
    setIsDragging(true);

    dragMoved.current = false;
    dragStartY.current = event.clientY;
    dragStartHeight.current = height;

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!isDragging) return;

    const deltaY = dragStartY.current - event.clientY;

    if (Math.abs(deltaY) > DRAG_MOVE_THRESHOLD) {
      dragMoved.current = true;
    }

    const nextHeight = Math.min(
      MAX_HEIGHT,
      Math.max(DEFAULT_HEIGHT, dragStartHeight.current + deltaY),
    );

    setHeight(nextHeight);
  };

  const handlePointerUp = (event) => {
    if (!isDragging) return;

    setIsDragging(false);

    const deltaY = dragStartY.current - event.clientY;

    // 거의 움직이지 않았다면 핸들 클릭으로 판단
    if (!dragMoved.current) {
      setHeight((prev) =>
        prev === MAX_HEIGHT ? DEFAULT_HEIGHT : MAX_HEIGHT,
      );
      return;
    }

    // 위로 충분히 드래그
    if (deltaY > SNAP_THRESHOLD) {
      setHeight(MAX_HEIGHT);
      return;
    }

    // 아래로 충분히 드래그
    if (deltaY < -SNAP_THRESHOLD) {
      setHeight(DEFAULT_HEIGHT);
      return;
    }

    // 애매한 위치에서 손을 놓으면
    // 현재 높이에 가까운 쪽으로 스냅
    const middle = (DEFAULT_HEIGHT + MAX_HEIGHT) / 2;

    setHeight(height >= middle ? MAX_HEIGHT : DEFAULT_HEIGHT);
  };

  const handlePointerCancel = () => {
    setIsDragging(false);

    const middle = (DEFAULT_HEIGHT + MAX_HEIGHT) / 2;

    setHeight(height >= middle ? MAX_HEIGHT : DEFAULT_HEIGHT);
  };

  return (
    <Overlay onClick={requestClose}>
      <Sheet
        $height={height}
        $isDragging={isDragging}
        $visible={visible}
        onClick={(event) => event.stopPropagation()}
        onTransitionEnd={handleTransitionEnd}
      >
        <HandleBar
          type="button"
          aria-label="생리 주기 선택창 크기 조절"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        />

        <Header>{title}</Header>

        <OptionList>
          {options.map((option) => (
            <OptionButton
              key={option}
              type="button"
              onClick={() => onSelect(option)}
            >
              <span>{option}</span>

              {selectedValue === option && (
                <Check src={checkIcon} alt="" />
              )}
            </OptionButton>
          ))}
        </OptionList>
      </Sheet>
    </Overlay>
  );
}