import dayjs from "dayjs";

export const CYCLE_PHASE = {
  MENSTRUATION: "MENSTRUATION",
  FOLLICULAR: "FOLLICULAR",
  OVULATION: "OVULATION",
  LUTEAL: "LUTEAL",
};

const OVULATION_WINDOW = 1;

// periodCycles를 시작일 순으로 정렬하고, 각 기록의 predictedCycleLength를 실제 데이터
// 기반으로 다시 계산해서 붙여준다.
// - 다음 기록이 있는 과거 주기: 그 다음 기록 시작일까지의 실제 간격(직접 관찰된 값)
// - 가장 최근 기록(아직 다음 기록이 없음): 지금까지의 평균 간격으로 다음 주기를 예측
//   → 기록이 2개 이상 쌓여야 평균을 낼 수 있어서, 기록이 1개뿐이면 그 기록에 저장된
//     predictedCycleLength(온보딩 때 사용자가 입력한 초기 설정값)를 그대로 사용
function withDerivedCycleLength(periodCycles) {
  const sorted = [...periodCycles].sort((a, b) => dayjs(a.cycleStartDate).diff(dayjs(b.cycleStartDate)));

  return sorted.map((cycle, index) => {
    const isLast = index === sorted.length - 1;

    if (!isLast) {
      const gap = dayjs(sorted[index + 1].cycleStartDate).diff(dayjs(cycle.cycleStartDate), "day");
      return { ...cycle, predictedCycleLength: gap };
    }

    const pastGaps = sorted
      .slice(1)
      .map((c, i) => dayjs(c.cycleStartDate).diff(dayjs(sorted[i].cycleStartDate), "day"));

    if (pastGaps.length === 0) {
      // 기록이 하나뿐이라 평균을 낼 수 없음 → 온보딩 초기 설정값을 그대로 사용
      return cycle;
    }

    const averageGap = Math.round(pastGaps.reduce((sum, gap) => sum + gap, 0) / pastGaps.length);
    return { ...cycle, predictedCycleLength: averageGap };
  });
}

// dateStr 기준으로 적용해야 할 주기 기록(cycle)을 찾는다.
// dateStr 이전에 시작한 기록 중 가장 최근 것. predictedCycleLength는 위 로직으로 보정된 값.
export function findCurrentCycle(periodCycles, dateStr) {
  if (!periodCycles || periodCycles.length === 0) return null;

  const withDerivedLength = withDerivedCycleLength(periodCycles);
  const target = dayjs(dateStr);

  return (
    withDerivedLength
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

// API(/api/cycles/calendar)가 주는 구간 목록(cycleResponses)에서, 특정 날짜rk 어느 단계에 속하는지 찾기 
//  기존 -> 프론트에서 평균 주기를 계산  
// 이건 서버가 이미 계산해둔 구간을 그대로 조회만 
export function getPhaseFromSegments(dateStr, cycleResponses = []) {
  const target = dayjs(dateStr);

  const match = cycleResponses.find(
    (segment) =>
      !target.isBefore(dayjs(segment.startDate), "day") &&
      !target.isAfter(dayjs(segment.endDate), "day"),
  );

  return match?.phaseType ?? null;
}