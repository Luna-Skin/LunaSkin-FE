import axios from "axios";

// BE 서버 주소는 .env에 VITE_API_BASE_URL로 설정
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    "X-USER-ID": 1, // 테스트용 고정 값
  },
});