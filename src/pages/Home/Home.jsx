import { useEffect, useState } from "react";
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
import { getHomeProfile } from "../../api/userApi";
import { getCycleCalendar, getCyclePhaseComment } from "../../api/cycleApi";
import { getTodayRoutine } from "../../api/routineApi";
import { PHASE_LABEL } from "../../utils/cyclePhase";
import {
  getSkinScoreBucket,
  SKIN_SCORE_BUCKET,
  SKIN_SCORE_BUCKET_CONTENT,
} from "../../utils/skinScoreBucket";
import {
  MOCK_PERIOD_CYCLES,
  MOCK_SKIN_RECORDS,
} from "../../mocks/homeMock";

import skinStatusUnknownIcon from "../../assets/icons/skin_status_unknown.svg";
import skinStatusBadIcon from "../../assets/icons/skin_status_bad.png";
import skinStatusNormalIcon from "../../assets/icons/skin_status_normal.png";
import skinStatusGoodIcon from "../../assets/icons/skin_status_good.png";
import serumIcon from "../../assets/icons/routine_serum.svg";
import waterGlassIcon from "../../assets/icons/routine_water_glass.svg";
import sneakerIcon from "../../assets/icons/routine_sneaker.svg";
import { getPoints } from "../../utils/pointsStorage";


const MAX_PERIOD_DURATION_DAYS = 10;

// PhaseGuideBanner 제목 전용 문구. 
// PHASE_LABEL(생리기/난포기/배란기/황체기)은 다른 곳에서도 쓰이니까 utils에 남겨두고, 이건 이 화면에서만 쓰는 값이라 여기 둠
const PHASE_BANNER_TITLE = {
  MENSTRUATION: "피부 주의 구간",
  FOLLICULAR: "피부 회복 구간",
  OVULATION: "피부 컨디션 최상 구간",
  LUTEAL: "피부 관리 필요 구간",
};

// API가 routineCategory(SKINCARE/ACTION/EXERCISE)로 주는 걸, 카드 제목/아이콘으로 매핑하기
const ROUTINE_CATEGORY_META = {
  SKINCARE: { title: "오늘의 스킨케어", icon: serumIcon },
  ACTION: { title: "오늘의 행동", icon: waterGlassIcon },
  EXERCISE: { title: "오늘의 운동", icon: sneakerIcon },
};

// 매핑에 없는 카테고리가 오면(백엔드가 나중에 종류를 추가하는 경우 등) 이걸로 대체하기 -> 깨진 이미지, 빈 텍스트가 뜨는 걸 방지
const DEFAULT_ROUTINE_META = { title: "오늘의 루틴", icon: serumIcon };

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

  // 오늘의 주기 단계 + 코멘트. API 응답 오기 전엔 null
  const [phaseComment, setPhaseComment] = useState(null);

  useEffect(() => {
    getCyclePhaseComment()
      .then(setPhaseComment)
      .catch((error) => {
        console.error("주기 단계 코멘트 조회 실패:", error);
      });
  }, []);

  const currentPhase = phaseComment?.phaseType ?? null;

  // 오늘의 추천 루틴. API 응답 오기 전엔 빈 배열로 놓기 
  const [routineData, setRoutineData] = useState(null);

  useEffect(() => {
    getTodayRoutine()
      .then(setRoutineData)
      .catch((error) => {
        console.error("오늘의 루틴 조회 실패:", error);
      });
  }, []);

  const routines = (routineData?.routines ?? []).map((routine, index) => {
    const meta = ROUTINE_CATEGORY_META[routine.routineCategory] ?? DEFAULT_ROUTINE_META;
    return {
      id: index,
      icon: meta.icon,
      title: meta.title,
      description: routine.content,
    };
  });

  // 홈 헤더용 프로필(이름, 피부타입, 선택된 피부고민). API 응답 오기 전엔 null
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getHomeProfile()
      .then(setProfile)
      .catch((error) => {
        console.error("홈 프로필 조회 실패:", error);
      });
  }, []);

  // 캘린더가 지금 보여주는 달. CalendarView 안에 있던 상태를 여기로 끌어올림 —
  // API가 year/month 단위로만 조회 가능해서, 이 값이 바뀔 때마다 다시 불러와야 함
  const [displayedMonth, setDisplayedMonth] = useState(() => {
    const saved = sessionStorage.getItem("calendarDisplayedMonth");
    return saved ? dayjs(saved).startOf("month") : dayjs().startOf("month");
  });

  useEffect(() => {
    sessionStorage.setItem("calendarDisplayedMonth", displayedMonth.format("YYYY-MM-DD"));
  }, [displayedMonth]);

  // 캘린더 단계 구간 + 분석 완료 날짜. API 응답 오기 전엔 빈 값
  const [calendarData, setCalendarData] = useState({ cycleResponses: [], analyses: [] });

  useEffect(() => {
    getCycleCalendar(displayedMonth.year(), displayedMonth.month() + 1)
      .then(setCalendarData)
      .catch((error) => {
        console.error("캘린더 조회 실패:", error);
      });
  }, [displayedMonth]);

  const analysisDates = calendarData.analyses.map((a) => a.date);

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
          name={profile?.name ?? ""}
          skinType={profile?.skinType ?? ""}
          skinConcerns={profile?.selectedSkinConcerns ?? []}
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
          cycleResponses={calendarData.cycleResponses}
          analysisDates={analysisDates}
          displayedMonth={displayedMonth}
          onMonthChange={setDisplayedMonth}
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

        {phaseComment && (
          <PhaseGuideBanner
            title={PHASE_BANNER_TITLE[currentPhase]}
            description={phaseComment.comment}
          />
        )}

        {routineData && (
          <RoutineSection
            phaseLabel={PHASE_LABEL[routineData.phaseType]}
            routines={routines}
          />
        )}

        {modalStep === "dateAction" && (
          <ActionListModal
            title={dayjs(selectedDate).format("M월 D일")}
            onClose={closeModal}
            options={[
              { label: "생리 정보 수정", onClick: handleSelectPeriodInfo },
              ...(analysisDates.includes(selectedDate)
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