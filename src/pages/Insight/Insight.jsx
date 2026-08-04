import styled from "styled-components";

import TroubleTrendChart from "../../components/insight/TroubleTrendChart";
import PhaseRadarChart from "../../components/insight/PhaseRadarChart";
import HabitImpactCard from "../../components/insight/HabitImpactCard";

const Page = styled.div`
  width: 100%;
  max-width: 402px;
  min-height: 100vh;
  margin: 0 auto;
  padding: 36px 16px 84px;
  background: #fff;
`;

const Title = styled.h1`
  margin-bottom: 22px;
  text-align: center;
  color: #9b6dff;
  font-size: 24px;
  font-weight: 700;
`;

const Section = styled.section`
  margin-top: 20px;
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
  border-radius: 10px;
  background: #f6f0ff;
  color: #8d73cf;
  font-size: 11px;

  strong {
    display: block;
    margin-bottom: 4px;
    color: #6e6e6e;
    font-size: 12px;
  }
`;

const HabitList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export default function Insight() {
  return (
    <Page>
      <Title>Skin Insight</Title>

      <Section>
        <SectionTitle>생리 시작일 기준 트러블 지수</SectionTitle>
        <TroubleTrendChart />
        <Description>
          <strong>ⓘ 트러블 지수 분석</strong>
          기기 비운 생리 D - 5부터 트러블이 시작돼요.
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
            emoji="😴"
            title="수면 6시간 미만"
            result="트러블 ↑"
            color="#38C8C0"
          />
          <HabitImpactCard
            emoji="😰"
            title="수분 섭취 부족"
            result="건조도 ↑"
            color="#38C8C0"
          />
          <HabitImpactCard
            emoji="😃"
            title="운동 1시간 이상"
            result="착화함 ↓"
            color="#38C8C0"
          />
        </HabitList>
      </Section>
    </Page>
  );
}