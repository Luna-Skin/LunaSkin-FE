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

  const capturedPhoto = location.state?.capturedPhoto ?? null;
  const photoTaken = Boolean(capturedPhoto);

  const [modalStep, setModalStep] = useState(null); // null | "check" | "retry"
  const [step, setStep] = useState("form"); // "form" | "analyzing"

  useEffect(() => {
    if (step !== "analyzing") return undefined;

    const timer = setTimeout(() => {
      navigate(`/today-skin/result/${MOCK_RESULT_DATE}`, {
        state: { capturedPhoto },
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [step, navigate, capturedPhoto]);

  const closeModal = () => setModalStep(null);

  const handleNoMakeup = () => {
    closeModal();
    navigate("/today-skin/camera");
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
        <PhotoUploadBox photoTaken={photoTaken} onClick={() => setModalStep("check")} />

        <SectionLabel $marginTop={24}>2. 기록하기</SectionLabel>
        <RecordForm />

        <SubmitButtonWrapper>
          <SaveButton label="분석하기" disabled={!photoTaken} onClick={handleAnalyze} />
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