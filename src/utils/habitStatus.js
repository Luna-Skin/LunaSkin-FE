// 운동 값("0분", "30분", "60분", "90분+")을 숫자(분)로 변환
function parseExerciseMinutes(exerciseLabel) {
  if (!exerciseLabel) return null;
  const numeric = parseInt(exerciseLabel, 10);
  return Number.isNaN(numeric) ? null : numeric;
}

const HABIT_DEFINITIONS = {
  sleep: {
    label: "수면",
    unit: "시간",
    resultLabel: "트러블",
    // TODO: 실제 기준값 확정되면 조정
    levels: [
      { until: 6, suffix: "미만", emoji: "😰", trend: "↑" }, // < 6시간
      { until: 7, suffix: "부족", emoji: "😐", trend: "→" }, // 6~7시간
      { until: Infinity, suffix: "이상", emoji: "😀", trend: "↓" }, // 7시간 이상
    ],
  },
  water: {
    label: "수분 섭취",
    unit: "잔",
    resultLabel: "건조도",
    // TODO: 실제 기준값 확정되면 조정 (하루 권장 물 섭취량 기준 임시값)
    levels: [
      { until: 4, suffix: "미만", emoji: "😰", trend: "↑" }, // < 4잔
      { until: 8, suffix: "부족", emoji: "😐", trend: "→" }, // 4~7잔
      { until: Infinity, suffix: "충분", emoji: "😀", trend: "↓" }, // 8잔 이상
    ],
  },
  exercise: {
    label: "운동",
    unit: "분",
    resultLabel: "칙칙함",
    // RecordForm의 EXERCISE_OPTIONS(0/30/60/90+분)에 맞춘 구간
    levels: [
      { until: 30, suffix: "부족", emoji: "😰", trend: "↑" }, // 0분
      { until: 60, suffix: "이상", emoji: "😐", trend: "→" }, // 30분
      { until: 90, suffix: "이상", emoji: "😀", trend: "↓" }, // 60분
      { until: Infinity, suffix: "초과", emoji: "🤩", trend: "↓↓" }, // 90분+
    ],
  },
};

// 값이 어느 구간(level)에 속하는지 찾아 emoji/title/result를 만들어줌
export function getHabitStatus(type, value) {
  const def = HABIT_DEFINITIONS[type];
  if (!def || value == null) return null;

  const level =
    def.levels.find((lv) => value < lv.until) ??
    def.levels[def.levels.length - 1];

  return {
    emoji: level.emoji,
    title: `${def.label} ${value}${def.unit} ${level.suffix}`,
    result: `${def.resultLabel} ${level.trend}`,
  };
}

export { parseExerciseMinutes };