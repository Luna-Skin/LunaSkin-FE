import styled from "styled-components";
import closeIcon from "../../assets/icons/modal_close.svg";

const Overlay = styled.div`
  position: fixed;
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
  height: 152px;
  flex-shrink: 0;
  border-radius: 18px;
  border: 1.5px solid rgba(0, 0, 0, 0.1);
  background: #fff;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;

`;

const Question = styled.p`
  margin: 0;
  color: #2c2c2c;
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 17px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 32px;
`;

const AnswerButton = styled.button`
  display: flex;
  width: 139px;
  height: 52px;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  border: none;
  cursor: pointer;
  background: ${({ $variant }) => ($variant === "primary" ? "#a985e7" : "#f0e8ff")};
  color: ${({ $variant }) => ($variant === "primary" ? "#ffffff" : "#a985e7")};
  font-family: "Pretendard Variable";
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

export default function MakeupCheckModal({ onNoMakeup, onHasMakeup, onClose }) {
  return (
    <Overlay onClick={onClose}>
      <Container onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <img src={closeIcon} alt="닫기" />
        </CloseButton>

        <Question>현재 메이크업을 한 상태인가요?</Question>

        <ButtonRow>
          <AnswerButton onClick={onNoMakeup}>안 했어요</AnswerButton>
          <AnswerButton $variant="primary" onClick={onHasMakeup}>했어요</AnswerButton>
        </ButtonRow>
      </Container>
    </Overlay>
  );
}