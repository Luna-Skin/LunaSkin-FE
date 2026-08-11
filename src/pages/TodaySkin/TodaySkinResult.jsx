import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import Header from "../../components/todaySkin/Header";
import SkinScoreSummary from "../../components/todaySkin/SkinScoreSummary";
import SkinMetricsCard from "../../components/todaySkin/SkinMetricsCard";
import AiInsightBox from "../../components/todaySkin/AiInsightBox";
import TodaySkinPhotoModal from "../../components/todaySkin/TodaySkinPhotoModal";
import { MOCK_SKIN_RECORDS } from "../../mocks/homeMock";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 24px 24px 40px;
`;

export default function TodaySkinResult() {
  const { date } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const record = MOCK_SKIN_RECORDS[date];
  const photo = location.state?.capturedPhoto ?? record?.photoUrl ?? null;

  // 홈 캘린더에서 "피부 정보 보기"로 들어온 경우엔 뒤로가기 헤더로 표시
  const fromCalendar = Boolean(location.state?.fromCalendar);
  const headerProps = fromCalendar
    ? { variant: "back", title: "투데이스킨 기록", onBack: () => navigate("/") }
    : {};

  const [photoModalOpen, setPhotoModalOpen] = useState(false);

  if (!record) {
    return (
      <div>
        <Header {...headerProps} />
        <Content>해당 날짜의 기록을 찾을 수 없어요.</Content>
      </div>
    );
  }

  return (
    <div>
      <Header {...headerProps} />
      <Content>
        <SkinScoreSummary
          date={date}
          score={record.score}
          statusText={record.statusText}
          statusSummary={record.statusSummary}
          onPhotoClick={() => (photo ? setPhotoModalOpen(true) : alert("저장된 사진이 없어요"))}
          onAskClick={() => navigate("/chat")}
        />
        <SkinMetricsCard metrics={record.metrics} />
        <AiInsightBox insight={record.aiInsight} />
      </Content>

      {photoModalOpen && (
        <TodaySkinPhotoModal photo={photo} onClose={() => setPhotoModalOpen(false)} />
      )}
    </div>
  );
}