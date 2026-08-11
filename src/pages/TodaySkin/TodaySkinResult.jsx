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

  // 아직 실제 분석 API가 없어서, 점수·지표·인사이트는 mock 데이터를 그대로 사용
  const record = MOCK_SKIN_RECORDS[date];

  // 사진은 방금 촬영한 사진(분석 흐름에서 넘어온 경우)이 있으면 그걸 우선 쓰고,
  // 없으면 mock에 저장된 사진을 사용
  const photo = location.state?.capturedPhoto ?? record?.photoUrl ?? null;

  const [photoModalOpen, setPhotoModalOpen] = useState(false);

  if (!record) {
    return (
      <div>
        <Header />
        <Content>해당 날짜의 기록을 찾을 수 없어요.</Content>
      </div>
    );
  }

  return (
    <div>
      <Header />
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