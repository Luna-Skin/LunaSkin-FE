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
import {
  getCycleCalendar,
  getCyclePhaseComment,
  postCycleStart,
  postCycleEnd,
} from "../../api/cycleApi";
import { getTodayRoutine } from "../../api/routineApi";
import { getTodayAnalysisSummary } from "../../api/analysisApi";
import { PHASE_LABEL } from "../../utils/cyclePhase";

import skinStatusUnknownIcon from "../../assets/icons/skin_status_unknown.svg";
import skinStatusBadIcon from "../../assets/icons/skin_status_bad.png";
import skinStatusNormalIcon from "../../assets/icons/skin_status_normal.png";
import skinStatusGoodIcon from "../../assets/icons/skin_status_good.png";
import serumIcon from "../../assets/icons/routine_serum.svg";
import waterGlassIcon from "../../assets/icons/routine_water_glass.svg";
import sneakerIcon from "../../assets/icons/routine_sneaker.svg";
import { getPoints } from "../../utils/pointsStorage";

// PhaseGuideBanner 제목 전용 문구. PHASE_LABEL(생리기/난포기/...)은 RoutineSection 등
// 다른 곳에서도 쓰이니까 utils에 남겨두고, 이건 이 화면에서만 쓰는 값이라 여기 둠
const PHASE_BANNER_TITLE = {
  MENSTRUATION: "피부 주의 구간",
  FOLLICULAR: "피부 회복 구간",
  OVULATION: "피부 컨디션 최상 구간",
  LUTEAL: "피부 관리 필요 구간",
};

// API가 routineCategory(SKINCARE/ACTION/EXERCISE)로 주는 걸, 카드 제목/아이콘으로 매핑
const ROUTINE_CATEGORY_META = {
  SKINCARE: { title: "오늘의 스킨케어", icon: serumIcon },
  ACTION: { title: "오늘의 행동", icon: waterGlassIcon },
  EXERCISE: { title: "오늘의 운동", icon: sneakerIcon },
};

// 매핑에 없는 카테고리가 오면(백엔드가 나중에 종류를 추가하는 경우 등) 이걸로 대체 —
// icon/title이 undefined로 남아서 깨진 이미지·빈 텍스트가 뜨는 걸 방지
const DEFAULT_ROUTINE_META = { title: "오늘의 루틴", icon: serumIcon };

// API가 주는 skinStatus 문자열로 아이콘 매핑
// 오늘 기록이 아직 없으면 TODAY_STATUS_UNKNOWN을 그대로 사용
const TODAY_STATUS_ICON = {
  나쁨: skinStatusBadIcon,
  보통: skinStatusNormalIcon,
  좋음: skinStatusGoodIcon,
};

const TODAY_STATUS_UNKNOWN = {
  icon: skinStatusUnknownIcon,
  label: "모름",
  description: (
    <>
      아직 오늘의 피부 기록이 없어요.
      <br />
      피부를 촬영하고 상태를 확인해보세요!
    </>
  ),
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

  useEffect(() => {
    sessionStorage.removeItem("todaySkin:lifestyleDraft");
  }, []);

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

  // 오늘의 추천 루틴. API 응답 오기 전엔 빈 배열
  const [routineData, setRoutineData] = useState(null);

  useEffect(() => {
    getTodayRoutine()
      .then(setRoutineData)
      .catch((error) => {
        console.error("오늘의 루틴 조회 실패:", error);
      });
  }, []);

  const routines = (routineData?.routines ?? []).map((routine, index) => {
    const meta =
      ROUTINE_CATEGORY_META[routine.routineCategory] ?? DEFAULT_ROUTINE_META;
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
    sessionStorage.setItem(
      "calendarDisplayedMonth",
      displayedMonth.format("YYYY-MM-DD"),
    );
  }, [displayedMonth]);

  // 캘린더 단계 구간 + 분석 완료 날짜. API 응답 오기 전엔 빈 값
  const [calendarData, setCalendarData] = useState({
    cycleResponses: [],
    analyses: [],
  });

  useEffect(() => {
    getCycleCalendar(displayedMonth.year(), displayedMonth.month() + 1)
      .then(setCalendarData)
      .catch((error) => {
        console.error("캘린더 조회 실패:", error);
      });
  }, [displayedMonth]);

  const analysisDates = calendarData.analyses.map((a) => a.date);

  const [selectedDate, setSelectedDate] = useState(null);
  const [modalStep, setModalStep] = useState(null); // "dateAction" | "periodAction" | null

  // 홈 캘린더에서 바로 생리 시작일/종료일을 고르는 중인지 관리
  const [periodSelectMode, setPeriodSelectMode] = useState(null); // "start" | "end" | null
  const [periodSelectedDate, setPeriodSelectedDate] = useState(null);

  // start/end POST 요청 도중 확인 버튼 중복 클릭 방지용
  const [isSaving, setIsSaving] = useState(false);

  const [toastMessage, setToastMessage] = useState(null);

  const [todaySummary, setTodaySummary] = useState(null);

  useEffect(() => {
    getTodayAnalysisSummary()
      .then((data) => {
        if (data?.skinStatus && data.skinStatus !== "모름") {
          setTodaySummary(data);
        }
      })
      .catch(() => {
        // 혹시 모를 다른 실패 상황도 안전하게 "모름"으로 취급..
        setTodaySummary(null);
      });
  }, []);

  const todayStatusContent = todaySummary
    ? {
        icon:
          TODAY_STATUS_ICON[todaySummary.skinStatus] ??
          TODAY_STATUS_UNKNOWN.icon,
        label: todaySummary.skinStatus,
        description: todaySummary.aiComment,
      }
    : TODAY_STATUS_UNKNOWN;

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
    setPeriodSelectMode("end");
    setPeriodSelectedDate(targetDate);
  };

  const handleCancelPeriodSelect = () => {
    setPeriodSelectMode(null);
    setPeriodSelectedDate(null);
  };

  const handleConfirmPeriodSelect = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      if (periodSelectMode === "start") {
        await postCycleStart(periodSelectedDate);
      } else {
        await postCycleEnd(periodSelectedDate);
      }
    } catch (error) {
      console.error("생리 정보 저장 실패:", error);
      const serverMessage = error.response?.data?.message;
      setToastMessage(serverMessage || "저장에 실패했어요. 다시 시도해주세요");
      setIsSaving(false);
      return;
    }

    // 저장 자체는 성공했으니, 화면 반영 결과와 상관없이 선택 모드부터 먼저 종료
    setPeriodSelectMode(null);
    setPeriodSelectedDate(null);

    // 캘린더/코멘트/루틴은 각각 따로 반영 — 하나(특히 루틴)가 실패해도
    // 나머지는 정상적으로 최신 상태로 갱신되도록 allSettled 사용
    const [calendarResult, commentResult, routineResult] =
      await Promise.allSettled([
        getCycleCalendar(displayedMonth.year(), displayedMonth.month() + 1),
        getCyclePhaseComment(),
        getTodayRoutine(),
      ]);

    if (calendarResult.status === "fulfilled") {
      setCalendarData(calendarResult.value);
    } else {
      console.error("캘린더 재조회 실패:", calendarResult.reason);
    }

    if (commentResult.status === "fulfilled") {
      setPhaseComment(commentResult.value);
    } else {
      console.error("주기 단계 코멘트 재조회 실패:", commentResult.reason);
    }

    if (routineResult.status === "fulfilled") {
      setRoutineData(routineResult.value);
    } else {
      console.error("루틴 재조회 실패:", routineResult.reason);
    }

    setIsSaving(false);
  };

  const handleViewTodayStatus = () => {
    if (!todaySummary) {
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
            disabled={!periodSelectedDate || isSaving}
            onClick={handleConfirmPeriodSelect}
          >
            확인
          </ConfirmButton>
        )}

        <SectionLabel>오늘의 피부 상태</SectionLabel>

        <TodaySkinStatusCard
          icon={todayStatusContent.icon}
          label={todayStatusContent.label}
          description={todayStatusContent.description}
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
