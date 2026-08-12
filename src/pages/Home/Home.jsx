import { useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import styled from "styled-components";
import Header from "../../components/home/Header";
import UserInfo from "../../components/home/UserInfo";
import CalendarView from "../../components/home/CalendarView";
import PhaseGuideBanner from "../../components/home/PhaseGuideBanner";
import RoutineSection from "../../components/home/RoutineSection";
import ActionListModal from "../../components/home/ActionListModal";
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
    setModalStep("periodAction");
  };

  // TODO: 다음 to-do(PeriodDatePicker.jsx)에서 실제 날짜 선택 화면으로 교체
  const handleEditPeriodStart = () => {
    alert("생리 시작일 수정 화면은 다음 to-do에서 구현 예정");
  };

  const handleEditPeriodEnd = () => {
    alert("생리 종료일 수정 화면은 다음 to-do에서 구현 예정");
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
        <ActionListModal
          title={dayjs(selectedDate).format("M월 D일")}
          onClose={closeModal}
          options={[
            { label: "생리 정보 수정", onClick: handleSelectPeriodInfo },
            ...(MOCK_SKIN_RECORDS[selectedDate]
              ? [{ label: "피부 정보 보기", onClick: handleSelectSkinInfo }]
              : []),
          ]}
        />
      )}

      {modalStep === "periodAction" && (
        <ActionListModal
          title="생리 정보 수정"
          onClose={closeModal}
          options={[
            { label: "생리 시작일 수정", onClick: handleEditPeriodStart },
            { label: "생리 종료일 수정", onClick: handleEditPeriodEnd },
          ]}
        />
      )}
    </div>
  );
}