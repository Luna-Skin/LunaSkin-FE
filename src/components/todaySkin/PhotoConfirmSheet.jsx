import { useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";
import checkIcon from "../../assets/icons/photo_checklist_check.svg";

const COLLAPSED_HEIGHT = 206;

const Sheet = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 402px;
  min-height: ${COLLAPSED_HEIGHT}px;
  padding: 7px 24px 16px;
  box-sizing: border-box;
  border-radius: 18px 18px 0 0;
  background: #f0e8ff;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: ${({ $dragging }) =>
    $dragging ? "none" : "transform 0.25s ease"};
  transform: translateY(${({ $translateY }) => $translateY}px);
  will-change: transform;
`;

const HandleArea = styled.div`
  width: 100%;
  height: 23px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-shrink: 0;
  cursor: grab;
  touch-action: none;

  &:active {
    cursor: grabbing;
  }
`;

const DragHandle = styled.div`
  width: 40px;
  height: 3px;
  border-radius: 5px;
  background: rgba(119, 110, 145, 0.8);
`;

const SheetTitle = styled.p`
  width: 354px;
  margin: 0 0 16px;
  color: #000;
  font-family: "Pretendard Variable";
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const ChipGroup = styled.div`
  width: 354px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 28px;
`;

const Chip = styled.div`
  display: flex;
  width: fit-content;
  min-width: 80px;
  height: 27px;
  padding: 6px 8px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  box-sizing: border-box;
  border-radius: 16px;
  border: 1px solid #ae91e0;
  background: #f8f6fc;
  white-space: nowrap;

  img {
    width: 15px;
    height: 15px;
    flex-shrink: 0;
  }
`;

const ChipLabel = styled.span`
  color: #2d1b4e;
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 13.75px;
  white-space: nowrap;
`;

const ContinueButton = styled.button`
  display: flex;
  width: 354px;
  height: 43px;
  padding: 4px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border: none;
  border-radius: 18px;
  background: #ae92e0;
  margin-bottom: 8px;
  cursor: pointer;
  color: #fff;
  font-family: "Pretendard Variable";
  font-size: 18px;
  font-weight: 700;
`;

const RetakeButton = styled.button`
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  color: #000;
  font-family: "Pretendard Variable";
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

export default function PhotoConfirmSheet({
  features,
  onContinue,
  onRetake,
}) {
  const sheetRef = useRef(null);
  const dragStartYRef = useRef(0);
  const dragStartTranslateRef = useRef(0);

  const [translateY, setTranslateY] = useState(0);
  const [maxTranslate, setMaxTranslate] = useState(0);
  const [dragging, setDragging] = useState(false);

  // 206px보다 커진 영역만 처음에 아래로 숨김
  useLayoutEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;

    const fullHeight = sheet.scrollHeight;
    const hiddenHeight = Math.max(0, fullHeight - COLLAPSED_HEIGHT);

    setMaxTranslate(hiddenHeight);
    setTranslateY(hiddenHeight);
  }, [features]);

  const handlePointerDown = (event) => {
    if (maxTranslate === 0) return;

    setDragging(true);

    dragStartYRef.current = event.clientY;
    dragStartTranslateRef.current = translateY;

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!dragging) return;

    const deltaY = event.clientY - dragStartYRef.current;
    const nextTranslate = dragStartTranslateRef.current + deltaY;
    const clamped = Math.min(maxTranslate, Math.max(0, nextTranslate));

    setTranslateY(clamped);
  };

  const handlePointerUp = () => {
    if (!dragging) return;

    setDragging(false);

    if (translateY < maxTranslate / 2) {
      setTranslateY(0);
    } else {
      setTranslateY(maxTranslate);
    }
  };

  return (
    <Sheet
      ref={sheetRef}
      $translateY={translateY}
      $dragging={dragging}
    >
      <HandleArea
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <DragHandle />
      </HandleArea>

      <SheetTitle>사진을 제출하기 전에,</SheetTitle>

      <ChipGroup>
        {features.map((feature) => (
          <Chip key={feature}>
            <img src={checkIcon} alt="" />
            <ChipLabel>{feature}</ChipLabel>
          </Chip>
        ))}
      </ChipGroup>

      <ContinueButton type="button" onClick={onContinue}>
        계속 하기
      </ContinueButton>

      <RetakeButton type="button" onClick={onRetake}>
        다시 찍기
      </RetakeButton>
    </Sheet>
  );
}