import { useEffect, useState } from "react";
import dayjs from "dayjs";
import styled from "styled-components";

import TroubleTrendChart, {
  buildTroubleDataFromRecords,
} from "../../components/insight/TroubleTrendChart";
import PhaseRadarChart from "../../components/insight/PhaseRadarChart";
import HabitImpactCard from "../../components/insight/HabitImpactCard";
import { getHabitStatus, parseExerciseMinutes } from "../../utils/habitStatus";
import { findCurrentCycle } from "../../utils/cyclePhase";

const getCurrentTime = () =>
  new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());

const Page = styled.div`
  width: 100%;
  max-width: 402px;
  min-height: 100vh;
  margin: 0 auto;
  padding: 0 20px 84px;
  background: #fff;
`;

const StatusBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 8px;
  color: #111;
  font-size: 14px;
  font-weight: 700;
`;

const StatusIcons = styled.span`
  font-size: 13px;
  letter-spacing: 2px;
`;

const Title = styled.h1`
  margin: 28px 0 34px;
  color: #9b6dff;
  text-align: center;
  font-size: 24px;
  font-weight: 700;
`;

const Section = styled.section`
  margin-top: 22px;

  &:first-of-type {
    margin-top: 0;
  }
`;

const SectionTitle = styled.h2`
  margin-bottom: 10px;
  color: #292929;
  font-size: 15px;
  font-weight: 700;
`;

const Description = styled.div`
  margin-top: 10px;
  padding: 12px;
  border-radius: 14px;
  background: #f6f0ff;
  color: #9b7af8;
  font-size: 11px;

  strong {
    display: block;
    margin-bottom: 4px;
    color: #5f5a67;
    font-size: 12px;
  }
`;

const HabitList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const HabitListMessage = styled.p`
  padding: 16px;
  color: #999;
  text-align: center;
  font-size: 12px;
`;

// TODO: 실제 API 연동 필요.
// 생리 주기 기록 + 날짜별 피부 기록(트러블 지수 포함)을 함께 내려주는 엔드포인트를 가정.
// 예상 응답 형태: { periodCycles: [...], skinRecords: { "2026-08-01": { troubleScore: 42 }, ... } }
async function fetchCycleAndSkinData() {
  const response = await fetch("/api/insight/cycle-skin-records");
  if (!response.ok) {
    throw new Error("주기/피부 데이터를 불러오지 못했습니다.");
  }
  return response.json();
}

// TODO: 실제 API 연동 필요.
// 주기 단계(생리기/배란기/황체기)별 평균 피부 지표를 내려주는 엔드포인트를 가정.
// 예상 응답 형태: { MENSTRUATION: [트러블,유분,칙칙함,수분,탄력], OVULATION: [...], LUTEAL: [...] }
// 기록이 없는 단계는 키 자체를 생략.
async function fetchPhaseComparisonData() {
  const response = await fetch("/api/insight/phase-comparison");
  if (!response.ok) {
    throw new Error("주기 단계별 비교 데이터를 불러오지 못했습니다.");
  }
  return response.json();
}

// TODO: 실제 AI 응답 API 연동 필요.
// 트러블 지수 배열(day, score)을 바탕으로 "생리 D-N부터 트러블이 시작돼요" 같은 문구를 생성.
// 지금은 트러블 지수가 가장 급격히 오르는 지점을 찾는 간단한 로직으로 대체.
function buildTroubleAnalysisText(troubleData) {
  if (!troubleData || troubleData.length < 2) return null;

  let maxIncreaseDay = null;
  let maxIncrease = -Infinity;

  for (let i = 1; i < troubleData.length; i += 1) {
    const diff = troubleData[i].score - troubleData[i - 1].score;
    if (diff > maxIncrease) {
      maxIncrease = diff;
      maxIncreaseDay = troubleData[i - 1].day;
    }
  }

  if (maxIncreaseDay == null) return null;

  const dayLabel =
    maxIncreaseDay === 0
      ? "생리 시작일부터"
      : maxIncreaseDay < 0
      ? `생리 D${maxIncreaseDay}부터`
      : `생리 D+${maxIncreaseDay}부터`;

  return `끼끼님은 ${dayLabel} 트러블이 시작돼요.`;
}

export default function Insight() {
  const [currentTime, setCurrentTime] = useState(getCurrentTime);

  const [periodCycles, setPeriodCycles] = useState([]);
  const [skinRecords, setSkinRecords] = useState({});
  const [isLoadingCycleData, setIsLoadingCycleData] = useState(true);

  const [phaseComparisonData, setPhaseComparisonData] = useState({});
  const [isLoadingPhaseData, setIsLoadingPhaseData] = useState(true);

  const [habitData, setHabitData] = useState(null);
  const [isLoadingHabits, setIsLoadingHabits] = useState(true);
  const [habitError, setHabitError] = useState(null);

  useEffect(() => {
    const timer = window.setInterval(
      () => setCurrentTime(getCurrentTime()),
      30_000,
    );

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setIsLoadingCycleData(true);
        const data = await fetchCycleAndSkinData();
        if (isMounted) {
          setPeriodCycles(data.periodCycles ?? []);
          setSkinRecords(data.skinRecords ?? {});
        }
      } catch {
        // 실패 시 빈 상태로 유지 (그래프/설명 모두 안 뜸)
      } finally {
        if (isMounted) setIsLoadingCycleData(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setIsLoadingPhaseData(true);
        const data = await fetchPhaseComparisonData();
        if (isMounted) setPhaseComparisonData(data ?? {});
      } catch {
        // 실패 시 빈 상태로 유지 (오각형 틀만 표시)
      } finally {
        if (isMounted) setIsLoadingPhaseData(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setIsLoadingHabits(true);
        const data = await fetchHabitData();
        if (isMounted) setHabitData(data);
      } catch (error) {
        if (isMounted) setHabitError(error.message);
      } finally {
        if (isMounted) setIsLoadingHabits(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // API 값 → 카드에 필요한 emoji/title/result로 변환
  const habitCards = habitData
    ? [
        { type: "sleep", value: habitData.sleepHours },
        { type: "water", value: habitData.waterIntake },
        { type: "exercise", value: parseExerciseMinutes(habitData.exercise) },
      ]
        .filter((habit) => typeof habit.value === "number")
        .map((habit) => ({
          type: habit.type,
          ...getHabitStatus(habit.type, habit.value),
        }))
        .filter(Boolean)
    : [];

  // "트러블 지수 분석" 문구는 실제 트러블 지수 데이터가 있을 때만 계산/표시
  const today = dayjs().format("YYYY-MM-DD");
  const currentCycle = findCurrentCycle(periodCycles, today);
  const troubleData = currentCycle
    ? buildTroubleDataFromRecords(currentCycle.cycleStartDate, skinRecords)
    : [];
  const troubleAnalysisText = buildTroubleAnalysisText(troubleData);

  return (
    <Page>
      <Title>Skin Insight</Title>

      <Section>
        <SectionTitle>생리 시작일 기준 트러블 지수</SectionTitle>
        <TroubleTrendChart periodCycles={periodCycles} skinRecords={skinRecords} />

        {!isLoadingCycleData && troubleAnalysisText && (
          <Description>
            <strong>ⓘ 트러블 지수 분석</strong>
            {troubleAnalysisText}
          </Description>
        )}
      </Section>

      <Section>
        <SectionTitle>주기 단계별 피부 비교</SectionTitle>
        <PhaseRadarChart data={isLoadingPhaseData ? {} : phaseComparisonData} />
      </Section>

      <Section>
        <SectionTitle>생활 습관 영향 분석</SectionTitle>

        <HabitList>
          {isLoadingHabits && (
            <HabitListMessage>불러오는 중...</HabitListMessage>
          )}

          {!isLoadingHabits && habitError && (
            <HabitListMessage>
              생활 습관 데이터를 불러오지 못했어요.
            </HabitListMessage>
          )}

          {!isLoadingHabits &&
            !habitError &&
            habitCards.length === 0 && (
              <HabitListMessage>
                아직 기록된 생활 습관 데이터가 없어요.
              </HabitListMessage>
            )}

          {!isLoadingHabits &&
            !habitError &&
            habitCards.map((habit) => (
              <HabitImpactCard
                key={habit.type}
                emoji={habit.emoji}
                title={habit.title}
                result={habit.result}
                color="#9B6DFF"
              />
            ))}
        </HabitList>
      </Section>
    </Page>
  );
}

// TODO: 실제 API 연동 필요.
// todaySkin/RecordForm.jsx에서 기록한 값(sleepHours, waterIntake, exercise)을
// 서버가 집계해서 내려주는 형태를 가정.
async function fetchHabitData() {
  const response = await fetch("/api/insight/habits");
  if (!response.ok) {
    throw new Error("습관 데이터를 불러오지 못했습니다.");
  }
  return response.json();
}