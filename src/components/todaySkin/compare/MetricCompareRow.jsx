import styled from "styled-components";
import { METRIC_COMPARISON_COLOR } from "../../../utils/compareMetrics";

const Row = styled.div`
  width: 322px;
  height: 17px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.span`
  color: #7e7979;
  font-family: "Pretendard Variable";
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const ValueGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;
`;

const ValueText = styled.span`
  color: #7e7979;
  font-family: "Pretendard Variable";
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const ComparisonDot = styled.span`
  width: 11px;
  height: 11px;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${({ $comparison }) => METRIC_COMPARISON_COLOR[$comparison]};
`;

// label: "트러블" 등 지표 이름
// pastValue/currentValue: 각각 과거/현재 점수
// comparison: "worse" | "same" | "better" (utils/compareMetrics.js의 getMetricComparison 결과)
export default function MetricCompareRow({ label, pastValue, currentValue, comparison }) {
  return (
    <Row>
      <Label>{label}</Label>
      <ValueGroup>
        <ValueText>
          {pastValue} → {currentValue}
        </ValueText>
        <ComparisonDot $comparison={comparison} />
      </ValueGroup>
    </Row>
  );
}