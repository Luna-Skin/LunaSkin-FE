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
import { hasClaimedToday, claimDailyPoints } from "../../utils/pointsStorage";
import PointsRewardModal from "../../components/todaySkin/PointsRewardModal";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px 24px 24px;
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
  // 방금 분석 완료하고 들어온 경우: capturedPhotos(여러 장) 그대로 사용
  // 예전 기록을 보러 들어온 경우(홈 캘린더 등): mock 데이터엔 정면 사진 한 장만 있음
  const photos =
    location.state?.capturedPhotos ??
    (record?.photoUrl ? [{ url: record.photoUrl, angle: "front" }] : []);
  const phase = getPhaseForDate(date, MOCK_PERIOD_CYCLES);

  // "결과를 확인하러 들어온" 경우(홈 캘린더, 오늘 상태 카드)엔 뒤로가기 헤더로 표시
  const showBackHeader = Boolean(location.state?.showBackHeader);
  const headerProps = showBackHeader
    ? { variant: "back", title: "투데이스킨 기록", onBack: () => navigate("/") }
    : {};

  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [reanalyzeStep, setReanalyzeStep] = useState(null); // null | "confirm1" | "confirm2"
  const [pointsRewardOpen, setPointsRewardOpen] = useState(false);
  const [pointsClaimed, setPointsClaimed] = useState(() => hasClaimedToday());

  const closeReanalyzeFlow = () => setReanalyzeStep(null);

  const handleCloseRewardModal = () => {
    setPointsRewardOpen(false);
    claimDailyPoints(50);
    setPointsClaimed(true);
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
          onPhotoClick={() =>
            photos.length > 0
              ? setPhotoModalOpen(true)
              : alert("저장된 사진이 없어요")
          }
          onAskClick={() => navigate("/chat")}
          onCompareClick={() => navigate(`/today-skin/compare/${date}`)}
        />
        <SkinMetricsCard metrics={record.metrics} />
        <AiInsightBox insight={record.aiInsight} />
        <ProductRecommendSection products={record.recommendedProducts} />

        <BottomButtonRow>
          <PointsRewardButton
            claimed={pointsClaimed}
            onClick={() => setPointsRewardOpen(true)}
          />
          <ReanalyzeButton onClick={() => setReanalyzeStep("confirm1")} />
        </BottomButtonRow>
      </Content>

      {photoModalOpen && (
        <TodaySkinPhotoModal
          photos={photos}
          onClose={() => setPhotoModalOpen(false)}
        />
      )}

      {pointsRewardOpen && (
        <PointsRewardModal points={50} onClose={handleCloseRewardModal} />
      )}

      {reanalyzeStep === "confirm1" && (
        <ConfirmModal
          message="현재 기록을 지우고 다시 분석할까요?"
          options={[
            { label: "아니요", variant: "light", onClick: closeReanalyzeFlow },
            {
              label: "네",
              variant: "dark",
              onClick: () => setReanalyzeStep("confirm2"),
            },
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
            {
              label: "뒤로가기",
              variant: "light",
              onClick: () => setReanalyzeStep("confirm1"),
            },
            {
              label: "촬영하기",
              variant: "dark",
              onClick: handleConfirmRecapture,
            },
          ]}
          onClose={closeReanalyzeFlow}
        />
      )}
    </div>
  );
}
