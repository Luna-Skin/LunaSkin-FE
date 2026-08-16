import { apiClient } from "./axiosInstance";

// 월별 주기 캘린더 조회
// GET /api/cycles/calendar?year=2026&month=8
export async function getCycleCalendar(year, month) {
  const { data } = await apiClient.get("/api/cycles/calendar", {
    params: { year, month },
  });
  return data.data;
}

// 오늘 주기 단계별 코멘트 조회
export async function getCyclePhaseComment() {
  const { data } = await apiClient.get("/api/cycles/comment");
  return data.data;
}

// 생리 시작일 기록 
// POST /api/cycles/start?startDate=YYYY-MM-DD
// startDate랑 endDate는 body가 아니라 query 파라미터로 보냄 
export async function postCycleStart(startDate) {
  const { data } = await apiClient.post("/api/cycles/start", null, {
    params: { startDate },
  });
  return data.data;
}

// 생리 종료일 기록 
// POST /api/cycles/end?endDate=YYYY-MM-DD
export async function postCycleEnd(endDate) {
  const { data } = await apiClient.post("/api/cycles/end", null, {
    params: { endDate },
  });
  return data.data;
}