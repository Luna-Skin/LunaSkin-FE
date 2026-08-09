import styled from "styled-components";

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
  display: flex;
  width: 354px;
  height: 168px;
  padding: 24px 28px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 28px;
  flex-shrink: 0;
  border-radius: 18px;
  border: 1.5px solid rgba(0, 0, 0, 0.1);
  background: #fff;
  box-sizing: border-box;
`;

const Message = styled.p`
  margin: 0;
  color: #2c2c2c;
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 17px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const CloseButton = styled.button`
  display: flex;
  width: 137px;
  height: 52px;
  padding: 14px 0;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 18px;
  border: none;
  background: #a985e7;
  cursor: pointer;
  box-sizing: border-box;
`;

const CloseLabel = styled.span`
  color: #fff;
  text-align: right;
  font-family: "Pretendard Variable";
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

export default function MakeupRetryModal({ onClose }) {
  return (
    <Overlay onClick={onClose}>
      <Container onClick={(e) => e.stopPropagation()}>
        <Message>정확한 피부 분석을 위해 메이크업을 지우고 다시 시도해주세요!</Message>
        <CloseButton onClick={onClose}>
          <CloseLabel>닫기</CloseLabel>
        </CloseButton>
      </Container>
    </Overlay>
  );
}