import { createContext, useContext, useEffect, useState, useCallback } from "react";

const ChatContext = createContext(null);
const STORAGE_KEY = "chatkiki:chats";

function loadChatsFromStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveChatsToStorage(chats) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  } catch {
    // localStorage 사용 불가 환경(시크릿 모드 등)에서는 조용히 무시
  }
}

function createEmptyChat({ title = "새로운 대화", fromTodaySkin = false } = {}) {
  const now = Date.now();
  return {
    id: `chat_${now}_${Math.random().toString(36).slice(2, 8)}`,
    title,
    createdAt: now,
    updatedAt: now,
    fromTodaySkin,
    messages: [],
  };
}

export function ChatProvider({ children }) {
  const [chats, setChats] = useState(loadChatsFromStorage);

  useEffect(() => {
    saveChatsToStorage(chats);
  }, [chats]);

  const getChat = useCallback(
    (chatId) => chats.find((chat) => chat.id === chatId) ?? null,
    [chats]
  );

  const createChat = useCallback((options) => {
    const newChat = createEmptyChat(options);
    setChats((current) => [newChat, ...current]);
    return newChat;
  }, []);

  const renameChat = useCallback((chatId, newTitle) => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;

    setChats((current) =>
      current.map((chat) => (chat.id === chatId ? { ...chat, title: trimmed } : chat))
    );
  }, []);

  const deleteChat = useCallback((chatId) => {
    setChats((current) => current.filter((chat) => chat.id !== chatId));
  }, []);

  // updater: 새 배열 또는 (기존 messages) => 새 배열
  // 제목은 더 이상 여기서 자동으로 짓지 않음 (AI가 요약해서 updateChatTitleFromAI로 반영)
  const setChatMessages = useCallback((chatId, updater) => {
    setChats((current) =>
      current.map((chat) => {
        if (chat.id !== chatId) return chat;

        const nextMessages =
          typeof updater === "function" ? updater(chat.messages) : updater;

        return {
          ...chat,
          messages: nextMessages,
          updatedAt: Date.now(),
        };
      })
    );
  }, []);

  // AI agent가 대화 내용을 요약해서 내려준 제목을 반영
  // (사용자가 직접 이름을 바꾼 뒤에는 더 이상 덮어쓰지 않도록, 필요하면 호출하는 쪽에서 조건을 걸어주세요)
  const updateChatTitleFromAI = useCallback((chatId, aiTitle) => {
    const trimmed = aiTitle?.trim();
    if (!trimmed) return;

    setChats((current) =>
      current.map((chat) =>
        chat.id === chatId ? { ...chat, title: trimmed.slice(0, 20) } : chat
      )
    );
  }, []);

  const value = {
    chats,
    getChat,
    createChat,
    renameChat,
    deleteChat,
    setChatMessages,
    updateChatTitleFromAI,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext는 ChatProvider 안에서만 사용할 수 있어요.");
  }
  return context;
}