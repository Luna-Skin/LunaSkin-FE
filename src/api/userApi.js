import { apiClient } from "./axiosInstance";

// 홈 화면 헤더용 프로필 조회
// GET /api/users/me/skin-profile
// 응답 data: { name, skinType, selectedSkinConcerns: [] }
export async function getHomeProfile() {
  const { data } = await apiClient.get("/api/users/me/skin-profile");
  return data.data;
}

// 유저 정보 조회
export const getMyInfo = async () => {
  const res = await apiClient.get("/api/users/me");
  return res.data;
};

// 피부 정보 조회
export const getMySkinInfo = async () => {
  const res = await apiClient.get("/api/users/me/skin");
  return res.data;
};

// 피부 정보 수정
export const updateMySkinInfo = async (skinTypeId, skinConcernIds) => {
  const res = await apiClient.patch("/api/users/me/skin", {
    skinTypeId,
    skinConcernIds,
  });
  return res.data;
};

// 홈 헤더용 프로필 조회
export const getHomeProfile = async () => {
  const res = await apiClient.get("/api/users/me/skin-profile");
  return res.data;
};

// 생리 주기 정보 조회
export const getCycleInfo = async () => {
  const res = await apiClient.get("/api/cycles/info");
  return res.data;
};

// 생리 주기 정보 수정
export const updateCycleInfo = async (cycleLength, periodDuration) => {
  const res = await apiClient.patch("/api/cycles/info", {
    cycleLength,
    periodDuration,
  });
  return res.data;
};