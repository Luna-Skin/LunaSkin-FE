import dayjs from "dayjs";
import Header from "../../components/home/Header";
import UserInfo from "../../components/home/UserInfo";
import CalendarView from "../../components/home/CalendarView";
import PhaseGuideBanner from "../../components/home/PhaseGuideBanner";
import RoutineSection from "../../components/home/RoutineSection";
import { getPhaseForDate, PHASE_LABEL } from "../../utils/cyclePhase";
import {
  MOCK_USER,
  MOCK_PERIOD_CYCLES,
  MOCK_SKIN_RECORDS,
  PHASE_GUIDE,
  PHASE_ROUTINES,
} from "../../mocks/homeMock";

export default function Home() {
  const today = dayjs().format("YYYY-MM-DD");
  const currentPhase = getPhaseForDate(today, MOCK_PERIOD_CYCLES);
  const phaseGuide = currentPhase ? PHASE_GUIDE[currentPhase] : null;

  return (
    <div>
      <Header />
      <UserInfo name={MOCK_USER.name} skinType={MOCK_USER.skinType} skinConcerns={MOCK_USER.skinConcerns} />
      <CalendarView periodCycles={MOCK_PERIOD_CYCLES} skinRecords={MOCK_SKIN_RECORDS} />
      {phaseGuide && <PhaseGuideBanner title={phaseGuide.title} description={phaseGuide.description} />}
      {currentPhase && (
        <RoutineSection phaseLabel={PHASE_LABEL[currentPhase]} routines={PHASE_ROUTINES[currentPhase]} />
      )}
    </div>
  );
}