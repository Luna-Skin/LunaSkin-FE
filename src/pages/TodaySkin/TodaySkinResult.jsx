import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import Header from "../../components/todaySkin/Header";
import SkinScoreSummary from "../../components/todaySkin/SkinScoreSummary";
import SkinMetricsCard from "../../components/todaySkin/SkinMetricsCard";
import AiInsightBox from "../../components/todaySkin/AiInsightBox";
import TodaySkinPhotoModal from "../../components/todaySkin/TodaySkinPhotoModal";
import ReanalyzeButton from "../../components/todaySkin/ReanalyzeButton";
import PointsRewardButton from "../../components/todaySkin/PointsRewardButton";
import ProductRecommendSection from "../../components/todaySkin/ProductRecommendSection";
import ConfirmModal from "../../components/common/ConfirmModal";
import { MOCK_SKIN_RECORDS, MOCK_PERIOD_CYCLES } from "../../mocks/homeMock";
import { getPhaseForDate, PHASE_LABEL } from "../../utils/cyclePhase";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 24px 24px 40px;
`;

const BottomButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export default function TodaySkinResult() {
  const { date } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const record = MOCK_SKIN_RECORDS[date];
  const photo = location.state?.capturedPhoto ?? record?.photoUrl ?? null;
  const phase = getPhaseForDate(date, MOCK_PERIOD_CYCLES);

  // "결과를 확인하러 들어온" 경우(홈 캘린더, 오늘 상태 카드)엔 뒤로가기 헤더로 표시
  const showBackHeader = Boolean(location.state?.showBackHeader);
  const headerProps = showBackHeader
    ? { variant: "back", title: "투데이스킨 기록", onBack: () => navigate("/") }
    : {};

  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [reanalyzeStep, setReanalyzeStep] = useState(null); // null | "confirm1" | "confirm2"
  const [pointsRewardOpen, setPointsRewardOpen] = useState(false);
  const [pointsClaimed, setPointsClaimed] = useState(false);

  const closeReanalyzeFlow = () => setReanalyzeStep(null);

  const handleCloseRewardModal = () => {
    setPointsRewardOpen(false);
    setPointsClaimed(true);
    // TODO: 실제 MOCK_USER.points 반영은 API 연동 이슈에서 진행 (지금은 mock이 고정값이라 반영 안 됨)
  };

  // TODO: 실제 기록 삭제는 MOCK_SKIN_RECORDS를 상태로 관리하게 되면 연결 (지금은 콘솔 로그만)
  const handleConfirmRecapture = () => {
    console.log(`${date} 기록 삭제 (mock 데이터라 실제로는 반영 안 됨)`);
    navigate("/today-skin/camera");
  };

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
          phaseLabel={phase ? PHASE_LABEL[phase] : null}
          score={record.score}
          statusText={record.statusText}
          statusSummary={record.statusSummary}
          onPhotoClick={() => (photo ? setPhotoModalOpen(true) : alert("저장된 사진이 없어요"))}
          onAskClick={() => navigate("/chat")}
          onCompareClick={() => alert("기록 비교 화면은 별도 이슈에서 구현 예정")}
        />
        <SkinMetricsCard metrics={record.metrics} />
        <AiInsightBox insight={record.aiInsight} />
        <ProductRecommendSection products={record.recommendedProducts} />

        <BottomButtonRow>
          <PointsRewardButton claimed={pointsClaimed} onClick={() => setPointsRewardOpen(true)} />
          <ReanalyzeButton onClick={() => setReanalyzeStep("confirm1")} />
        </BottomButtonRow>
      </Content>

      {photoModalOpen && (
        <TodaySkinPhotoModal photo={photo} onClose={() => setPhotoModalOpen(false)} />
      )}

      {pointsRewardOpen && (
        <ConfirmModal
          message="50P를 받았어요!"
          options={[{ label: "닫기", variant: "dark", onClick: handleCloseRewardModal }]}
          onClose={handleCloseRewardModal}
        />
      )}

      {reanalyzeStep === "confirm1" && (
        <ConfirmModal
          message="현재 기록을 지우고 다시 분석할까요?"
          options={[
            { label: "아니요", variant: "light", onClick: closeReanalyzeFlow },
            { label: "네", variant: "dark", onClick: () => setReanalyzeStep("confirm2") },
          ]}
          onClose={closeReanalyzeFlow}
        />
      )}

      {reanalyzeStep === "confirm2" && (
        <ConfirmModal
          message={
            <>
              지워진 기록은 복구할 수 없어요.
              <br />
              정말 다시 촬영하러 갈까요?
            </>
          }
          options={[
            { label: "뒤로가기", variant: "light", onClick: () => setReanalyzeStep("confirm1") },
            { label: "촬영하기", variant: "dark", onClick: handleConfirmRecapture },
          ]}
          onClose={closeReanalyzeFlow}
        />
      )}
    </div>
  );
}