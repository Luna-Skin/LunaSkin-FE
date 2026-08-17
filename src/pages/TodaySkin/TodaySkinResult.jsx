import { useEffect, useState } from "react";
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
import PointsRewardModal from "../../components/todaySkin/PointsRewardModal";
import {
  getDailyAnalysis,
  getRecommendedProducts,
} from "../../api/analysisApi";
import { PHASE_LABEL } from "../../utils/cyclePhase";
import { hasClaimedToday, claimDailyPoints } from "../../utils/pointsStorage";

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

// API가 준 정면/왼쪽/오른쪽 URL을, 사진 보기 모달이 쓰는 { url, angle } 배열로 변환
// 왼쪽/오른쪽은 선택 촬영이라 없을 수도 있어서, 값이 있는 것만 포함함
function buildPhotos(analysis) {
  const photos = [];
  if (analysis.imageUrl)
    photos.push({ url: analysis.imageUrl, angle: "front" });
  if (analysis.leftImageUrl)
    photos.push({ url: analysis.leftImageUrl, angle: "left" });
  if (analysis.rightImageUrl)
    photos.push({ url: analysis.rightImageUrl, angle: "right" });
  return photos;
}

export default function TodaySkinResult() {
  const { date } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // 해당 날짜 분석 기록. API 응답 오기 전엔 null
  const [analysis, setAnalysis] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    getDailyAnalysis(date)
      .then(setAnalysis)
      .catch((error) => {
        console.error("피부 분석 기록 조회 실패:", error);
        setLoadError(true);
      });
  }, [date]);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    getRecommendedProducts(date)
      .then((list) => {
        setProducts(
          list.map((p) => ({
            id: p.productId,
            name: p.prodName,
            tag: p.ingredient,
            url: p.purchaseUrl,
          })),
        );
      })
      .catch((error) => {
        console.error("제품 추천 조회 실패:", error);
      });
  }, [date]);

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

  // TODO: 기록 삭제 API가 확인되면 여기서 실제 삭제 호출 필요 (지금은 그냥 카메라로 이동만 함)
  const handleConfirmRecapture = () => {
    navigate("/today-skin/camera");
  };

  if (loadError) {
    return (
      <div>
        <Header {...headerProps} />
        <Content>해당 날짜의 기록을 찾을 수 없어요.</Content>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div>
        <Header {...headerProps} />
      </div>
    );
  }

  const photos = buildPhotos(analysis);

  // API 필드명 SkinMetricsCard가 쓰는 이름으로 변환
  const metrics = {
    trouble: analysis.detailedMetrics.trouble,
    oil: analysis.detailedMetrics.sebum,
    dullness: analysis.detailedMetrics.dullness,
    hydration: analysis.detailedMetrics.moisture,
    elasticity: analysis.detailedMetrics.elasticity,
  };

  return (
    <div>
      <Header {...headerProps} />
      <Content>
        <SkinScoreSummary
          date={date}
          phaseLabel={PHASE_LABEL[analysis.cyclePhase] ?? null}
          score={analysis.overallScore}
          statusText={`피부 상태 ${analysis.skinStatus}`}
          statusSummary={analysis.phaseComment}
          onPhotoClick={() =>
            photos.length > 0
              ? setPhotoModalOpen(true)
              : alert("저장된 사진이 없어요")
          }
          onAskClick={() => navigate("/chat")}
          onCompareClick={() => navigate(`/today-skin/compare/${date}`)}
        />
        <SkinMetricsCard metrics={metrics} />
        <AiInsightBox insight={analysis.aiComment} />
        <ProductRecommendSection products={products} />

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
