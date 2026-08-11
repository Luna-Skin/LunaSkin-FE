import styled from "styled-components";
import SkinMetricBar from "./SkinMetricBar";

const METRIC_ITEMS = [
  { key: "trouble", label: "트러블" },
  { key: "oil", label: "유분" },
  { key: "dullness", label: "칙칙함" },
  { key: "hydration", label: "수분" },
  { key: "elasticity", label: "탄력" },
];

const Card = styled.div`
  width: 354px;
  height: 181px;
  padding: 20px 24px 24px 16px;
  border-radius: 18px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #fff;
  box-sizing: border-box;
`;

const Title = styled.h3`
  margin: 0 0 20px;
  color: #000;
  font-family: "Pretendard Variable";
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const BarList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export default function SkinMetricsCard({ metrics }) {
  return (
    <Card>
      <Title>세부 피부 지표</Title>
      <BarList>
        {METRIC_ITEMS.map(({ key, label }) => (
          <SkinMetricBar key={key} label={label} value={metrics[key]} />
        ))}
      </BarList>
    </Card>
  );
}