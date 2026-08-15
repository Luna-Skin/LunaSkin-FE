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
import PeriodSelectBanner from "../../components/home/PeriodSelectBanner";
import TodaySkinStatusCard from "../../components/home/TodaySkinStatusCard";
import Toast from "../../components/common/Toast";
import { getPhaseForDate, PHASE_LABEL } from "../../utils/cyclePhase";
import {
  getSkinScoreBucket,
  SKIN_SCORE_BUCKET,
  SKIN_SCORE_BUCKET_CONTENT,
} from "../../utils/skinScoreBucket";
import {
  MOCK_USER,
  MOCK_PERIOD_CYCLES,
  MOCK_SKIN_RECORDS,
  PHASE_GUIDE,
  PHASE_ROUTINES,
} from "../../mocks/homeMock";

import skinStatusUnknownIcon from "../../assets/icons/skin_status_unknown.svg";
import skinStatusBadIcon from "../../assets/icons/skin_status_bad.png";
import skinStatusNormalIcon from "../../assets/icons/skin_status_normal.png";
import skinStatusGoodIcon from "../../assets/icons/skin_status_good.png";
import { getPoints } from "../../utils/pointsStorage";


const MAX_PERIOD_DURATION_DAYS = 10;

const SKIN_SCORE_BUCKET_ICON = {
  [SKIN_SCORE_BUCKET.UNKNOWN]: skinStatusUnknownIcon,
  [SKIN_SCORE_BUCKET.BAD]: skinStatusBadIcon,
  [SKIN_SCORE_BUCKET.NORMAL]: skinStatusNormalIcon,
  [SKIN_SCORE_BUCKET.GOOD]: skinStatusGoodIcon,
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

const ConfirmButton = styled.button`
  display: block;
  width: 354px;
  margin: 14px auto 0;
  height: 48px;
  border-radius: 14px;
  border: none;
  background: ${({ disabled }) => (disabled ? "#c6c6c6" : "#9a71df")};
  color: #fff;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  font-family: "Pretendard Variable";
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const PageWrapper = styled.div`
  padding-bottom: 24px;
`;

export default function Home() {
  const navigate = useNavigate();
  const today = dayjs().format("YYYY-MM-DD");
  const currentPhase = getPhaseForDate(today, MOCK_PERIOD_CYCLES);
  const phaseGuide = currentPhase ? PHASE_GUIDE[currentPhase] : null;

  // 지금 "수정 중"으로 취급할 주기 기록 — 가장 최근에 기록된 것.
  // TODO: mocks 반영 to-do에서 실제로 이 기록을 갱신하는 로직으로 이어짐
  const currentCycle =
    MOCK_PERIOD_CYCLES[MOCK_PERIOD_CYCLES.length - 1] ?? null;

  const [selectedDate, setSelectedDate] = useState(null);
  const [modalStep, setModalStep] = useState(null); // "dateAction" | "periodAction" | null

  // 홈 캘린더에서 바로 생리 시작일/종료일을 고르는 중인지 관리
  const [periodSelectMode, setPeriodSelectMode] = useState(null); // "start" | "end" | null
  const [periodSelectedDate, setPeriodSelectedDate] = useState(null);

  const [toastMessage, setToastMessage] = useState(null);

  const todayScore = MOCK_SKIN_RECORDS[today]?.score ?? null;
  const scoreBucket = getSkinScoreBucket(todayScore);
  const bucketContent = SKIN_SCORE_BUCKET_CONTENT[scoreBucket];

  const handleDateClick = (dateStr) => {
    if (periodSelectMode) {
      setPeriodSelectedDate(dateStr);
      return;
    }

    setSelectedDate(dateStr);
    setModalStep("dateAction");
  };

  const closeModal = () => {
    setModalStep(null);
    setSelectedDate(null);
  };

  const handleSelectSkinInfo = () => {
    navigate(`/today-skin/result/${selectedDate}`, {
      state: { showBackHeader: true },
    });
  };

  const handleSelectPeriodInfo = () => {
    setModalStep("periodAction");
  };

  const handleEditPeriodStart = () => {
    const targetDate = selectedDate;

    closeModal();
    setPeriodSelectMode("start");
    setPeriodSelectedDate(targetDate);
  };

  const handleEditPeriodEnd = () => {
    const targetDate = selectedDate;

    closeModal();

    if (!currentCycle) {
      setToastMessage("시작일을 먼저 입력해야 합니다");
      return;
    }

    const startDate = dayjs(currentCycle.cycleStartDate);
    const diffDays = dayjs(targetDate).diff(startDate, "day");

    if (diffDays < 0) {
      setToastMessage("종료일은 시작일 이후여야 해요");
      return;
    }

    if (diffDays >= MAX_PERIOD_DURATION_DAYS) {
      setToastMessage(
        `생리 시작일로부터 ${MAX_PERIOD_DURATION_DAYS}일 이내의 날짜만 선택할 수 있어요`,
      );
      return;
    }

    setPeriodSelectMode("end");
    setPeriodSelectedDate(targetDate);
  };

  const handleCancelPeriodSelect = () => {
    setPeriodSelectMode(null);
    setPeriodSelectedDate(null);
  };

  // TODO: 다음 to-do(mocks 반영)에서 여기에 실제 MOCK_PERIOD_CYCLES 갱신 로직 추가
  const handleConfirmPeriodSelect = () => {
    if (
      periodSelectMode === "end" &&
      periodSelectedDate === currentCycle?.cycleStartDate
    ) {
      setToastMessage("종료일과 시작일이 같을 수 없습니다");
      return;
    }

    console.log(
      `${periodSelectMode === "start" ? "생리 시작일" : "생리 종료일"} 선택:`,
      periodSelectedDate,
    );

    setPeriodSelectMode(null);
    setPeriodSelectedDate(null);
  };

  const handleViewTodayStatus = () => {
    if (scoreBucket === SKIN_SCORE_BUCKET.UNKNOWN) {
      navigate("/today-skin");
    } else {
      navigate(`/today-skin/result/${today}`, {
        state: { showBackHeader: true },
      });
    }
  };

  return (
    <div>
      <PageWrapper>
        <Header />

        <UserInfo
          name={MOCK_USER.name}
          skinType={MOCK_USER.skinType}
          skinConcerns={MOCK_USER.skinConcerns}
          points={getPoints()}
        />

        {periodSelectMode && (
          <PeriodSelectBanner
            message={
              periodSelectMode === "start"
                ? "생리 시작일을 선택해주세요"
                : "생리 종료일을 선택해주세요"
            }
            onCancel={handleCancelPeriodSelect}
          />
        )}

        <CalendarView
          periodCycles={MOCK_PERIOD_CYCLES}
          skinRecords={MOCK_SKIN_RECORDS}
          onDateClick={handleDateClick}
          selectMode={Boolean(periodSelectMode)}
          selectedDate={periodSelectedDate}
        />

        {periodSelectMode && (
          <ConfirmButton
            type="button"
            disabled={!periodSelectedDate}
            onClick={handleConfirmPeriodSelect}
          >
            확인
          </ConfirmButton>
        )}

        <SectionLabel>오늘의 피부 상태</SectionLabel>

        <TodaySkinStatusCard
          icon={SKIN_SCORE_BUCKET_ICON[scoreBucket]}
          label={bucketContent.label}
          description={bucketContent.description}
          onClick={handleViewTodayStatus}
        />

        {phaseGuide && (
          <PhaseGuideBanner
            title={phaseGuide.title}
            description={phaseGuide.description}
          />
        )}

        {currentPhase && (
          <RoutineSection
            phaseLabel={PHASE_LABEL[currentPhase]}
            routines={PHASE_ROUTINES[currentPhase]}
          />
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

        {toastMessage && (
          <Toast
            message={toastMessage}
            onDismiss={() => setToastMessage(null)}
          />
        )}
      </PageWrapper>
    </div>
  );
}
