import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import styled from "styled-components";

import Header from "../../components/todaySkin/Header";
import ScoreCompareBlock from "../../components/todaySkin/compare/ScoreCompareBlock";
import MetricCompareCard from "../../components/todaySkin/compare/MetricCompareCard";
import CompareDatePicker from "../../components/todaySkin/compare/CompareDatePicker";
import AiInsightBox from "../../components/todaySkin/AiInsightBox";
import Toast from "../../components/common/Toast";
import { getAnalysisCompare } from "../../api/analysisApi";
import { getCycleCalendar } from "../../api/cycleApi";
import { METRIC_ITEMS } from "../../utils/skinMetrics";
import { METRIC_COMPARISON } from "../../utils/compareMetrics";

const MAX_SEARCH_MONTHS = 12;

const API_CHANGE_TO_COMPARISON = {
  IMPROVED: METRIC_COMPARISON.BETTER,
  WORSENED: METRIC_COMPARISON.WORSE,
  SIMILAR: METRIC_COMPARISON.SAME,
};

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 24px 24px;
`;

function formatDateLabel(dateStr) {
  return dayjs(dateStr).format("YYYY년 M월 D일");
}

// API의 sebum/moisture를
// 비교 컴포넌트가 쓰는 oil/hydration 이름으로 맞춰줌
function mapMetrics(metrics = {}) {
  return {
    trouble: metrics.trouble,
    oil: metrics.sebum,
    dullness: metrics.dullness,
    hydration: metrics.moisture,
    elasticity: metrics.elasticity,
  };
}

// changes도 같은 이유로 sebum/moisture 이름을 변환
function mapChanges(changes = {}) {
  return {
    trouble: changes.trouble,
    oil: changes.sebum,
    dullness: changes.dullness,
    hydration: changes.moisture,
    elasticity: changes.elasticity,
  };
}

function mergeDates(previousDates, newDates) {
  return [...new Set([...previousDates, ...newDates])].sort();
}

export default function TodaySkinCompare() {
  const { date } = useParams();
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = useState(date);
  const [pastDate, setPastDate] = useState(null);
  const [activePicker, setActivePicker] = useState(null); // null | "past" | "current"
  const [toastMessage, setToastMessage] = useState(null);

  // 분석 기록이 있는 날짜 목록
  const [recordedDates, setRecordedDates] = useState([date]);

  // 두 날짜 비교 API 결과
  const [compareData, setCompareData] = useState(null);

  const [initialLoading, setInitialLoading] = useState(true);
  const [compareError, setCompareError] = useState(false);

  // 처음 비교 화면에 들어오면 현재 날짜보다 이전의 가장 최근 기록을 찾음
  useEffect(() => {
    let cancelled = false;

    async function loadInitialDates() {
      setInitialLoading(true);
      setCurrentDate(date);
      setPastDate(null);
      setRecordedDates([date]);

      let month = dayjs(date).startOf("month");
      let collectedDates = [date];

      try {
        // 이전 기록이 나올 때까지 월별 캘린더 데이터를 확인
        // 무한 요청 방지를 위해 최대 12개월까지만 확인
        for (let i = 0; i < MAX_SEARCH_MONTHS; i += 1) {
          const calendarData = await getCycleCalendar(
            month.year(),
            month.month() + 1,
          );

          if (cancelled) return;

          const monthAnalysisDates = (calendarData?.analyses ?? []).map(
            (analysis) => analysis.date,
          );

          collectedDates = mergeDates(collectedDates, monthAnalysisDates);

          setRecordedDates(collectedDates);

          const previousDate =
            collectedDates.filter((recordDate) => recordDate < date).at(-1) ??
            null;

          if (previousDate) {
            setPastDate(previousDate);
            break;
          }

          month = month.subtract(1, "month");
        }
      } catch (error) {
        console.error("비교 가능 날짜 조회 실패:", error);
      } finally {
        if (!cancelled) {
          setInitialLoading(false);
        }
      }
    }

    loadInitialDates();

    return () => {
      cancelled = true;
    };
  }, [date]);

  // pastDate/currentDate가 바뀔 때마다 실제 비교 결과 재조회
  useEffect(() => {
    if (!pastDate || !currentDate) {
      setCompareData(null);
      return undefined;
    }

    let cancelled = false;

    setCompareData(null);
    setCompareError(false);

    getAnalysisCompare(pastDate, currentDate)
      .then((data) => {
        if (!cancelled) {
          setCompareData(data);
        }
      })
      .catch((error) => {
        console.error("피부 기록 비교 조회 실패:", error);

        if (!cancelled) {
          setCompareError(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [pastDate, currentDate]);

  // 날짜 선택 모달에서 다른 달로 이동하면
  // 해당 월의 분석 기록 날짜를 추가로 불러옴
  const handlePickerMonthChange = (month) => {
    getCycleCalendar(month.year(), month.month() + 1)
      .then((calendarData) => {
        const monthAnalysisDates = (calendarData?.analyses ?? []).map(
          (analysis) => analysis.date,
        );

        setRecordedDates((prev) => mergeDates(prev, monthAnalysisDates));
      })
      .catch((error) => {
        console.error("비교 가능 날짜 조회 실패:", error);
      });
  };

  const currentAvailableDates = recordedDates.filter(
    (recordDate) => recordDate > (pastDate ?? ""),
  );

  const handleSelectDate = (selectedDate) => {
    if (activePicker === "past") {
      const isPastDate = dayjs(selectedDate).isBefore(currentDate, "day");
      if (!isPastDate) {
        setToastMessage("과거 날짜를 선택해주세요.");
        return;
      }
      setPastDate(selectedDate);
    } else {
      setCurrentDate(selectedDate);
    }
    setActivePicker(null);
  };

  if (initialLoading) {
    return (
      <div>
        <Header
          variant="back"
          title="피부 기록 비교"
          onBack={() => navigate(-1)}
        />
        <Content>비교할 피부 기록을 불러오는 중이에요.</Content>
      </div>
    );
  }

  if (!pastDate) {
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

  if (compareError) {
    return (
      <div>
        <Header
          variant="back"
          title="피부 기록 비교"
          onBack={() => navigate(-1)}
        />
        <Content>피부 기록 비교를 불러오지 못했어요.</Content>
      </div>
    );
  }

  if (!compareData) {
    return (
      <div>
        <Header
          variant="back"
          title="피부 기록 비교"
          onBack={() => navigate(-1)}
        />
        <Content>피부 기록을 비교하고 있어요.</Content>
      </div>
    );
  }

  const pastRecord = compareData.dateA;
  const currentRecord = compareData.dateB;

  const pastMetrics = mapMetrics(pastRecord.metrics);
  const currentMetrics = mapMetrics(currentRecord.metrics);
  const changes = mapChanges(compareData.changes);

  const metrics = Object.fromEntries(
    METRIC_ITEMS.map(({ key }) => [
      key,
      {
        past: pastMetrics[key],
        current: currentMetrics[key],
        comparison:
          API_CHANGE_TO_COMPARISON[changes[key]] ?? METRIC_COMPARISON.SAME,
      },
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
            dateLabel: formatDateLabel(pastRecord.date),
            photoUrl: pastRecord.imageUrl,
            score: pastRecord.overallScore,
            statusText: pastRecord.skinStatus,
          }}
          current={{
            dateLabel: formatDateLabel(currentRecord.date),
            photoUrl: currentRecord.imageUrl,
            score: currentRecord.overallScore,
            statusText: currentRecord.skinStatus,
          }}
          onSelectPastDate={() => setActivePicker("past")}
          onSelectCurrentDate={() => setActivePicker("current")}
        />

        <MetricCompareCard metrics={metrics} />

        <AiInsightBox title="AI 분석" insight={compareData.aiComment} />
      </Content>

      {activePicker === "past" && (
        <CompareDatePicker
          selectedDate={pastDate}
          availableDates={recordedDates}
          onSelect={handleSelectDate}
          onClose={() => setActivePicker(null)}
          onMonthChange={handlePickerMonthChange}
        />
      )}

      {activePicker === "current" && (
        <CompareDatePicker
          selectedDate={currentDate}
          availableDates={currentAvailableDates}
          onSelect={handleSelectDate}
          onClose={() => setActivePicker(null)}
          onMonthChange={handlePickerMonthChange}
        />
      )}
      {toastMessage && (
        <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
      )}
    </div>
  );
}
