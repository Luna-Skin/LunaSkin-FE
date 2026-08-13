import styled from "styled-components";

const Button = styled.button`
  display: flex;
  min-width: 220px;
  height: 38px;
  padding: 0 10px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border: none;
  border-radius: 8px;
  background: ${({ disabled }) => (disabled ? "#a6a6a6" : "#a985e7")};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  box-sizing: border-box;
`;

const Label = styled.span`
  color: ${({ $disabled }) => ($disabled ? "#6b6b6b" : "#fff")};
  font-family: "Pretendard Variable";
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
`;

// claimed: 이미 포인트를 받았으면 true (비활성화 상태로 전환)
// points: 받을 수 있는 포인트 값 (기본 50)
export default function PointsRewardButton({ claimed, points = 50, onClick }) {
  return (
    <Button type="button" disabled={claimed} onClick={onClick}>
      <Label $disabled={claimed}>루나포인트 {points}P 받기</Label>
    </Button>
  );
}