import styled from "styled-components";

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width : 314px;
`;

const Label = styled.span`
  color: #7e7979;
  font-family: "Pretendard Variable";
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const TrackValueGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 25px;
`;

const Track = styled.div`
  display: flex;
  align-items: center;
  width: 226px;
  height: 6px;
  border-radius: 9999px;
  background: #f0ebf8;
`;

const Fill = styled.div`
  height: 6px;
  flex-shrink: 0;
  border-radius: 9999px;
  background: #af88f1;
  width: ${({ $value }) => $value}%;
`;

const Value = styled.span`
  min-width: 18px;
  color: #7e7979;
  text-align: right;
  font-family: "Pretendard Variable";
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

export default function SkinMetricBar({ label, value }) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <Row>
      <Label>{label}</Label>
      <TrackValueGroup>
        <Track>
          <Fill $value={clampedValue} />
        </Track>
        <Value>{clampedValue}</Value>
      </TrackValueGroup>
    </Row>
  );
}