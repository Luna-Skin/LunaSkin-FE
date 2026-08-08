import { useState } from "react";
import styled from "styled-components";
import Header from "../../components/todaySkin/Header";
import PhotoUploadBox from "../../components/todaySkin/PhotoUploadBox";
import RecordForm from "../../components/todaySkin/RecordForm";
import SaveButton from "../../components/todaySkin/SaveButton";

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

  const handlePhotoBoxClick = () => {
    // TODO: 카메라 페이지(TodaySkinCamera) 구현되면 navigate("/today-skin/camera")로 교체
    setPhotoTaken((prev) => !prev);
  };

  const handleAnalyze = () => {
    alert("분석 시작!");
  };

  return (
    <div>
      <Header />
      <Content>
        <SectionLabel $marginTop={10}>1. 피부 사진</SectionLabel>
        <PhotoUploadBox photoTaken={photoTaken} onClick={handlePhotoBoxClick} />

        <SectionLabel $marginTop={24}>2. 기록하기</SectionLabel>
        <RecordForm />

        <SubmitButtonWrapper>
          <SaveButton
            label="분석하기"
            disabled={!photoTaken}
            onClick={handleAnalyze}
          />
        </SubmitButtonWrapper>
      </Content>
    </div>
  );
}
