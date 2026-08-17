import { apiClient } from "./axiosInstance";

// 홈 화면 헤더용 프로필 조회
// GET /api/users/me/skin-profile
// 응답 data: { name, skinType, selectedSkinConcerns: [] }
export async function getHomeProfile() {
  const { data } = await apiClient.get("/api/users/me/skin-profile");
  return data.data;
}