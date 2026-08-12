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
  width: 354px;
  padding-top: 24px;
  padding-bottom: 24px;
  border-radius: 18px;
  border: 1.5px solid rgba(0, 0, 0, 0.1);
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 32px;
  align-items: center;
  box-sizing: border-box;
`;

const Message = styled.p`
  margin: 0;
  padding: 0 28px;
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
`;

const ActionButton = styled.button`
  display: inline-flex;
  padding: 14px 32px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 18px;
  border: none;
  cursor: pointer;
  background: ${({ $variant }) => ($variant === "dark" ? "#a985e7" : "#f0e8ff")};
  color: ${({ $variant }) => ($variant === "dark" ? "#fff" : "#a985e7")};
  font-family: "Pretendard Variable";
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

// message: 문자열 또는 <br/> 포함한 JSX 노드 (줄바꿈이 필요할 때)
// options: [{ label, onClick, variant: "light" | "dark" }, ...] — 보통 2개,
//   light(연보라)=취소 성격, dark(진보라)=확정 성격
export default function ConfirmModal({ message, options, onClose }) {
  return (
    <Overlay onClick={onClose}>
      <Container onClick={(event) => event.stopPropagation()}>
        <Message>{message}</Message>
        <ButtonRow>
          {options.map((option) => (
            <ActionButton key={option.label} type="button" $variant={option.variant} onClick={option.onClick}>
              {option.label}
            </ActionButton>
          ))}
        </ButtonRow>
      </Container>
    </Overlay>
  );
}