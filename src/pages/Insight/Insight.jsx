import { useEffect, useState } from "react";
import styled from "styled-components";

import TroubleTrendChart from "../../components/insight/TroubleTrendChart";
import PhaseRadarChart from "../../components/insight/PhaseRadarChart";
import HabitImpactCard from "../../components/insight/HabitImpactCard";
import { getHabitStatus, parseExerciseMinutes } from "../../utils/habitStatus";

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
// todaySkin/RecordForm.jsx에서 기록한 값(sleepHours, waterIntake, exercise)을
// 서버가 집계해서 내려주는 형태를 가정. 실제 응답 스펙이 정해지면 필드명 맞춰서 수정.
// 예상 응답 형태: { sleepHours: number, waterIntake: number, exercise: "0분" | "30분" | "60분" | "90분+" }
async function fetchHabitData() {
  const response = await fetch("/api/insight/habits"); // 실제 엔드포인트로 교체
  if (!response.ok) {
    throw new Error("습관 데이터를 불러오지 못했습니다.");
  }
  return response.json();
}

export default function Insight() {
  const [currentTime, setCurrentTime] = useState(getCurrentTime);
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

  return (
    <Page>
      <Title>Skin Insight</Title>

      <Section>
        <SectionTitle>생리 시작일 기준 트러블 지수</SectionTitle>
        <TroubleTrendChart />

        <Description>
          <strong>ⓘ 트러블 지수 분석</strong>
          끼끼님은 생리 D - 5부터 턱선 트러블이 시작돼요.
        </Description>
      </Section>

      <Section>
        <SectionTitle>주기 단계별 피부 비교</SectionTitle>
        <PhaseRadarChart />
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