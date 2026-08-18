import { apiClient } from "./axiosInstance";

// 채팅방 목록 조회
export const getChatRooms = async () => {
  const res = await apiClient.get("/api/chat/rooms");
  return res.data;
};

// 일반 채팅방 생성
export const createChatRoom = async (title = "새로운 대화") => {
  const res = await apiClient.post("/api/chat/rooms", {
    title,
  });

  return res.data;
};

// 분석 결과 기반 채팅방 조회/생성
export const createChatRoomFromAnalysis = async (analysisId) => {
  const res = await apiClient.post(
    `/api/chat/rooms/analyses/${analysisId}`,
  );

  return res.data;
};

// 채팅방 이름 변경
export const renameChatRoom = async (roomId, title) => {
  const res = await apiClient.patch("/api/chat/rooms", {
    roomId,
    title,
  });

  return res.data;
};

// 채팅방 삭제
export const deleteChatRoom = async (roomId) => {
  const res = await apiClient.delete(
    `/api/chat/rooms/${roomId}`,
  );

  return res.data;
};

// 대화 내역 조회
export const getChatRoomMessages = async (roomId) => {
  const res = await apiClient.get(
    `/api/chat/rooms/${roomId}/messages`,
  );

  return res.data;
};

// 파일 / 이미지 업로드
export const uploadChatFile = async (roomId, file) => {
  const formData = new FormData();

  formData.append("roomId", roomId);
  formData.append("file", file);

  const res = await apiClient.post(
    "/api/chat/files",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return res.data;
};