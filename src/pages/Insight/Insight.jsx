import { useEffect, useState } from "react";
import styled from "styled-components";

import TroubleTrendChart from "../../components/insight/TroubleTrendChart";
import PhaseRadarChart from "../../components/insight/PhaseRadarChart";
import HabitImpactCard from "../../components/insight/HabitImpactCard";

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

export default function Insight() {
  const [currentTime, setCurrentTime] = useState(getCurrentTime);

  useEffect(() => {
    const timer = window.setInterval(
      () => setCurrentTime(getCurrentTime()),
      30_000,
    );

    return () => window.clearInterval(timer);
  }, []);

  return (
    <Page>
      <StatusBar>
        <span>{currentTime}</span>
        <StatusIcons>▮▮▮ ◒ ▰</StatusIcons>
      </StatusBar>

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
          <HabitImpactCard
            emoji="😰"
            title="수면 6시간 미만"
            result="트러블 ↑"
            color="#9B6DFF"
          />
          <HabitImpactCard
            emoji="😰"
            title="수분 섭취 부족"
            result="건조도 ↑"
            color="#9B6DFF"
          />
          <HabitImpactCard
            emoji="😀"
            title="운동 1시간 이상"
            result="칙칙함 ↓"
            color="#9B6DFF"
          />
        </HabitList>
      </Section>
    </Page>
  );
}