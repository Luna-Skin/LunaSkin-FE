import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/todaySkin/Header";
import PhotoUploadBox from "../../components/todaySkin/PhotoUploadBox";
import RecordForm from "../../components/todaySkin/RecordForm";
import SaveButton from "../../components/todaySkin/SaveButton";
import MakeupCheckModal from "../../components/todaySkin/MakeupCheckModal";
import MakeupRetryModal from "../../components/todaySkin/MakeupRetryModal";
import AnalyzingLoader from "../../components/todaySkin/AnalyzingLoader";

// 아직 실제 분석 API가 없어서, 임시로 mocks/homeMock.js에 있는 이 날짜의 데이터를
// "방금 분석된 결과"인 것처럼 사용함 (API 연동되면 이 상수는 지우고 실제 응답 사용)
const MOCK_RESULT_DATE = "2026-08-06";

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

  // 카메라에서 돌아올 때 location.state로 최신 사진 배열을 넘겨받음.
  // 삭제 기능 때문에 이 목록 자체를 바꿀 수 있어야 해서, 그냥 읽기만 하지 않고
  // 실제 state로 관리함 (처음 마운트될 때 한 번만 location.state에서 초기값을 가져옴)
  const [capturedPhotos, setCapturedPhotos] = useState(() => location.state?.photos ?? []);

  const hasFrontPhoto = capturedPhotos.some((photo) => photo.angle === "front");

  const [modalStep, setModalStep] = useState(null); // null | "check" | "retry"
  const [step, setStep] = useState("form"); // "form" | "analyzing"

  useEffect(() => {
    if (step !== "analyzing") return undefined;

    const timer = setTimeout(() => {
      navigate(`/today-skin/result/${MOCK_RESULT_DATE}`, {
        state: { capturedPhotos },
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [step, navigate, capturedPhotos]);

  const closeModal = () => setModalStep(null);

  const handleNoMakeup = () => {
    closeModal();
    navigate("/today-skin/camera", { state: { photos: capturedPhotos } });
  };

  // 사진이 하나도 없을 때(첫 촬영)만 메이크업 확인 모달을 띄우고,
  // 이미 사진이 있는 상태(+ 버튼으로 추가 촬영)에서는 바로 카메라로 이동
  const handleAddPhotoClick = () => {
    if (capturedPhotos.length === 0) {
      setModalStep("check");
    } else {
      navigate("/today-skin/camera", { state: { photos: capturedPhotos } });
    }
  };

  const handleDeletePhoto = (index) => {
    setCapturedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = () => {
    setStep("analyzing");
  };

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
        <RecordForm />

        <SubmitButtonWrapper>
          <SaveButton label="분석하기" disabled={!hasFrontPhoto} onClick={handleAnalyze} />
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
    </div>
  );
}