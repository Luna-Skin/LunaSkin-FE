import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, } from "react-router-dom";
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

import { getDailyAnalysis, getRecommendedProducts, } from "../../api/analysisApi";
import { useChatContext } from "../../components/chat/ChatContext";
import { PHASE_LABEL } from "../../utils/cyclePhase";
import { hasClaimedToday, claimDailyPoints, } from "../../utils/pointsStorage";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  padding: 24px 24px;
`;

const BottomButtonRow = styled.div`
  display: flex;
  align-items: center;

  gap: 12px;
`;

function buildPhotos(analysis) {
  const photos = [];

  if (analysis.imageUrl) {
    photos.push({
      url: analysis.imageUrl,
      angle: "front",
    });
  }

  if (analysis.leftImageUrl) {
    photos.push({
      url: analysis.leftImageUrl,
      angle: "left",
    });
  }

  if (analysis.rightImageUrl) {
    photos.push({
      url: analysis.rightImageUrl,
      angle: "right",
    });
  }

  return photos;
}

export default function TodaySkinResult() {
  const { date } = useParams();

  const location = useLocation();
  const navigate = useNavigate();

  const {
    createChat,
  } = useChatContext();

  const [analysis, setAnalysis] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [products, setProducts] = useState([]);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [reanalyzeStep, setReanalyzeStep] = useState(null);
  const [pointsRewardOpen, setPointsRewardOpen] = useState(false);
  const [pointsClaimed, setPointsClaimed] = useState(() =>
    hasClaimedToday(),
  );
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  useEffect(() => {
    setAnalysis(null);
    setLoadError(false);

    getDailyAnalysis(date)
      .then(setAnalysis)
      .catch((error) => {
        console.error(
          "일일 분석 기록 조회 실패:",
          error,
        );

        setLoadError(true);
      });
  }, [date]);

  useEffect(() => {
    setProducts([]);

    getRecommendedProducts(date)
      .then((list) => {
        setProducts(
          list.map((product) => ({
            id: product.productId,
            name: product.prodName,
            tag: product.ingredient,
            url: product.purchaseUrl,
          })),
        );
      })
      .catch((error) => {
        console.error(
          "제품 추천 조회 실패:",
          error,
        );
      });
  }, [date]);

  const showBackHeader = Boolean(location.state?.showBackHeader);

  const headerProps = showBackHeader
    ? {
        variant: "back",
        title: "투데이스킨 기록",

        onBack: () =>
          navigate("/"),
      }
    : {};

  const closeReanalyzeFlow = () => {
    setReanalyzeStep(null);
  };

  const handleCloseRewardModal = () => {
    setPointsRewardOpen(false);

    claimDailyPoints(50);

    setPointsClaimed(true);
  };

  const handleConfirmRecapture = () => {
    navigate("/today-skin/camera");
  };

  /*
   * 끼끼에게 질문하기
   *
   * 같은 분석 결과 화면에서 버튼을 여러 번 눌러도
   * 항상 같은 채팅방으로 연결되도록
   * 채팅방 생성 시 analysisId를 aiAnalysis로 함께 넘긴다.
   * (서버가 해당 aiAnalysis에 연결된 기존 채팅방이 있으면
   * 그 방을 그대로 반환하고, 없으면 새로 만들어 반환한다.)
   *
   * 생성/조회된 채팅방에는 현재 투데이스킨 날짜와
   * 분석 ID를 state로 넘겨서 ChatRoom에서
   * "오늘의 분석 결과에서 어떤 부분이 궁금하신가요?"
   * 같은 초기 UI를 표시할 수 있도록 한다.
   */
  const handleAskKiki = async () => {
    if (isCreatingChat) return;

    if (!analysis) {
      alert(
        "오늘의 분석 결과를 불러오는 중이에요.",
      );

      return;
    }

    const analysisId =
      analysis.analysisId ??
      analysis.id ??
      null;

    if (!analysisId) {
      alert(
        "분석 ID를 찾을 수 없어요. 잠시 후 다시 시도해주세요.",
      );

      return;
    }

    try {
      setIsCreatingChat(true);

      const chat = await createChat(
        "오늘의 투데이스킨 분석",
        analysisId,
      );

      if (!chat?.chatRoomId) {
        throw new Error(
          "생성된 채팅방 ID가 없습니다.",
        );
      }

      navigate(
        `/chat/${chat.chatRoomId}`,
        {
          state: {
            fromTodaySkin: true,

            todaySkinDate: date,

            analysisId,

            /*
             * ChatRoom에서
             * 새 분석 채팅이라는 것을
             * 확실하게 구분하기 위한 값
             */
            isNewTodaySkinChat: true,

            /*
             * 채팅방 진입 시 기존 메시지를
             * 불러오는 것과 별개로
             * TodaySkin 초기 안내 UI를
             * 표시할 수 있도록 한다.
             */
            todaySkinInitialMessage: true,
          },
        },
      );
    } catch (error) {
      console.error(
        "분석 기반 새 채팅방 생성 실패:",
        error,
      );

      alert(
        "채팅방을 열지 못했어요. 잠시 후 다시 시도해주세요.",
      );
    } finally {
      setIsCreatingChat(false);
    }
  };

  if (loadError) {
    return (
      <div>
        <Header {...headerProps} />

        <Content>
          해당 날짜의 기록을 찾을 수 없어요.
        </Content>
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

  const metrics = {
    trouble:
      analysis.detailedMetrics.trouble,

    oil:
      analysis.detailedMetrics.sebum,

    dullness:
      analysis.detailedMetrics.dullness,

    hydration:
      analysis.detailedMetrics.moisture,

    elasticity:
      analysis.detailedMetrics.elasticity,
  };

  return (
    <div>
      <Header {...headerProps} />

      <Content>
        <SkinScoreSummary
          date={date}
          phaseLabel={
            PHASE_LABEL[
              analysis.cyclePhase
            ] ?? null
          }
          score={
            analysis.overallScore
          }
          statusText={`피부 상태 ${analysis.skinStatus}`}
          statusSummary={
            analysis.phaseComment
          }
          onPhotoClick={() => {
            if (photos.length > 0) {
              setPhotoModalOpen(true);
            } else {
              alert(
                "저장된 사진이 없어요.",
              );
            }
          }}
          onAskClick={handleAskKiki}
          onCompareClick={() =>
            navigate(`/today-skin/compare/${date}`)
          }
        />

        <SkinMetricsCard
          metrics={metrics}
        />

        <AiInsightBox
          insight={analysis.aiComment}
        />

        <ProductRecommendSection
          products={products}
        />

        <BottomButtonRow>
          <PointsRewardButton
            claimed={pointsClaimed}
            onClick={() => setPointsRewardOpen(true)}
          />
          <ReanalyzeButton
            onClick={() => setReanalyzeStep("confirm1")}
          />
        </BottomButtonRow>
      </Content>

      {photoModalOpen && (
        <TodaySkinPhotoModal
          photos={photos}
          onClose={() =>
            setPhotoModalOpen(false)
          }
        />
      )}

      {pointsRewardOpen && (
        <PointsRewardModal
          points={50}
          onClose={handleCloseRewardModal}
        />
      )}

      {reanalyzeStep ===
        "confirm1" && (
        <ConfirmModal
          message="현재 기록을 지우고 다시 분석할까요?"
          options={[
            {
              label: "아니요",
              variant: "light",
              onClick:
                closeReanalyzeFlow,
            },

            {
              label: "네",
              variant: "dark",
              onClick: () =>
                setReanalyzeStep(
                  "confirm2",
                ),
            },
          ]}
          onClose={
            closeReanalyzeFlow
          }
        />
      )}

      {reanalyzeStep ===
        "confirm2" && (
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
              onClick: () =>
                setReanalyzeStep(
                  "confirm1",
                ),
            },

            {
              label: "촬영하기",
              variant: "dark",
              onClick:
                handleConfirmRecapture,
            },
          ]}
          onClose={
            closeReanalyzeFlow
          }
        />
      )}
    </div>
  );
}
