import { apiClient } from "./axiosInstance";

// 월별 주기 캘린더 조회
// GET /api/cycles/calendar?year=2026&month=8
export async function getCycleCalendar(year, month) {
  const { data } = await apiClient.get("/api/cycles/calendar", {
    params: { year, month },
  });
  return data.data;
}