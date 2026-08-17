import { useRef, useState } from "react";
import styled from "styled-components";

const LONG_PRESS_DURATION = 500;

const Thumbnail = styled.div`
  position: relative;
  width: 90px;
  height: 120px;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  width: 67px;
  height: 38px;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  border: 1px solid #d9d9d9;
  background: #f7f2ff;
  cursor: pointer;
`;

const DeleteLabel = styled.span`
  color: #2c2c2c;
  font-family: "Pretendard Variable";
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
`;

// photoUrl: 사진 경로. onDelete: 삭제 버튼 눌렀을 때 실행할 콜백
// 사진을 약 0.5초 이상 누르고 있어야 삭제 버튼이 뜸(진짜 롱프레스). 짧게 탭하면 아무 반응 없음
export default function PhotoThumbnail({ photoUrl, onDelete }) {
  const [showDelete, setShowDelete] = useState(false);
  const timerRef = useRef(null);
  const longPressedRef = useRef(false);

  const startPress = () => {
    longPressedRef.current = false;
    timerRef.current = setTimeout(() => {
      longPressedRef.current = true;
      setShowDelete(true);
    }, LONG_PRESS_DURATION);
  };

  const cancelPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleClick = () => {
    if (longPressedRef.current) {
      longPressedRef.current = false;
      return;
    }
    if (showDelete) setShowDelete(false);
  };

  return (
    <Thumbnail
      onPointerDown={startPress}
      onPointerUp={cancelPress}
      onPointerLeave={cancelPress}
      onPointerCancel={cancelPress}
      onClick={handleClick}
    >
      <img src={photoUrl} alt="" draggable={false} />
      {showDelete && (
        <DeleteButton
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
        >
          <DeleteLabel>삭제</DeleteLabel>
        </DeleteButton>
      )}
    </Thumbnail>
  );
}