import axios from "axios";

// BE 서버 주소
const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://api.mynokim.cloud";

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 로그인 기능 없이 테스트용 사용자 ID 사용
apiClient.interceptors.request.use((config) => {
  config.headers["X-USER-ID"] = "1";

  return config;
});