import axios from "axios";

// BE 서버 주소는 .env에 VITE_API_BASE_URL로 아래처럼 설정함
// VITE_API_BASE_URL=https://api.mynokim.cloud
const baseURL = import.meta.env.VITE_API_BASE_URL || "https://api.mynokim.cloud";

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    "X-USER-ID": 1, // 테스트용 고정 값, 로그인 기능 붙으면 실제 로그인 유저 id로 교체 필요
  },
});