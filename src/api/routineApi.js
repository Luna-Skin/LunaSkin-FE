import { apiClient } from "./axiosInstance";

// 오늘의 AI 추천 루틴 조회
// GET /api/routines/routine
// 응답 data: { phaseType, targetDate, routines: [{ routineCategory, content }] }
export async function getTodayRoutine() {
  const { data } = await apiClient.get("/api/routines/routine");
  return data.data;
}