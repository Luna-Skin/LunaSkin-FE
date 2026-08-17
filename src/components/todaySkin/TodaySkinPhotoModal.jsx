import { useState } from "react";
import styled from "styled-components";
import closeIcon from "../../assets/icons/modal_close.svg";
import chevronIcon from "../../assets/icons/photo_modal_chevron.svg";

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

const Container = styled.div`
  position: relative;
  width: 354px;
  height: 472px;
  flex-shrink: 0;
  border-radius: 18px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #fff;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
  padding: 0;
  cursor: pointer;
  z-index: 10;
`;

const CloseIcon = styled.img`
  width: 24px;
  height: 24px;
`;

// 사진 자체를 감싸서, 사진의 실제 렌더링된 너비(width: auto라 매번 다름)를 기준으로
// 좌우 화살표 버튼 위치를 잡을 수 있게 함
const PhotoWrapper = styled.div`
  position: relative;
  display: inline-block;
  line-height: 0;
`;

const Photo = styled.img`
  display: block;
  height: 352px;
  width: auto;
  border-radius: 18px;
`;

// 터치 영역 32.667x32.667, 사진 가장자리에서 4.33px 떨어진 자리에 위치
const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 32.667px;
  height: 32.667px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  z-index: 5;
`;

const PrevButton = styled(NavButton)`
  left: -36.997px;
`;

const NextButton = styled(NavButton)`
  right: -36.997px;
`;

const ChevronImg = styled.img`
  width: 9.545px;
  height: 21px;
  ${({ $flip }) => $flip && "transform: scaleX(-1);"}
`;

// photos: [{ url, angle }, ...] (1~3장)
export default function TodaySkinPhotoModal({ photos, onClose }) {
  const [index, setIndex] = useState(0);

  const currentPhoto = photos[index];
  const hasPrev = index > 0;
  const hasNext = index < photos.length - 1;

  return (
    <Overlay onClick={onClose}>
      <Container onClick={(event) => event.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <CloseIcon src={closeIcon} alt="닫기" />
        </CloseButton>

        <PhotoWrapper>
          <Photo src={currentPhoto.url} alt="촬영한 피부 사진" />

          {hasPrev && (
            <PrevButton type="button" onClick={() => setIndex((i) => i - 1)} aria-label="이전 사진">
              <ChevronImg src={chevronIcon} alt="" />
            </PrevButton>
          )}

          {hasNext && (
            <NextButton type="button" onClick={() => setIndex((i) => i + 1)} aria-label="다음 사진">
              <ChevronImg src={chevronIcon} alt="" $flip />
            </NextButton>
          )}
        </PhotoWrapper>
      </Container>
    </Overlay>
  );
}