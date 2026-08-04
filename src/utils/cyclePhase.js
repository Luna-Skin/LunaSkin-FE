import dayjs from "dayjs";

// 생리주기 4단계 상수 (오타 방지용)
export const CYCLE_PHASE = {
  MENSTRUATION: "MENSTRUATION", // 생리기
  FOLLICULAR: "FOLLICULAR", // 난포기 (캘린더엔 색 표시 안 하지만 계산상 필요)
  OVULATION: "OVULATION", // 배란기
  LUTEAL: "LUTEAL", // 황체기
};

const OVULATION_WINDOW = 1; // 배란예정일 앞뒤 1일씩, 총 3일 (스펙: 2~3일)

/**
 * 특정 날짜가 생리주기 4단계 중 어디에 해당하는지 계산합니다.
 * @param {string} dateStr - 판정할 날짜 ("YYYY-MM-DD")
 * @param {Array} periodCycles - 사용자가 기록한 생리주기 목록
 * @returns {string|null} CYCLE_PHASE 중 하나, 또는 기록이 없으면 null
 */
export function getPhaseForDate(dateStr, periodCycles) {
  if (!periodCycles || periodCycles.length === 0) return null;

  const target = dayjs(dateStr);

  // dateStr 이전에 시작한 기록 중 가장 최근 것을 기준으로 삼는다
  const cycle = [...periodCycles]
    .filter((c) => !dayjs(c.cycleStartDate).isAfter(target))
    .sort((a, b) => dayjs(b.cycleStartDate).diff(dayjs(a.cycleStartDate)))[0];

  if (!cycle) return null;

  const { cycleStartDate, periodDuration, predictedCycleLength } = cycle;

  // %를 쓰는 이유: 주기가 반복되므로, 기록이 1개뿐이어도 몇 달 뒤 미래까지 예측 가능
  const cycleDay = target.diff(dayjs(cycleStartDate), "day") % predictedCycleLength;

  if (cycleDay < periodDuration) return CYCLE_PHASE.MENSTRUATION;

  // 배란예정일 = 주기 정중앙 ("주기 중간 2~3일")
  // TODO: PO 확인 후 필요하면 (predictedCycleLength - 14) 방식으로 되돌릴 수 있음
  const ovulationDay = Math.round(predictedCycleLength / 2);
  if (Math.abs(cycleDay - ovulationDay) <= OVULATION_WINDOW) return CYCLE_PHASE.OVULATION;

  return cycleDay < ovulationDay ? CYCLE_PHASE.FOLLICULAR : CYCLE_PHASE.LUTEAL;
}

// FOLLICULAR는 스펙상 캘린더에 색을 표시하지 않으므로 transparent
export const PHASE_COLOR = {
  MENSTRUATION: "#FCE3E8",
  OVULATION: "#D5F1EF",
  LUTEAL: "#F0E5FF",
  FOLLICULAR: "transparent",
};