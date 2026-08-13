import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import styled from "styled-components";
import { getPhaseForDate, PHASE_COLOR } from "../../utils/cyclePhase";

import chevronDown from "../../assets/icons/calendar_chevron_down.svg";
import chevronUp from "../../assets/icons/calendar_chevron_up.svg";
import chevronLeft from "../../assets/icons/calendar_chevron_left.svg";
import chevronRight from "../../assets/icons/calendar_chevron_right.svg";

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];
const SHOW_PHASE_HIGHLIGHT_IN_WEEK_VIEW = true;

const Wrapper = styled.div`
  margin: 0 auto;
  position: relative;
  width: 354px;
  border-radius: 18px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  background: #fff;
  padding: 20px 16px;
  padding-bottom: ${({ $isExpanded }) => ($isExpanded ? "56px" : "20px")};
  box-sizing: border-box;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  margin-bottom: 12px;
`;

const MonthLabel = styled.span`
  color: #363636;
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  visibility: ${({ $visible }) => ($visible ? "visible" : "hidden")};

  img {
    width: 14px;
    height: 14px;
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 27px;
  right: 20.38px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;

  img {
    width: 16px;
    height: 16px;
  }
`;

const WeekdaysRow = styled.div`
  display: flex;
  margin-bottom: 12px;
`;

const WeekdayCell = styled.div`
  flex: 1;
  text-align: center;
  font-size: 13px;
  color: #6f647a;
  font-family: "Pretendard Variable";
  font-weight: 500;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 27px;
  column-gap: 6px;
  row-gap: 20px;
`;

const DateCell = styled.button`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    cursor: default;
  }
`;

// left/right 오프셋은 "같은 줄에서 물리적으로 겹치는지"(mergeLeft/Right)만 따르고,
// 모서리를 둥글게 할지는 "실제 날짜상 이어지는지"(roundLeft/Right)를 따로 봄.
// 줄이 바뀌며 이어지는 경우, 겹치진 못해도 모서리는 각지게 처리됨.
const HighlightPill = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${({ $mergeLeft }) => ($mergeLeft ? "-3px" : "4.5px")};
  right: ${({ $mergeRight }) => ($mergeRight ? "-3px" : "4.5px")};
  background: ${({ $color }) => $color};
  border-top-left-radius: ${({ $roundLeft }) => ($roundLeft ? "999px" : "0")};
  border-bottom-left-radius: ${({ $roundLeft }) => ($roundLeft ? "999px" : "0")};
  border-top-right-radius: ${({ $roundRight }) => ($roundRight ? "999px" : "0")};
  border-bottom-right-radius: ${({ $roundRight }) => ($roundRight ? "999px" : "0")};
  z-index: 0;
`;

const DateNumber = styled.span`
  position: relative;
  z-index: 1;
  color: ${({ $isCurrentMonth }) => ($isCurrentMonth ? "#6F647A" : "#C6C6C6")};
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const TodayBadge = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  width: 27px;
  height: 27px;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: ${({ $isSelected }) => ($isSelected ? "2px solid #f36977" : "none")};
  background: #9a71df;
  box-sizing: border-box;
  color: #fff;
  font-family: "Pretendard Variable";
  font-size: 16px;
  font-weight: 500;
`;

const SelectedBadge = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  width: 27px;
  height: 27px;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1 / 1;
  border-radius: 54px;
  border: 2px solid #f36977;
  box-sizing: border-box;
  color: #6f647a;
  font-family: "Pretendard Variable";
  font-size: 16px;
  font-weight: 500;
`;

const RecordDot = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  margin-top: 4px;
  transform: translateX(-50%);
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #aca7b0;
  z-index: 1;
`;

const Legend = styled.div`
  position: absolute;
  left: 16px;
  bottom: 20px;
  display: flex;
  gap: 12px;
`;

const LegendItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #746e76;
  font-family: "Pretendard Variable";
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const LegendDot = styled.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

// selectMode: 생리 시작일/종료일을 고르는 중일 때 true. 이때는
//   - 접힘 상태와 무관하게 항상 펼쳐진 월간 보기로 보여줌(단, 실제 접힘 저장값은 안 건드림)
//   - 오늘 날짜는 기존처럼 보라색 원으로 표시됨
//   - selectedDate는 빨간색 테두리 원으로 표시됨
//   - 오늘 날짜를 선택하면 보라색 원 위에 빨간색 테두리가 함께 표시됨
//   - 펼치기/접기 토글 버튼은 숨김(어차피 강제로 펼쳐져 있어서 눌러도 의미 없음)
export default function CalendarView({
  periodCycles = [],
  skinRecords = {},
  onDateClick,
  selectMode = false,
  selectedDate = null,
}) {
  const today = dayjs();

  const [isExpanded, setIsExpanded] = useState(() => {
    return sessionStorage.getItem("calendarIsExpanded") === "true";
  });

  const [displayedMonth, setDisplayedMonth] = useState(() => {
    const saved = sessionStorage.getItem("calendarDisplayedMonth");
    return saved ? dayjs(saved).startOf("month") : today.startOf("month");
  });

  useEffect(() => {
    sessionStorage.setItem("calendarIsExpanded", String(isExpanded));
  }, [isExpanded]);

  useEffect(() => {
    sessionStorage.setItem("calendarDisplayedMonth", displayedMonth.format("YYYY-MM-DD"));
  }, [displayedMonth]);

  // selectMode일 땐 실제 저장된 접힘 상태는 그대로 두고, 화면에 보여줄 때만 펼친 것처럼 취급함
  const effectiveExpanded = isExpanded || selectMode;

  const days = useMemo(() => {
    if (!effectiveExpanded) {
      const startOfWeek = today.startOf("week");
      return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"));
    }

    const gridStart = displayedMonth.startOf("month").startOf("week");
    const gridEnd = displayedMonth.endOf("month").endOf("week");

    const list = [];
    let cursor = gridStart;

    while (cursor.isBefore(gridEnd) || cursor.isSame(gridEnd, "day")) {
      list.push(cursor);
      cursor = cursor.add(1, "day");
    }

    return list;
  }, [effectiveExpanded, displayedMonth, today]);

  const canShowPhase = effectiveExpanded || SHOW_PHASE_HIGHLIGHT_IN_WEEK_VIEW;

  return (
    <Wrapper $isExpanded={effectiveExpanded}>
      <Header>
        <NavButton
          $visible={effectiveExpanded}
          onClick={() => setDisplayedMonth((m) => m.subtract(1, "month"))}
        >
          <img src={chevronLeft} alt="이전 달" />
        </NavButton>

        <MonthLabel>
          {(effectiveExpanded ? displayedMonth : today).format("YYYY년 M월")}
        </MonthLabel>

        <NavButton
          $visible={effectiveExpanded}
          onClick={() => setDisplayedMonth((m) => m.add(1, "month"))}
        >
          <img src={chevronRight} alt="다음 달" />
        </NavButton>
      </Header>

      {!selectMode && (
        <ToggleButton onClick={() => setIsExpanded((v) => !v)}>
          <img src={isExpanded ? chevronUp : chevronDown} alt="달력 펼치기/접기" />
        </ToggleButton>
      )}

      <WeekdaysRow>
        {WEEKDAY_LABELS.map((label) => (
          <WeekdayCell key={label}>{label}</WeekdayCell>
        ))}
      </WeekdaysRow>

      <Grid>
        {days.map((date, index) => {
          const dateStr = date.format("YYYY-MM-DD");
          const isToday = date.isSame(today, "day");
          const isFutureDate = date.isAfter(today, "day");
          const isCurrentMonth = date.isSame(
            effectiveExpanded ? displayedMonth : today,
            "month",
          );
          const hasRecord = !isFutureDate && Boolean(skinRecords[dateStr]);
          const isSelected = selectMode && selectedDate === dateStr;

          const phase = canShowPhase ? getPhaseForDate(dateStr, periodCycles) : null;
          const phaseColor = phase ? PHASE_COLOR[phase] : null;

          const columnIndex = index % 7;

          const prevInRow = columnIndex > 0 ? days[index - 1] : null;
          const nextInRow = columnIndex < 6 ? days[index + 1] : null;

          const mergeLeft =
            canShowPhase &&
            prevInRow &&
            getPhaseForDate(prevInRow.format("YYYY-MM-DD"), periodCycles) === phase;

          const mergeRight =
            canShowPhase &&
            nextInRow &&
            getPhaseForDate(nextInRow.format("YYYY-MM-DD"), periodCycles) === phase;

          const hasRowAbove = index - 7 >= 0;
          const hasRowBelow = index + 7 < days.length;

          const continuesFromAbove =
            canShowPhase &&
            columnIndex === 0 &&
            hasRowAbove &&
            getPhaseForDate(
              date.subtract(1, "day").format("YYYY-MM-DD"),
              periodCycles,
            ) === phase;

          const continuesToBelow =
            canShowPhase &&
            columnIndex === 6 &&
            hasRowBelow &&
            getPhaseForDate(
              date.add(1, "day").format("YYYY-MM-DD"),
              periodCycles,
            ) === phase;

          const roundLeft = !mergeLeft && !continuesFromAbove;
          const roundRight = !mergeRight && !continuesToBelow;

          return (
            <DateCell
              key={dateStr}
              disabled={isFutureDate}
              onClick={() => onDateClick?.(dateStr)}
            >
              {phaseColor && (
                <HighlightPill
                  $color={phaseColor}
                  $mergeLeft={mergeLeft}
                  $mergeRight={mergeRight}
                  $roundLeft={roundLeft}
                  $roundRight={roundRight}
                />
              )}

              {isToday ? (
                <TodayBadge $isSelected={isSelected}>{date.date()}</TodayBadge>
              ) : isSelected ? (
                <SelectedBadge>{date.date()}</SelectedBadge>
              ) : (
                <DateNumber $isCurrentMonth={isCurrentMonth}>
                  {date.date()}
                </DateNumber>
              )}

              {hasRecord && <RecordDot />}
            </DateCell>
          );
        })}
      </Grid>

      {effectiveExpanded && (
        <Legend>
          <LegendItem>
            <LegendDot $color={PHASE_COLOR.MENSTRUATION} />
            생리기간
          </LegendItem>
          <LegendItem>
            <LegendDot $color={PHASE_COLOR.OVULATION} />
            배란기
          </LegendItem>
          <LegendItem>
            <LegendDot $color={PHASE_COLOR.LUTEAL} />
            황체기
          </LegendItem>
        </Legend>
      )}
    </Wrapper>
  );
}