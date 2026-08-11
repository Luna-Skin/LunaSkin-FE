import axios from "axios";

// BE 서버 주소는 .env에 VITE_API_BASE_URL로 아래처럼 설정함
// VITE_API_BASE_URL=http://localhost:
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 필요하면 요청 시 토큰 자동 첨부
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});