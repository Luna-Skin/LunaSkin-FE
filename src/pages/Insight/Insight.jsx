import { useEffect, useState } from "react";
import dayjs from "dayjs";
import styled from "styled-components";

import TroubleTrendChart, {
  buildTroubleDataFromRecords,
} from "../../components/insight/TroubleTrendChart";
import PhaseRadarChart from "../../components/insight/PhaseRadarChart";
import HabitImpactCard from "../../components/insight/HabitImpactCard";
import { findCurrentCycle } from "../../utils/cyclePhase";


const Page = styled.div`
  width: 100%;
  max-width: 402px;
  margin: 0 auto;
  padding: 0 20px 20px;
  background: #fff;
`;


const Title = styled.h1`
  margin: 20px 0 30px;
  color: #9b6dff;
  text-align: center;
  font-size: 24px;
  font-weight: 700;
`;


const Section = styled.section`
  margin-top: 18px;

  &:first-of-type {
    margin-top: 0;
  }
`;


const SectionTitle = styled.h2`
  margin-bottom: 8px;
  color: #292929;
  font-size: 15px;
  font-weight: 700;
`;


const Description = styled.div`
  margin-top: 8px;
  padding: 10px 12px;
  border-radius: 14px;
  background: #f6f0ff;
  color: #9b7af8;
  font-size: 11px;

  strong {
    display: block;
    margin-bottom: 3px;
    color: #5f5a67;
    font-size: 12px;
  }
`;


const HabitList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;


const HabitListMessage = styled.p`
  padding: 12px 16px;
  color: #999;
  text-align: center;
  font-size: 12px;
`;


/* =========================
   API
========================= */

// 1. 생리 주기 + 피부 기록
async function fetchCycleAndSkinData() {
  const response = await fetch(
    "/api/insight/cycle-skin-records",
  );

  if (!response.ok) {
    throw new Error("주기/피부 데이터를 불러오지 못했습니다.");
  }

  return response.json();
}


// 2. 주기 단계별 피부 비교
async function fetchPhaseComparisonData() {
  const response = await fetch(
    "/api/insight/phase-comparison",
  );

  if (!response.ok) {
    throw new Error("주기 단계별 비교 데이터를 불러오지 못했습니다.");
  }

  return response.json();
}


// 3. 생활 습관 원본 데이터
async function fetchHabitData() {
  const response = await fetch(
    "/api/insight/habits",
  );

  if (!response.ok) {
    throw new Error("생활 습관 데이터를 불러오지 못했습니다.");
  }

  return response.json();
}


// 4. AI Agent 생활습관 분석
async function fetchHabitAnalysis(habitData) {
  const response = await fetch(
    "/api/insight/habit-analysis",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(habitData),
    },
  );

  if (!response.ok) {
    throw new Error("AI 생활 습관 분석에 실패했습니다.");
  }

  return response.json();
}


/* =========================
   트러블 분석
========================= */

// TODO:
// 추후 AI Agent API가 연결되면 이 함수 대신
// AI가 생성한 분석 문구를 사용하면 됨.
function buildTroubleAnalysisText(troubleData) {
  if (!troubleData || troubleData.length < 2) {
    return null;
  }

  let maxIncreaseDay = null;
  let maxIncrease = -Infinity;

  for (let i = 1; i < troubleData.length; i += 1) {
    const diff =
      troubleData[i].score - troubleData[i - 1].score;

    if (diff > maxIncrease) {
      maxIncrease = diff;
      maxIncreaseDay = troubleData[i - 1].day;
    }
  }

  if (maxIncreaseDay == null) {
    return null;
  }

  const dayLabel =
    maxIncreaseDay === 0
      ? "생리 시작일부터"
      : maxIncreaseDay < 0
        ? `생리 D${maxIncreaseDay}부터`
        : `생리 D+${maxIncreaseDay}부터`;

  return `끼끼님은 ${dayLabel} 트러블이 시작돼요.`;
}


/* =========================
   Component
========================= */

export default function Insight() {
  const [periodCycles, setPeriodCycles] = useState([]);
  const [skinRecords, setSkinRecords] = useState({});
  const [isLoadingCycleData, setIsLoadingCycleData] = useState(true);

  const [phaseComparisonData, setPhaseComparisonData] =
    useState({});
  const [isLoadingPhaseData, setIsLoadingPhaseData] =
    useState(true);

  const [habitData, setHabitData] = useState(null);
  const [habitAnalysis, setHabitAnalysis] = useState([]);
  const [isLoadingHabits, setIsLoadingHabits] = useState(true);
  const [habitError, setHabitError] = useState(null);


  /* =========================
     주기 + 피부 데이터
  ========================= */

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
        if (isMounted) {
          setPeriodCycles([]);
          setSkinRecords({});
        }
      } finally {
        if (isMounted) {
          setIsLoadingCycleData(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);


  /* =========================
     주기 단계별 비교
  ========================= */

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setIsLoadingPhaseData(true);

        const data = await fetchPhaseComparisonData();

        if (isMounted) {
          setPhaseComparisonData(data ?? {});
        }
      } catch {
        if (isMounted) {
          setPhaseComparisonData({});
        }
      } finally {
        if (isMounted) {
          setIsLoadingPhaseData(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);


  /* =========================
     생활 습관 + AI 분석
  ========================= */

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setIsLoadingHabits(true);
        setHabitError(null);

        // 먼저 원본 생활습관 데이터를 가져옴
        const data = await fetchHabitData();

        if (!isMounted) return;

        setHabitData(data);

        // 가져온 데이터를 AI Agent에게 전달
        const analysis = await fetchHabitAnalysis(data);

        if (isMounted) {
          setHabitAnalysis(
            analysis.habits ?? [],
          );
        }
      } catch (error) {
        if (isMounted) {
          setHabitError(error.message);
          setHabitAnalysis([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingHabits(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);


  /* =========================
     트러블 지수 계산
  ========================= */

  const today = dayjs().format("YYYY-MM-DD");

  const currentCycle = findCurrentCycle(
    periodCycles,
    today,
  );

  const troubleData = currentCycle
    ? buildTroubleDataFromRecords(
        currentCycle.cycleStartDate,
        skinRecords,
      )
    : [];

  const troubleAnalysisText =
    buildTroubleAnalysisText(troubleData);


  /* =========================
     화면
  ========================= */

  return (
    <Page>

      <Title>
        Skin Insight
      </Title>


      {/* =====================
          트러블 지수
      ===================== */}

      <Section>

        <SectionTitle>
          생리 시작일 기준 트러블 지수
        </SectionTitle>

        <TroubleTrendChart
          periodCycles={periodCycles}
          skinRecords={skinRecords}
        />

        {!isLoadingCycleData &&
          troubleAnalysisText && (
            <Description>
              <strong>
                ⓘ 트러블 지수 분석
              </strong>

              {troubleAnalysisText}
            </Description>
          )}

      </Section>


      {/* =====================
          주기 단계별 피부 비교
      ===================== */}

      <Section>

        <SectionTitle>
          주기 단계별 피부 비교
        </SectionTitle>

        <PhaseRadarChart
          data={
            isLoadingPhaseData
              ? {}
              : phaseComparisonData
          }
        />

      </Section>


      {/* =====================
          생활 습관 영향 분석
      ===================== */}

      <Section>

        <SectionTitle>
          생활 습관 영향 분석
        </SectionTitle>

        <HabitList>

          {isLoadingHabits && (
            <HabitListMessage>
              분석 중...
            </HabitListMessage>
          )}


          {!isLoadingHabits &&
            habitError && (
              <HabitListMessage>
                생활 습관 데이터를
                불러오지 못했어요.
              </HabitListMessage>
            )}


          {!isLoadingHabits &&
            !habitError &&
            habitAnalysis.length === 0 && (
              <HabitListMessage>
                아직 기록된 생활 습관 데이터가 없어요.
              </HabitListMessage>
            )}


          {!isLoadingHabits &&
            !habitError &&
            habitAnalysis.map((habit) => (
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