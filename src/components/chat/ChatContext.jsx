import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

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
    // localStorage 사용 불가 환경에서는 조용히 무시
  }
}

function createEmptyChat({
  title = "새로운 대화",
  fromTodaySkin = false,
  todaySkinDate = null,
} = {}) {
  const now = Date.now();

  return {
    id: `chat_${now}_${Math.random().toString(36).slice(2, 8)}`,
    title,
    createdAt: now,
    updatedAt: now,

    // 투데이스킨에서 시작한 채팅인지
    fromTodaySkin,

    // 몇 년 몇 월 며칠의 투데이스킨인지
    todaySkinDate,

    messages: [],
  };
}

export function ChatProvider({ children }) {
  const [chats, setChats] = useState(loadChatsFromStorage);

  useEffect(() => {
    saveChatsToStorage(chats);
  }, [chats]);

  const getChat = useCallback(
    (chatId) =>
      chats.find((chat) => chat.id === chatId) ?? null,
    [chats],
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
      current.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              title: trimmed,
            }
          : chat,
      ),
    );
  }, []);

  const deleteChat = useCallback((chatId) => {
    setChats((current) =>
      current.filter((chat) => chat.id !== chatId),
    );
  }, []);

  const setChatMessages = useCallback((chatId, updater) => {
    setChats((current) =>
      current.map((chat) => {
        if (chat.id !== chatId) return chat;

        const nextMessages =
          typeof updater === "function"
            ? updater(chat.messages)
            : updater;

        return {
          ...chat,
          messages: nextMessages,
          updatedAt: Date.now(),
        };
      }),
    );
  }, []);

  const updateChatTitleFromAI = useCallback(
    (chatId, aiTitle) => {
      const trimmed = aiTitle?.trim();

      if (!trimmed) return;

      setChats((current) =>
        current.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                title: trimmed.slice(0, 20),
              }
            : chat,
        ),
      );
    },
    [],
  );

  const value = {
    chats,
    getChat,
    createChat,
    renameChat,
    deleteChat,
    setChatMessages,
    updateChatTitleFromAI,
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