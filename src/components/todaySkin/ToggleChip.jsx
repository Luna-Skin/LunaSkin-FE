import styled from "styled-components";

const Chip = styled.button`
  display: flex;
  width: 74.5px;
  height: 26px;
  padding: 6px 12px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 21px;
  border: 1px solid #d9d9d9;
  background: ${({ $selected }) => ($selected ? "#dec4fa" : "#ffffff")};
  box-sizing: border-box;
  cursor: pointer;
`;

const Label = styled.span`
  color: #000;
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

export default function ToggleChip({ label, selected, onClick }) {
  return (
    <Chip type="button" $selected={selected} onClick={onClick}>
      <Label>{label}</Label>
    </Chip>
  );
}