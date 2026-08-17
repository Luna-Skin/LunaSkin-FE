import { apiClient } from "./axiosInstance";

const FIELD_NAME_BY_ANGLE = {
  front: "image",
  left: "leftImage",
  right: "rightImage"
};

// 피부 사진 업로드 
// POST /api/analysis/images
// image/leftImage/rightImage로 나눠서 한번에 전송
export async function uploadAnalysisImages(photos) {
  const formData = new FormData();

  for (const photo of photos) {
    const blob = await (await fetch(photo.url)).blob();
    formData.append(FIELD_NAME_BY_ANGLE[photo.angle], blob, `${photo.angle}.jpg`);
  }

  const { data } = await apiClient.post("/api/analysis/images", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data.data;
}

// 일별 피부 분석 요청 
// POST /api/analysis/{date}
// body: { sleepTime, waterIntake, dietType: [], exerciseTime, skinStatus, imageUrl, leftImageUrl, rightImageUrl }
export async function postDailyAnalysis(date, payload) {
  const { data } = await apiClient.post(`/api/analysis/${date}`, payload);
  return data.data;
}

// 일별 피부 분석 기록 조회
// GET /api/analysis/{date}
export async function getDailyAnalysis(date) {
  const { data } = await apiClient.get(`/api/analysis/${date}`);
  return data.data;
}

// 제품 추천 조회
// GET /api/products/recommend?date=YYYY-MM-DD
export async function getRecommendedProducts(date) {
  const { data } = await apiClient.get("/api/products/recommend", {
    params: { date },
  });
  return data.data;
}

// 홈 화면 오늘의 피부 상태 summary 조회
// GET /api/analysis/today
// 응답 data: { skinStatus, aiComment } — 숫자 점수가 아니라 문자열을 줌
export async function getTodayAnalysisSummary() {
  const { data } = await apiClient.get("/api/analysis/today");
  return data.data;
}