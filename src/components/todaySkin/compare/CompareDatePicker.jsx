import { useMemo, useState } from "react";
import dayjs from "dayjs";
import styled from "styled-components";
import closeIcon from "../../../assets/icons/modal_close.svg";
import chevronLeft from "../../../assets/icons/calendar_chevron_left.svg";
import chevronRight from "../../../assets/icons/calendar_chevron_right.svg";

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

const Container = styled.div`
  position: relative;
  width: 354px;
  border-radius: 18px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  background: #fff;
  padding: 20px 16px;
  box-sizing: border-box;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;

  img {
    width: 12px;
    height: 12px;
  }
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

  img {
    width: 14px;
    height: 14px;
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

const DateNumber = styled.span`
  color: ${({ $isDimmed }) => ($isDimmed ? "#c6c6c6" : "#6f647a")};
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const SelectedBadge = styled.div`
  display: flex;
  width: 27px;
  height: 27px;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: #9a71df;
  color: #fff;
  font-family: "Pretendard Variable";
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

// selectedDate : 지금 이 쪽(과거/현재)에 골라져 있는 날짜
// availableDates : 선택 가능한 분석 기록 날짜 목록
export default function CompareDatePicker({
  selectedDate,
  availableDates,
  onSelect,
  onClose,
  onMonthChange,
}) {
  const [displayedMonth, setDisplayedMonth] = useState(() =>
    selectedDate
      ? dayjs(selectedDate).startOf("month")
      : dayjs().startOf("month"),
  );

  const days = useMemo(() => {
    const gridStart = displayedMonth.startOf("month").startOf("week");
    const gridEnd = displayedMonth.endOf("month").endOf("week");

    const list = [];
    let cursor = gridStart;

    while (cursor.isBefore(gridEnd) || cursor.isSame(gridEnd, "day")) {
      list.push(cursor);
      cursor = cursor.add(1, "day");
    }

    return list;
  }, [displayedMonth]);

  const handleMonthChange = (amount) => {
    const nextMonth = displayedMonth.add(amount, "month");

    setDisplayedMonth(nextMonth);
    onMonthChange?.(nextMonth);
  };

  return (
    <Overlay onClick={onClose}>
      <Container onClick={(event) => event.stopPropagation()}>
        <CloseButton type="button" onClick={onClose}>
          <img src={closeIcon} alt="닫기" />
        </CloseButton>

        <Header>
          <NavButton
            type="button"
            onClick={() => handleMonthChange(-1)}
          >
            <img src={chevronLeft} alt="이전 달" />
          </NavButton>

          <MonthLabel>
            {displayedMonth.format("YYYY년 M월")}
          </MonthLabel>

          <NavButton
            type="button"
            onClick={() => handleMonthChange(1)}
          >
            <img src={chevronRight} alt="다음 달" />
          </NavButton>
        </Header>

        <WeekdaysRow>
          {WEEKDAY_LABELS.map((label) => (
            <WeekdayCell key={label}>{label}</WeekdayCell>
          ))}
        </WeekdaysRow>

        <Grid>
          {days.map((date) => {
            const dateStr = date.format("YYYY-MM-DD");
            const isCurrentMonth = date.isSame(displayedMonth, "month");
            const isAvailable =
              isCurrentMonth && availableDates.includes(dateStr);
            const isSelected = selectedDate === dateStr;

            return (
              <DateCell
                key={dateStr}
                type="button"
                disabled={!isAvailable}
                onClick={() => onSelect(dateStr)}
              >
                {isSelected ? (
                  <SelectedBadge>{date.date()}</SelectedBadge>
                ) : (
                  <DateNumber $isDimmed={!isAvailable}>
                    {date.date()}
                  </DateNumber>
                )}
              </DateCell>
            );
          })}
        </Grid>
      </Container>
    </Overlay>
  );
}