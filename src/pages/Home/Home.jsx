import { useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import styled from "styled-components";
import Header from "../../components/home/Header";
import UserInfo from "../../components/home/UserInfo";
import CalendarView from "../../components/home/CalendarView";
import PhaseGuideBanner from "../../components/home/PhaseGuideBanner";
import RoutineSection from "../../components/home/RoutineSection";
import CalendarDateActionModal from "../../components/home/CalendarDateActionModal";
import TodaySkinStatusCard from "../../components/home/TodaySkinStatusCard";
import { getPhaseForDate, PHASE_LABEL } from "../../utils/cyclePhase";
import { getSkinScoreBucket, SKIN_SCORE_BUCKET, SKIN_SCORE_BUCKET_CONTENT } from "../../utils/skinScoreBucket";
import {
  MOCK_USER,
  MOCK_PERIOD_CYCLES,
  MOCK_SKIN_RECORDS,
  PHASE_GUIDE,
  PHASE_ROUTINES,
} from "../../mocks/homeMock";

// TODO: 나쁨/보통/좋음 아이콘 PO한테 받으면 각각 교체 (지금은 전부 모름 아이콘으로 임시 처리)
import skinStatusUnknownIcon from "../../assets/icons/skin_status_unknown.svg";

const SKIN_SCORE_BUCKET_ICON = {
  [SKIN_SCORE_BUCKET.UNKNOWN]: skinStatusUnknownIcon,
  [SKIN_SCORE_BUCKET.BAD]: skinStatusUnknownIcon,
  [SKIN_SCORE_BUCKET.NORMAL]: skinStatusUnknownIcon,
  [SKIN_SCORE_BUCKET.GOOD]: skinStatusUnknownIcon,
};

const SectionLabel = styled.h2`
  width: 354px;
  margin: 20px auto 0;
  color: #2d2d2d;
  font-family: "Pretendard Variable";
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

export default function Home() {
  const navigate = useNavigate();
  const today = dayjs().format("YYYY-MM-DD");
  const currentPhase = getPhaseForDate(today, MOCK_PERIOD_CYCLES);
  const phaseGuide = currentPhase ? PHASE_GUIDE[currentPhase] : null;

  const [selectedDate, setSelectedDate] = useState(null);
  const [modalStep, setModalStep] = useState(null); // "dateAction" | "periodAction" | null

  const todayScore = MOCK_SKIN_RECORDS[today]?.score ?? null;
  const scoreBucket = getSkinScoreBucket(todayScore);
  const bucketContent = SKIN_SCORE_BUCKET_CONTENT[scoreBucket];

  const handleDateClick = (dateStr) => {
    setSelectedDate(dateStr);
    setModalStep("dateAction");
  };

  const closeModal = () => {
    setModalStep(null);
    setSelectedDate(null);
  };

  const handleSelectSkinInfo = () => {
    navigate(`/today-skin/result/${selectedDate}`, { state: { showBackHeader: true } });
  };

  const handleSelectPeriodInfo = () => {
    // TODO: PeriodActionModal 구현되면 modalStep을 "periodAction"으로 전환 (별도 이슈)
  };

  const handleViewTodayStatus = () => {
    if (scoreBucket === SKIN_SCORE_BUCKET.UNKNOWN) {
      navigate("/today-skin");
    } else {
      navigate(`/today-skin/result/${today}`, { state: { showBackHeader: true } });
    }
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
      <SectionLabel>오늘의 피부 상태</SectionLabel>
      <TodaySkinStatusCard
        icon={SKIN_SCORE_BUCKET_ICON[scoreBucket]}
        label={bucketContent.label}
        description={bucketContent.description}
        onClick={handleViewTodayStatus}
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