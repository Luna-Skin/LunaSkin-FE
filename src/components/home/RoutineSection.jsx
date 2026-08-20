import { memo } from "react";
import styled from "styled-components";
import RoutineCard from "./RoutineCard";

const Section = styled.div`
width: 354px;
margin: 0 auto;
`;

const SectionTitle = styled.h2`
  margin: 0 0 12px;
  color: #2d2d2d;
  font-family: "Pretendard Variable";
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

function RoutineSection({ phaseLabel, routines = [] }) {
  return (
    <Section>
      <SectionTitle>{phaseLabel} 추천 루틴</SectionTitle>
      <CardList>
        {routines.map((routine) => (
          <RoutineCard key={routine.id} icon={routine.icon} title={routine.title} description={routine.description} />
        ))}
      </CardList>
    </Section>
  );
}

export default memo(RoutineSection);