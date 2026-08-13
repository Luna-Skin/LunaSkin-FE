// 과거 점수 대비 현재 점수가 얼마나 달라졌는지 판정
// 20점 이상 오르면 좋아짐, 20점 이상 내려가면 나빠짐, 그 안이면 비슷함

export const METRIC_COMPARISON = {
  WORSE: "worse",
  SAME: "same",
  BETTER: "better",
};

const SIGNIFICANT_DIFFERENCE_THRESHOLD = 20;

export function getMetricComparison(pastValue, currentValue) {
  const diff = currentValue - pastValue;

  if (diff >= SIGNIFICANT_DIFFERENCE_THRESHOLD) return METRIC_COMPARISON.BETTER;
  if (diff <= -SIGNIFICANT_DIFFERENCE_THRESHOLD) return METRIC_COMPARISON.WORSE;
  return METRIC_COMPARISON.SAME;
}