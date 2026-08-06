import styled from "styled-components";

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
  width: min(100%, 402px);
  padding: 18px 16px 20px;
  border-radius: 18px 18px 0 0;
  background: #fff;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

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
  return (
    <Overlay>
      <Sheet>
        <Header>
          <h2>{title}</h2>
          <CloseButton type="button" onClick={onClose} aria-label="닫기">
            ×
          </CloseButton>
        </Header>

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
      </Sheet>
    </Overlay>
  );
}