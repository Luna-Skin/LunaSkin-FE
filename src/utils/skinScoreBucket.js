export const SKIN_SCORE_BUCKET = {
  UNKNOWN: "UNKNOWN",
  BAD: "BAD",
  NORMAL: "NORMAL",
  GOOD: "GOOD",
};

// score(0~100)를 기준으로 어떤 상태 구간에 속하는지 판별한다.
// 오늘 기록 자체가 없어서 score가 없으면(null/undefined) UNKNOWN
export function getSkinScoreBucket(score) {
  if (score === null || score === undefined) return SKIN_SCORE_BUCKET.UNKNOWN;
  if (score < 50) return SKIN_SCORE_BUCKET.BAD;
  if (score < 80) return SKIN_SCORE_BUCKET.NORMAL;
  return SKIN_SCORE_BUCKET.GOOD;
}

// label: 구간 이름 (고정)
// description: 지금은 구간별 기본 문구. 나중에 AI가 그날그날 다르게 생성해주는 걸로
// 바뀔 수 있어서, 카드 컴포넌트가 이 객체를 직접 참조하지 않고 Home.jsx가 조회해서
// props로 넘겨주는 방식으로 사용할 것 (컴포넌트는 항상 label/description을 prop으로만 받음)
export const SKIN_SCORE_BUCKET_CONTENT = {
  UNKNOWN: {
    label: "모름",
    description: "아직 오늘의 피부 기록이 없어요. 피부를 촬영하고 상태를 확인해보세요!",
  },
  BAD: {
    label: "나쁨",
    description: "트러블과 붉은기가 증가했어요. 오늘은 자극을 줄이고 진정에 집중해보세요.",
  },
  NORMAL: {
    label: "보통",
    description: "어제보다 붉은기가 줄었어요. 하지만 기본적인 보습과 진정 관리가 더 필요해요.",
  },
  GOOD: {
    label: "좋음",
    description: "전반적으로 안정적인 상태예요. 현재 루틴을 꾸준히 유지해 주세요.",
  },
};