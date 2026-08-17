import styled from "styled-components";

const Button = styled.button`
  display: flex;
  width: 354px;
  height: 43px;
  padding: 4px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 18px;
  border: none;
  cursor: pointer;
  background: ${({ disabled }) => (disabled ? "#c6c6c6" : "#a985e7")};

  &:disabled {
    cursor: not-allowed;
  }
`;

const Label = styled.span`
  color: #fff;
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

export default function SaveButton({ label, disabled, onClick }) {
  return (
    <Button type="button" disabled={disabled} onClick={onClick}>
      <Label>{label}</Label>
    </Button>
  );
}