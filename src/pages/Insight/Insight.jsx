import { useEffect, useState } from "react";
import styled from "styled-components";

import TroubleTrendChart from "../../components/insight/TroubleTrendChart";
import PhaseRadarChart from "../../components/insight/PhaseRadarChart";
import HabitImpactCard from "../../components/insight/HabitImpactCard";
import {
  getTroubleTimeline,
  getCycleDetail,
  getLifestyleInsight,
} from "../../api/insightApi";


const Page = styled.div`
  width: 100%;
  max-width: 402px;
  margin: 0 auto;
  padding: 0 20px 20px;
  background: #fff;
`;


const Title = styled.h1`
  margin: 24px 100px; 20px; 99px;
  color: #A876FC;
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
   응답 데이터 변환
========================= */

// cycle-detail의 phases 배열을
// PhaseRadarChart가 원하는 { MENSTRUATION: [...], OVULATION: [...], LUTEAL: [...] } 형태로 변환
function normalizePhaseData(phases) {
  if (!Array.isArray(phases)) return {};

  const result = {};
  phases.forEach(({ phase, metrics }) => {
    if (!metrics) return;
    result[phase] = [
      metrics.trouble,
      metrics.sebum,
      metrics.dullness,
      metrics.moisture,
      metrics.elasticity,
    ];
  });
  return result;
}

// lifestyle의 factors 배열을
// HabitImpactCard가 원하는 { type, emoji, title, result, color } 형태로 변환
function normalizeHabitFactors(factors) {
  if (!Array.isArray(factors)) return [];

  return factors.map((factor, index) => ({
    type: `${factor.condition}-${index}`,
    emoji: factor.impactType === "negative" ? "⚠️" : "✅",
    title: factor.condition,
    result: factor.impactLabel,
    color: factor.impactType === "negative" ? "#FC7476" : "#6FC6C2",
  }));
}


/* =========================
   Component
========================= */

export default function Insight() {
  const [troubleTimeline, setTroubleTimeline] = useState([]);
  const [troubleAnalysisText, setTroubleAnalysisText] = useState(null);
  const [isLoadingCycleData, setIsLoadingCycleData] = useState(true);

  const [phaseComparisonData, setPhaseComparisonData] = useState({});
  const [isLoadingPhaseData, setIsLoadingPhaseData] = useState(true);

  const [habitAnalysis, setHabitAnalysis] = useState([]);
  const [isLoadingHabits, setIsLoadingHabits] = useState(true);
  const [habitError, setHabitError] = useState(null);


  /* =========================
     트러블 지수
  ========================= */

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setIsLoadingCycleData(true);

        const res = await getTroubleTimeline();

        if (isMounted) {
          setTroubleTimeline(res.data?.troubleTimeline ?? []);
          setTroubleAnalysisText(res.data?.patternComment ?? null);
        }
      } catch {
        if (isMounted) {
          setTroubleTimeline([]);
          setTroubleAnalysisText(null);
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

        const res = await getCycleDetail();

        if (isMounted) {
          setPhaseComparisonData(normalizePhaseData(res.data?.phases));
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
     생활 습관 영향 분석
  ========================= */

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setIsLoadingHabits(true);
        setHabitError(null);

        const res = await getLifestyleInsight();

        if (isMounted) {
          setHabitAnalysis(normalizeHabitFactors(res.data?.factors));
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
          troubleTimeline={troubleTimeline}
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
                color={habit.color}
              />
            ))}

        </HabitList>

      </Section>

    </Page>
  );
}