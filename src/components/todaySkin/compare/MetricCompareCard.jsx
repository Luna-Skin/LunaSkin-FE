import styled from "styled-components";
import MetricCompareRow from "./MetricCompareRow";
import { METRIC_ITEMS } from "../../../utils/skinMetrics";
import {
  METRIC_COMPARISON,
  METRIC_COMPARISON_COLOR,
  METRIC_COMPARISON_LABEL,
  getMetricComparison,
} from "../../../utils/compareMetrics";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TitleRow = styled.div`
  display: flex;
  width: 354px;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h3`
  margin: 0;
  color: #000;
  font-family: "Pretendard Variable";
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const LegendGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
`;

const LegendItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const LegendDot = styled.span`
  width: 11px;
  height: 11px;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${({ $color }) => $color};
`;

const LegendText = styled.span`
  color: #746e76;
  font-family: "Pretendard Variable";
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const RowList = styled.div`
  display: flex;
  width: 354px;
  padding: 20px 16px 22px 16px;
  flex-direction: column;
  gap: 10px;
  border-radius: 18px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #fff;
  box-sizing: border-box;
`;

// metrics: { [key]: { past, current } } — 5개 지표 각각의 과거/현재 점수
export default function MetricCompareCard({ metrics }) {
  return (
    <Wrapper>
      <TitleRow>
        <Title>항목별 비교</Title>
        <LegendGroup>
          {Object.values(METRIC_COMPARISON).map((comparison) => (
            <LegendItem key={comparison}>
              <LegendDot $color={METRIC_COMPARISON_COLOR[comparison]} />
              <LegendText>{METRIC_COMPARISON_LABEL[comparison]}</LegendText>
            </LegendItem>
          ))}
        </LegendGroup>
      </TitleRow>

      <RowList>
        {METRIC_ITEMS.map(({ key, label }) => {
          const { past, current } = metrics[key];
          return (
            <MetricCompareRow
              key={key}
              label={label}
              pastValue={past}
              currentValue={current}
              comparison={getMetricComparison(past, current)}
            />
          );
        })}
      </RowList>
    </Wrapper>
  );
}