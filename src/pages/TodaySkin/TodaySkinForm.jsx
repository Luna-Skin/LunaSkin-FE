import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/todaySkin/Header";
import PhotoUploadBox from "../../components/todaySkin/PhotoUploadBox";
import RecordForm from "../../components/todaySkin/RecordForm";
import SaveButton from "../../components/todaySkin/SaveButton";
import MakeupCheckModal from "../../components/todaySkin/MakeupCheckModal";
import MakeupRetryModal from "../../components/todaySkin/MakeupRetryModal";
import AnalyzingLoader from "../../components/todaySkin/AnalyzingLoader";

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

  const closeModal = () => setModalStep(null);

  const handleNoMakeup = () => {
    closeModal();
    navigate("/today-skin/camera");
  };

  const handleAnalyze = () => {
    setStep("analyzing");
    // TODO: 분석 끝나고 결과 화면으로 이동하는 부분은 다음 to-do에서 구현
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