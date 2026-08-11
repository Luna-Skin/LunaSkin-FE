import dayjs from "dayjs";

export const CYCLE_PHASE = {
  MENSTRUATION: "MENSTRUATION",
  FOLLICULAR: "FOLLICULAR",
  OVULATION: "OVULATION",
  LUTEAL: "LUTEAL",
};

const OVULATION_WINDOW = 1;

// dateStr 기준으로 적용해야 할 주기 기록(cycle)을 찾는다.
// dateStr 이전에 시작한 기록 중 가장 최근 것.
export function findCurrentCycle(periodCycles, dateStr) {
  if (!periodCycles || periodCycles.length === 0) return null;

  const target = dayjs(dateStr);

  return (
    [...periodCycles]
      .filter((c) => !dayjs(c.cycleStartDate).isAfter(target))
      .sort((a, b) => dayjs(b.cycleStartDate).diff(dayjs(a.cycleStartDate)))[0] ??
    null
  );
}

export function getPhaseForDate(dateStr, periodCycles) {
  const cycle = findCurrentCycle(periodCycles, dateStr);
  if (!cycle) return null;

  const target = dayjs(dateStr);
  const { cycleStartDate, periodDuration, predictedCycleLength } = cycle;

  const cycleDay = target.diff(dayjs(cycleStartDate), "day") % predictedCycleLength;

  if (cycleDay < periodDuration) return CYCLE_PHASE.MENSTRUATION;

  const ovulationDay = predictedCycleLength - 14;
  if (Math.abs(cycleDay - ovulationDay) <= OVULATION_WINDOW) return CYCLE_PHASE.OVULATION;

  return cycleDay < ovulationDay ? CYCLE_PHASE.FOLLICULAR : CYCLE_PHASE.LUTEAL;
}

export const PHASE_COLOR = {
  MENSTRUATION: "#FCE3E8",
  OVULATION: "#D5F1EF",
  LUTEAL: "#F0E5FF",
  FOLLICULAR: "transparent",
};

export const PHASE_LABEL = {
  MENSTRUATION: "생리기",
  FOLLICULAR: "난포기",
  OVULATION: "배란기",
  LUTEAL: "황체기",
};