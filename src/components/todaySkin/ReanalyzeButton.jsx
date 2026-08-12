import styled from "styled-components";

const Button = styled.button`
  display: flex;
  width: 120px;
  height: 38px;
  padding: 0 21.5px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border: none;
  border-radius: 8px;
  background: #f0ebf8;
  cursor: pointer;
  box-sizing: border-box;
`;

const Label = styled.span`
  color: rgba(0, 0, 0, 0.7);
  font-family: "Pretendard Variable";
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
`;

export default function ReanalyzeButton({ onClick }) {
  return (
    <Button type="button" onClick={onClick}>
      <Label>다시 분석하기</Label>
    </Button>
  );
}