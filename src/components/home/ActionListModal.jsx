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
  flex-shrink: 0;
  border-radius: 18px;
  border: 1.5px solid rgba(0, 0, 0, 0.1);
  background: #fff;
  padding-bottom: 24px;
  box-sizing: border-box;
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

const TitleLabel = styled.div`
  padding-top: 24px;
  text-align: center;
  color: #2c2c2c;
  font-family: "Pretendard Variable";
  font-size: 17px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const ButtonList = styled.div`
  margin-top: 21px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const OptionButton = styled.button`
  width: 306px;
  height: 52px;
  border-radius: 18px;
  background: #f0e8ff;
  border: none;
  cursor: pointer;
  color: #2c2c2c;
  font-family: "Pretendard Variable";
  font-size: 17px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  &:disabled {
    color: #a6a6a6;
    cursor: not-allowed;
  }
`;

// options: [{ label, onClick, disabled? }, ...]
export default function ActionListModal({ title, options, onClose }) {
  return (
    <Overlay onClick={onClose}>
      <Container onClick={(event) => event.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <img src={closeIcon} alt="닫기" />
        </CloseButton>

        <TitleLabel>{title}</TitleLabel>

        <ButtonList>
          {options.map((option) => (
            <OptionButton key={option.label} onClick={option.onClick} disabled={option.disabled}>
              {option.label}
            </OptionButton>
          ))}
        </ButtonList>
      </Container>
    </Overlay>
  );
}