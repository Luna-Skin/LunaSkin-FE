// pages/TodaySkin/TodaySkinForm.jsx (확인용 - 정식 연결 전 임시)
import { useState } from "react";
import styled from "styled-components";
import Header from "../../components/todaySkin/Header";
import PhotoUploadBox from "../../components/todaySkin/PhotoUploadBox";
import RecordForm from "../../components/todaySkin/RecordForm";
import SaveButton from "../../components/todaySkin/SaveButton";
import MakeupCheckModal from "../../components/todaySkin/MakeupCheckModal";
import MakeupRetryModal from "../../components/todaySkin/MakeupRetryModal";

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
  const [photoTaken, setPhotoTaken] = useState(false);
  const [modalStep, setModalStep] = useState(null); // 확인용 임시: null | "check" | "retry"

  return (
    <div>
      <Header />
      <Content>
        <SectionLabel $marginTop={10}>1. 피부 사진</SectionLabel>
        <PhotoUploadBox photoTaken={photoTaken} onClick={() => setModalStep("check")} />

        <SectionLabel $marginTop={24}>2. 기록하기</SectionLabel>
        <RecordForm />

        <SubmitButtonWrapper>
          <SaveButton label="분석하기" disabled={!photoTaken} onClick={() => alert("분석 시작!")} />
        </SubmitButtonWrapper>
      </Content>

      {modalStep === "check" && (
        <MakeupCheckModal
          onNoMakeup={() => alert("카메라로 이동 (다음 단계에서 연결)")}
          onHasMakeup={() => setModalStep("retry")}
          onClose={() => setModalStep(null)}
        />
      )}

      {modalStep === "retry" && <MakeupRetryModal onClose={() => setModalStep(null)} />}
    </div>
  );
}