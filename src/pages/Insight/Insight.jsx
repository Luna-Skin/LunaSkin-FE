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

import alertIcon from "../../assets/icons/alert.svg";

const Page = styled.div`
  width: 100%;
  max-width: 402px;
  min-height: calc(100dvh - 60px);
  margin: 0 auto;
  padding: 24px 24px 84px;
  background: #fff;

  font-family: "Pretendard Variable", Pretendard, sans-serif;
`;

const Title = styled.h1`
  margin: 0 0 24px;

  color: #a876fc;
  text-align: center;

  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 28px;
  font-weight: 700;
  line-height: normal;
`;

const Section = styled.section`
  margin-top: 24px;

  &:first-of-type {
    margin-top: 0;
  }
`;

const SectionTitle = styled.h2`
  margin: 0 0 8px;

  color: #2d2d2d;

  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: normal;
`;

const Description = styled.div`
  margin-top: 12px;
  padding: 16px;

  border-radius: 18px;
  background: rgba(168, 118, 252, 0.1);

  color: rgba(152, 132, 220, 0.8);

  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: normal;

  strong {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 3px;

    color: #616161;

    font-family: "Pretendard Variable", Pretendard, sans-serif;
    font-size: 14px;
    font-weight: 600;
    line-height: normal;
  }
`;

const AlertIcon = styled.img`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
`;

const HabitList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const HabitListMessage = styled.p`
  padding: 12px 16px;

  color: #999;
  text-align: center;

  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: normal;
`;

function normalizePhaseData(phases) {
  if (!Array.isArray(phases)) return {};

  return phases.reduce((result, { phase, metrics }) => {
    if (!phase || !metrics) return result;

    return {
      ...result,
      [phase]: [
        metrics.trouble ?? 0,
        metrics.sebum ?? 0,
        metrics.dullness ?? 0,
        metrics.moisture ?? 0,
        metrics.elasticity ?? 0,
      ],
    };
  }, {});
}

function normalizeHabitFactors(factors) {
  if (!Array.isArray(factors)) return [];

  return factors.map((factor, index) => {
    const isNegative =
      factor.impactType?.toUpperCase() === "NEGATIVE";

    return {
      type: `${factor.condition ?? "habit"}-${index}`,
      emoji: isNegative ? "😰" : "😀",
      title: factor.condition ?? "생활 습관 분석",
      result: factor.impactLabel ?? "",
      color: "#825FBD",
    };
  });
}

export default function Insight() {
  const [troubleTimeline, setTroubleTimeline] = useState([]);
  const [peakRange, setPeakRange] = useState(null);
  const [troubleAnalysisText, setTroubleAnalysisText] = useState(null);
  const [isLoadingTrouble, setIsLoadingTrouble] = useState(true);

  const [phaseComparisonData, setPhaseComparisonData] = useState({});
  const [isLoadingPhase, setIsLoadingPhase] = useState(true);

  const [habitAnalysis, setHabitAnalysis] = useState([]);
  const [isLoadingHabits, setIsLoadingHabits] = useState(true);
  const [habitError, setHabitError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadTroubleTimeline() {
      try {
        const response = await getTroubleTimeline();
        const data = response.data ?? {};

        if (!isMounted) return;

        setTroubleTimeline(data.troubleTimeline ?? []);
        setPeakRange(data.peakRange ?? null);
        setTroubleAnalysisText(data.patternComment ?? null);
      } catch {
        if (!isMounted) return;

        setTroubleTimeline([]);
        setPeakRange(null);
        setTroubleAnalysisText(null);
      } finally {
        if (isMounted) setIsLoadingTrouble(false);
      }
    }

    loadTroubleTimeline();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadCycleDetail() {
      try {
        const response = await getCycleDetail();

        if (!isMounted) return;

        setPhaseComparisonData(
          normalizePhaseData(response.data?.phases),
        );
      } catch {
        if (isMounted) setPhaseComparisonData({});
      } finally {
        if (isMounted) setIsLoadingPhase(false);
      }
    }

    loadCycleDetail();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadLifestyleInsight() {
      try {
        const response = await getLifestyleInsight();

        if (!isMounted) return;

        setHabitAnalysis(
          normalizeHabitFactors(response.data?.factors),
        );
      } catch {
        if (!isMounted) return;

        setHabitError(true);
        setHabitAnalysis([]);
      } finally {
        if (isMounted) setIsLoadingHabits(false);
      }
    }

    loadLifestyleInsight();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Page>
      <Title>Skin Insight</Title>

      <Section>
        <SectionTitle>
          생리 시작일 기준 트러블 지수
        </SectionTitle>

        <TroubleTrendChart
          troubleTimeline={troubleTimeline}
          peakRange={peakRange}
        />

        {!isLoadingTrouble && troubleAnalysisText && (
          <Description>
            <strong>
              <AlertIcon src={alertIcon} alt="" />
              트러블 지수 분석
            </strong>
            {troubleAnalysisText}
          </Description>
        )}
      </Section>

      <Section>
        <SectionTitle>
          주기 단계별 피부 비교
        </SectionTitle>

        <PhaseRadarChart
          data={isLoadingPhase ? {} : phaseComparisonData}
        />
      </Section>

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

          {!isLoadingHabits && habitError && (
            <HabitListMessage>
              생활 습관 데이터를 불러오지 못했어요.
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
                {...habit}
              />
            ))}
        </HabitList>
      </Section>
    </Page>
  );
}