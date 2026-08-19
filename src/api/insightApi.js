import { apiClient } from "./axiosInstance";

// 트러블 지수 타임라인 조회
export const getTroubleTimeline = async () => {
  const res = await apiClient.get("/api/analyses/trouble-timeline");
  return res.data;
};

// 생활습관 영향 분석
export const getLifestyleInsight = async () => {
  const res = await apiClient.get("/api/analyses/lifestyle");
  return res.data;
};

// 주기 단계별 피부 세부 지표
export const getCycleDetail = async () => {
  const res = await apiClient.get("/api/analyses/cycle-detail");
  return res.data;
};