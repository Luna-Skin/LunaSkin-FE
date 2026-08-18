import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  createChatRoom as createChatRoomApi,
  createChatRoomFromAnalysis as createChatRoomFromAnalysisApi,
  deleteChatRoom as deleteChatRoomApi,
  getChatRoomMessages,
  getChatRooms,
  renameChatRoom as renameChatRoomApi,
} from "../../api/chatApi";

const ChatContext = createContext(null);

function unwrapData(response) {
  return response?.data !== undefined
    ? response.data
    : response;
}

function normalizeChatRoom(room) {
  return {
    ...room,
    chatRoomId:
      room?.chatRoomId ??
      room?.roomId ??
      room?.id,
    title:
      room?.title ??
      room?.name ??
      "새로운 대화",
    createdAt:
      room?.createdAt ??
      room?.createdDate ??
      Date.now(),
    updatedAt:
      room?.updatedAt ??
      room?.modifiedAt ??
      room?.createdAt ??
      Date.now(),
    analysisId:
      room?.analysisId ??
      room?.analysis?.analysisId ??
      null,
  };
}

function normalizeRooms(response) {
  const data = unwrapData(response);

  if (Array.isArray(data)) {
    return data.map(normalizeChatRoom);
  }

  if (Array.isArray(data?.rooms)) {
    return data.rooms.map(normalizeChatRoom);
  }

  if (Array.isArray(data?.chatRooms)) {
    return data.chatRooms.map(normalizeChatRoom);
  }

  return [];
}

function normalizeMessage(message) {
  const role =
    message?.role === "AI"
      ? "bot"
      : message?.role === "USER"
        ? "user"
        : message?.role === "assistant"
          ? "bot"
          : message?.role ?? "bot";

  return {
    ...message,
    id:
      message?.chatMessageId ??
      message?.messageId ??
      message?.id ??
      `${Date.now()}-${Math.random()}`,
    chatMessageId:
      message?.chatMessageId ??
      message?.messageId ??
      message?.id,
    role,
    text:
      message?.content ??
      message?.text ??
      "",
    image:
      message?.fileUrl ??
      message?.image ??
      null,
    time:
      message?.createdAt ??
      message?.time ??
      null,
    messageType:
      message?.messageType ?? "TEXT",
  };
}

function normalizeMessages(response) {
  const data = unwrapData(response);

  if (Array.isArray(data)) {
    return data.map(normalizeMessage);
  }

  if (Array.isArray(data?.messages)) {
    return data.messages.map(normalizeMessage);
  }

  if (Array.isArray(data?.content)) {
    return data.content.map(normalizeMessage);
  }

  return [];
}

export function ChatProvider({ children }) {
  const [chats, setChats] = useState([]);
  const [isLoadingChats, setIsLoadingChats] = useState(true);

  const fetchChatRooms = useCallback(async () => {
    try {
      setIsLoadingChats(true);

      const response = await getChatRooms();
      const rooms = normalizeRooms(response);

      // 서버가 준 순서를 그대로 유지
      setChats(rooms);

      return rooms;
    } finally {
      setIsLoadingChats(false);
    }
  }, []);

  useEffect(() => {
    fetchChatRooms().catch((error) => {
      console.error("채팅방 목록을 불러오지 못했습니다.", error);
    });
  }, [fetchChatRooms]);

  const getChat = useCallback(
    (chatId) =>
      chats.find(
        (chat) =>
          String(chat.chatRoomId) === String(chatId),
      ) ?? null,
    [chats],
  );

  const createChat = useCallback(
    async (title = "새로운 대화") => {
      const response = await createChatRoomApi(title);

      const newChat = normalizeChatRoom(
        unwrapData(response),
      );

      setChats((current) => [
        newChat,
        ...current.filter(
          (chat) =>
            String(chat.chatRoomId) !==
            String(newChat.chatRoomId),
        ),
      ]);

      return newChat;
    },
    [],
  );

  const createChatFromAnalysis = useCallback(
    async (analysisId) => {
      if (!analysisId) {
        throw new Error("analysisId가 없습니다.");
      }

      const response =
        await createChatRoomFromAnalysisApi(analysisId);

      const chat = normalizeChatRoom(
        unwrapData(response),
      );

      setChats((current) => [
        chat,
        ...current.filter(
          (item) =>
            String(item.chatRoomId) !==
            String(chat.chatRoomId),
        ),
      ]);

      return chat;
    },
    [],
  );

  const fetchChatMessages = useCallback(async (chatId) => {
    const response = await getChatRoomMessages(chatId);

    return normalizeMessages(response);
  }, []);

  const renameChat = useCallback(
    async (chatId, newTitle) => {
      const trimmed = newTitle.trim();

      if (!trimmed) return;

      await renameChatRoomApi(chatId, trimmed);

      setChats((current) =>
        current.map((chat) =>
          String(chat.chatRoomId) === String(chatId)
            ? {
                ...chat,
                title: trimmed,
              }
            : chat,
        ),
      );
    },
    [],
  );

  const deleteChat = useCallback(async (chatId) => {
    await deleteChatRoomApi(chatId);

    setChats((current) =>
      current.filter(
        (chat) =>
          String(chat.chatRoomId) !== String(chatId),
      ),
    );
  }, []);

  const value = {
    chats,
    isLoadingChats,
    getChat,
    createChat,
    createChatFromAnalysis,
    fetchChatRooms,
    fetchChatMessages,
    renameChat,
    deleteChat,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error(
      "useChatContext는 ChatProvider 안에서만 사용할 수 있어요.",
    );
  }

  return context;
}