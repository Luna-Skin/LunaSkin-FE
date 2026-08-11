import styled from "styled-components";
import closeIcon from "../../assets/icons/modal_close.svg";

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
`;

const CloseIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const Photo = styled.img`
  display: block;
  height: 352px;
  width: auto;
  border-radius: 18px;
`;

export default function TodaySkinPhotoModal({ photo, onClose }) {
  return (
    <Overlay onClick={onClose}>
      <Container onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <CloseIcon src={closeIcon} alt="닫기" />
        </CloseButton>
        <Photo src={photo} alt="촬영한 피부 사진" />
      </Container>
    </Overlay>
  );
}