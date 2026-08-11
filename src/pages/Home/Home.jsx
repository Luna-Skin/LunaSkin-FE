import { useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Header from "../../components/home/Header";
import UserInfo from "../../components/home/UserInfo";
import CalendarView from "../../components/home/CalendarView";
import PhaseGuideBanner from "../../components/home/PhaseGuideBanner";
import RoutineSection from "../../components/home/RoutineSection";
import CalendarDateActionModal from "../../components/home/CalendarDateActionModal";
import { getPhaseForDate, PHASE_LABEL } from "../../utils/cyclePhase";
import {
  MOCK_USER,
  MOCK_PERIOD_CYCLES,
  MOCK_SKIN_RECORDS,
  PHASE_GUIDE,
  PHASE_ROUTINES,
} from "../../mocks/homeMock";

export default function Home() {
  const navigate = useNavigate();
  const today = dayjs().format("YYYY-MM-DD");
  const currentPhase = getPhaseForDate(today, MOCK_PERIOD_CYCLES);
  const phaseGuide = currentPhase ? PHASE_GUIDE[currentPhase] : null;

  const [selectedDate, setSelectedDate] = useState(null);
  const [modalStep, setModalStep] = useState(null); // "dateAction" | "periodAction" | null

  const handleDateClick = (dateStr) => {
    setSelectedDate(dateStr);
    setModalStep("dateAction");
  };

  const closeModal = () => {
    setModalStep(null);
    setSelectedDate(null);
  };

const handleSelectSkinInfo = () => {
  navigate(`/today-skin/result/${selectedDate}`, { state: { fromCalendar: true } });
};

  const handleSelectPeriodInfo = () => {
    // TODO: PeriodActionModal 구현되면 modalStep을 "periodAction"으로 전환 (별도 이슈)
  };

  return (
    <div>
      <Header />
      <UserInfo name={MOCK_USER.name} skinType={MOCK_USER.skinType} skinConcerns={MOCK_USER.skinConcerns} />
      <CalendarView
        periodCycles={MOCK_PERIOD_CYCLES}
        skinRecords={MOCK_SKIN_RECORDS}
        onDateClick={handleDateClick}
      />
      {phaseGuide && <PhaseGuideBanner title={phaseGuide.title} description={phaseGuide.description} />}
      {currentPhase && (
        <RoutineSection phaseLabel={PHASE_LABEL[currentPhase]} routines={PHASE_ROUTINES[currentPhase]} />
      )}

      {modalStep === "dateAction" && (
        <CalendarDateActionModal
          date={selectedDate}
          canViewSkinInfo={Boolean(MOCK_SKIN_RECORDS[selectedDate])}
          onSelectSkinInfo={handleSelectSkinInfo}
          onSelectPeriodInfo={handleSelectPeriodInfo}
          onClose={closeModal}
        />
      )}
    </div>
  );
}