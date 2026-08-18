import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import styled from "styled-components";
import Header from "../../components/todaySkin/Header";
import PhotoUploadBox from "../../components/todaySkin/PhotoUploadBox";
import RecordForm from "../../components/todaySkin/RecordForm";
import SaveButton from "../../components/todaySkin/SaveButton";
import MakeupCheckModal from "../../components/todaySkin/MakeupCheckModal";
import MakeupRetryModal from "../../components/todaySkin/MakeupRetryModal";
import AnalyzingLoader from "../../components/todaySkin/AnalyzingLoader";
import Toast from "../../components/common/Toast";
import {
  loadCapturedPhotos,
  saveCapturedPhotos,
  clearCapturedPhotos,
} from "../../utils/photoSessionStorage";
import {
  uploadAnalysisImages,
  postDailyAnalysis,
  getDailyAnalysis,
} from "../../api/analysisApi";

// 식사/피부상태 한글 표시값 → API가 원하는 영문 코드 매핑
const MEAL_CODE_BY_LABEL = {
  유제품: "DAIRY",
  과일: "FRUIT",
  "매운 음식": "SPICY_FOOD",
  카페인: "CAFFEINE",
  고지방: "HIGH_FAT",
  당분: "SUGAR",
  탄산음료: "SODA",
  음주: "ALCOHOL",
};

const SKIN_STATUS_CODE_BY_LABEL = {
  건조: "DRY",
  번들거림: "OILY",
  트러블: "TROUBLE",
  칙칙함: "DULL",
};

const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 24px;
`;

const SectionLabel = styled.h2`
  margin: 0;
  margin-top: ${({ $marginTop }) => $marginTop}px;
  margin-bottom: 8px;
  color: #000;
  font-family: "Pretendard Variable";
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const SubmitButtonWrapper = styled.div`
  margin-top: 20px;
`;

export default function TodaySkinForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const todayDate = dayjs().format("YYYY-MM-DD");
  const skipTodayCheck = Boolean(location.state?.skipTodayCheck);

  const [isCheckingTodayRecord, setIsCheckingTodayRecord] =
    useState(!skipTodayCheck);

  // sessionStorage를 진짜 기준으로 삼음
  // location.state에 의존하면 브라우저 뒤로가기 시 삭제 전 목록이 되살아나는 문제가 있어서 아예 그쪽에 안 기대는 방식으로 변경
  const [capturedPhotos, setCapturedPhotos] = useState(() =>
    loadCapturedPhotos(),
  );

  useEffect(() => {
    saveCapturedPhotos(capturedPhotos);
  }, [capturedPhotos]);

  useEffect(() => {
    if (skipTodayCheck) {
      setIsCheckingTodayRecord(false);
      return;
    }

    getDailyAnalysis(todayDate)
      .then(() => {
        navigate(`/today-skin/result/${todayDate}`, {
          replace: true,
        });
      })
      .catch((error) => {
        const errorCode = error.response?.data?.code;

        if (errorCode === "ANALYSIS_404" || error.response?.status === 404) {
          setIsCheckingTodayRecord(false);
          return;
        }

        console.error("오늘 피부 기록 확인 실패:", error);
        setIsCheckingTodayRecord(false);
      });
  }, [navigate, skipTodayCheck, todayDate]);

  const hasFrontPhoto = capturedPhotos.some((photo) => photo.angle === "front");

  // RecordForm이 관리하던 생활습관 값들 여기로 끌어올림
  // "분석하기"에서 값들을 API로 보내야 해서 부모가 갖고 있어야 함
  const [stepperValues, setStepperValues] = useState({
    sleep: null,
    water: null,
    exercise: null,
  });
  const [meals, setMeals] = useState([]);
  const [skinStatus, setSkinStatus] = useState(null);

  const [modalStep, setModalStep] = useState(null); // null | "check" | "retry"
  const [step, setStep] = useState("form"); // "form" | "analyzing"
  const [toastMessage, setToastMessage] = useState(null);

  const closeModal = () => setModalStep(null);

  const handleNoMakeup = () => {
    closeModal();
    navigate("/today-skin/camera");
  };

  // 사진이 하나도 없을 때(첫 촬영)만 메이크업 확인 모달을 띄우고,
  // 이미 사진이 있는 상태(+ 버튼으로 추가 촬영)에서는 바로 카메라로 이동
  const handleAddPhotoClick = () => {
    if (capturedPhotos.length === 0) {
      setModalStep("check");
    } else {
      navigate("/today-skin/camera");
    }
  };

  const handleDeletePhoto = (index) => {
    setCapturedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    setStep("analyzing");

    try {
      // 사진들을 먼저 업로드해서 URL을 받아오고 + 생활습관 값들을 합쳐서 분석 요청
      const uploaded = await uploadAnalysisImages(capturedPhotos);
      const payload = {
        sleepTime: stepperValues.sleep, // null일 수도 있음
        waterIntake: stepperValues.water,
        exerciseTime:
          stepperValues.exercise !== null
            ? Math.round(stepperValues.exercise * 60)
            : null,
        dietType: meals.map((meal) => MEAL_CODE_BY_LABEL[meal]),
        skinStatus: skinStatus ? SKIN_STATUS_CODE_BY_LABEL[skinStatus] : null,
        imageUrl: uploaded.imageUrl,
        leftImageUrl: uploaded.leftImageUrl,
        rightImageUrl: uploaded.rightImageUrl,
      };

      const todayDate = dayjs().format("YYYY-MM-DD");
      await postDailyAnalysis(todayDate, payload);

      clearCapturedPhotos(); // 이번 기록 세션 종료, 다음엔 빈 상태로 새로 시작
      navigate(`/today-skin/result/${todayDate}`);
    } catch (error) {
      console.error("분석 요청 실패:", error);
      const serverMessage = error.response?.data?.message;
      setToastMessage(
        serverMessage || "분석 요청에 실패했어요. 다시 시도해주세요",
      );
      setStep("form");
    }
  };

  if (isCheckingTodayRecord) {
    return (
      <div>
        <Header />
      </div>
    );
  }

  if (step === "analyzing") {
    return (
      <div>
        <Header />
        <AnalyzingLoader />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <Content>
        <SectionLabel $marginTop={10}>1. 피부 사진</SectionLabel>
        <PhotoUploadBox
          photos={capturedPhotos}
          onAddClick={handleAddPhotoClick}
          onDeletePhoto={handleDeletePhoto}
        />

        <SectionLabel $marginTop={24}>2. 생활 습관</SectionLabel>
        <RecordForm
          stepperValues={stepperValues}
          onStepperValuesChange={setStepperValues}
          meals={meals}
          onMealsChange={setMeals}
          skinStatus={skinStatus}
          onSkinStatusChange={setSkinStatus}
        />

        <SubmitButtonWrapper>
          <SaveButton
            label="분석하기"
            disabled={!hasFrontPhoto}
            onClick={handleAnalyze}
          />
        </SubmitButtonWrapper>
      </Content>

      {modalStep === "check" && (
        <MakeupCheckModal
          onNoMakeup={handleNoMakeup}
          onHasMakeup={() => setModalStep("retry")}
          onClose={closeModal}
        />
      )}

      {modalStep === "retry" && <MakeupRetryModal onClose={closeModal} />}

      {toastMessage && (
        <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
      )}
    </div>
  );
}
