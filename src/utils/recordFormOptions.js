// TodaySkin 생활습관 기록이랑 그 값을 API로 보낼 때 둘 다 필요한 설정값
// 컴포넌트 파일에서 export 불가라 여기로 분리

function formatExerciseHours(hours) {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  return minutes === 0 ? `${wholeHours}시간` : `${wholeHours}시간 ${minutes}분`;
}

export const STEPPER_FIELDS = {
  sleep: {
    label: "수면",
    min: 0,
    max: 16,
    step: 0.5,
    default: 7,
    formatValue: (v) => `${v}시간`,
  },
  water: {
    label: "수분 섭취",
    min: 0,
    max: 4,
    step: 0.5,
    default: 0.5,
    formatValue: (v) => `${v}L`,
  },
  exercise: {
    label: "운동",
    min: 0,
    max: 4,
    step: 0.5,
    default: 1,
    formatValue: formatExerciseHours,
  },
};

export const MEAL_OPTIONS = [
  "유제품",
  "과일",
  "매운 음식",
  "카페인",
  "고지방",
  "당분",
  "탄산음료",
  "음주",
];

export const SKIN_STATUS_OPTIONS = ["건조", "번들거림", "트러블", "칙칙함"];