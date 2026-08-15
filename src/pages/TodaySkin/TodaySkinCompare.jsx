import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import styled from "styled-components";

import Header from "../../components/todaySkin/Header";
import ScoreCompareBlock from "../../components/todaySkin/compare/ScoreCompareBlock";
import MetricCompareCard from "../../components/todaySkin/compare/MetricCompareCard";
import CompareDatePicker from "../../components/todaySkin/compare/CompareDatePicker";
import AiInsightBox from "../../components/todaySkin/AiInsightBox";
import { MOCK_SKIN_RECORDS } from "../../mocks/homeMock";
import { METRIC_ITEMS } from "../../utils/skinMetrics";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 24px 24px;
`;

// 기록이 있는 날짜 문자열 목록, 오름차순 정렬 (한 번만 계산)
const RECORDED_DATES = Object.keys(MOCK_SKIN_RECORDS).sort();

// targetDate보다 이전 기록 중 가장 최근 것. 없으면 null
function findPreviousRecordDate(targetDate) {
  return RECORDED_DATES.filter((d) => d < targetDate).at(-1) ?? null;
}

function formatDateLabel(dateStr) {
  return dayjs(dateStr).format("YYYY년 M월 D일");
}

export default function TodaySkinCompare() {
  const { date } = useParams();
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = useState(date);
  const [pastDate, setPastDate] = useState(() => findPreviousRecordDate(date));
  const [activePicker, setActivePicker] = useState(null); // null | "past" | "current"

  const currentRecord = MOCK_SKIN_RECORDS[currentDate];
  const pastRecord = pastDate ? MOCK_SKIN_RECORDS[pastDate] : null;

  const pastAvailableDates = RECORDED_DATES.filter((d) => d < currentDate);
  const currentAvailableDates = RECORDED_DATES.filter(
    (d) => d > (pastDate ?? ""),
  );

  const handleSelectDate = (selectedDate) => {
    if (activePicker === "past") {
      setPastDate(selectedDate);
    } else {
      setCurrentDate(selectedDate);
    }
    setActivePicker(null);
  };

  if (!pastRecord) {
    return (
      <div>
        <Header
          variant="back"
          title="피부 기록 비교"
          onBack={() => navigate(-1)}
        />
        <Content>
          비교할 이전 기록이 없어요. 기록이 더 쌓이면 비교할 수 있어요.
        </Content>
      </div>
    );
  }

  const metrics = Object.fromEntries(
    METRIC_ITEMS.map(({ key }) => [
      key,
      { past: pastRecord.metrics[key], current: currentRecord.metrics[key] },
    ]),
  );

  return (
    <div>
      <Header
        variant="back"
        title="피부 기록 비교"
        onBack={() => navigate(-1)}
      />
      <Content>
        <ScoreCompareBlock
          past={{
            dateLabel: formatDateLabel(pastDate),
            photoUrl: pastRecord.photoUrl,
            score: pastRecord.score,
            statusText: pastRecord.statusText,
          }}
          current={{
            dateLabel: formatDateLabel(currentDate),
            photoUrl: currentRecord.photoUrl,
            score: currentRecord.score,
            statusText: currentRecord.statusText,
          }}
          onSelectPastDate={() => setActivePicker("past")}
          onSelectCurrentDate={() => setActivePicker("current")}
        />

        <MetricCompareCard metrics={metrics} />

        <AiInsightBox title="AI 분석" insight={currentRecord.compareInsight} />
      </Content>

      {activePicker === "past" && (
        <CompareDatePicker
          selectedDate={pastDate}
          availableDates={pastAvailableDates}
          onSelect={handleSelectDate}
          onClose={() => setActivePicker(null)}
        />
      )}

      {activePicker === "current" && (
        <CompareDatePicker
          selectedDate={currentDate}
          availableDates={currentAvailableDates}
          onSelect={handleSelectDate}
          onClose={() => setActivePicker(null)}
        />
      )}
    </div>
  );
}
