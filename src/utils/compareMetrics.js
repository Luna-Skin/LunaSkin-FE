// 과거 점수 대비 현재 점수가 얼마나 달라졌는지 판정하는 순수 함수.
// 20점 이상 오르면 좋아짐, 20점 이상 내려가면 나빠짐, 그 안이면 비슷함
// (5개 지표 전부 "숫자가 오르면 좋은 것"이라는 하나의 규칙으로 통일됨)

export const METRIC_COMPARISON = {
  WORSE: "worse",
  SAME: "same",
  BETTER: "better",
};

const SIGNIFICANT_DIFFERENCE_THRESHOLD = 10;

export function getMetricComparison(pastValue, currentValue) {
  const diff = currentValue - pastValue;

  if (diff >= SIGNIFICANT_DIFFERENCE_THRESHOLD) return METRIC_COMPARISON.BETTER;
  if (diff <= -SIGNIFICANT_DIFFERENCE_THRESHOLD) return METRIC_COMPARISON.WORSE;
  return METRIC_COMPARISON.SAME;
}

// MetricCompareRow(점)이랑 MetricCompareCard(범례) 둘 다 같은 색을 써야 해서 여기서 공유
export const METRIC_COMPARISON_COLOR = {
  [METRIC_COMPARISON.WORSE]: "#ed6e6c",
  [METRIC_COMPARISON.SAME]: "#d0d0d0",
  [METRIC_COMPARISON.BETTER]: "#6ac790",
};

export const METRIC_COMPARISON_LABEL = {
  [METRIC_COMPARISON.WORSE]: "나빠짐",
  [METRIC_COMPARISON.SAME]: "비슷함",
  [METRIC_COMPARISON.BETTER]: "좋아짐",
};