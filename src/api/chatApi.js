import { apiClient } from "./axiosInstance"; // 기존에 쓰던 axios 인스턴스

// 대화 맥락 전체를 보내서 AI agent가 흐름을 이해하고 답하게 함
export async function requestAIReply({ chatId, messages }) {
  const { data } = await apiClient.post(`/api/chat/${chatId}/messages`, {
    messages: messages.map(({ role, text }) => ({
      role: role === "bot" ? "assistant" : "user",
      content: text,
    })),
  });

  // 기대하는 응답 형태: { reply: string, suggestedTitle?: string }
  return data;
}