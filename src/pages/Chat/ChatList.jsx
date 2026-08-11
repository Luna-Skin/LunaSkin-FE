import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { useChatContext } from "../../components/chat/ChatContext";
import { getChatDateLabel } from "../../utils/chatDateLabel";

const Page = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 402px;
  min-height: 100dvh;
  margin: 0 auto;
  background: #fff;
`;

const Header = styled.header`
  padding: 20px 0 12px;
  text-align: center;
`;

const Title = styled.h1`
  color: #9b6dff;
  font-size: 22px;
  font-weight: 700;
`;

const List = styled.ul`
  flex: 1;
  overflow-y: auto;
  padding: 4px 20px;
`;

const ListItem = styled.li`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 4px;
  border-bottom: 1px solid #f1eef8;
  cursor: pointer;
`;

const ChatTitle = styled.span`
  overflow: hidden;
  color: #333;
  font-size: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ChatTitleInput = styled.input`
  flex: 1;
  margin-right: 8px;
  padding: 4px 6px;
  border: 1px solid #c6a5ff;
  border-radius: 6px;
  color: #333;
  font-size: 14px;
  outline: none;
`;

const ChatDate = styled.span`
  flex-shrink: 0;
  margin-left: 8px;
  color: #aaa;
  font-size: 11px;
`;

const EmptyState = styled.p`
  padding: 60px 20px;
  color: #999;
  text-align: center;
  font-size: 13px;
`;

const AddButton = styled.button`
  position: fixed;
  right: max(20px, calc((100vw - 402px) / 2 + 20px));
  bottom: 84px;
  display: grid;
  width: 52px;
  height: 52px;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: #b28cf5;
  box-shadow: 0 6px 16px rgba(155, 109, 255, 0.35);
  color: #fff;
  font-size: 24px;
  cursor: pointer;
`;

const ContextMenu = styled.div`
  position: fixed;
  top: ${({ $y }) => $y}px;
  left: ${({ $x }) => $x}px;
  z-index: 30;
  overflow: hidden;
  border: 1px solid #e1dce9;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 6px 18px rgba(72, 53, 110, 0.15);
`;

const ContextMenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 10px 14px;
  border: 0;
  background: #fff;
  color: #444;
  text-align: left;
  font-size: 13px;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background: #f5efff;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 40;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.4);
`;

const ModalBox = styled.div`
  width: 260px;
  padding: 24px 20px 16px;
  border-radius: 16px;
  background: #fff;
  text-align: center;
`;

const ModalText = styled.p`
  margin-bottom: 20px;
  color: #333;
  font-size: 14px;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ModalButton = styled.button`
  flex: 1;
  padding: 10px 0;
  border: 0;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  background: ${({ $variant }) => ($variant === "danger" ? "#9b6dff" : "#f1eef8")};
  color: ${({ $variant }) => ($variant === "danger" ? "#fff" : "#777")};
`;

export default function ChatList() {
  const navigate = useNavigate();
  const { chats, createChat, renameChat, deleteChat } = useChatContext();

  const [contextMenu, setContextMenu] = useState(null); // { chatId, x, y }
  const [renamingChatId, setRenamingChatId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const renameInputRef = useRef(null);

  const sortedChats = [...chats].sort((a, b) => b.updatedAt - a.updatedAt);

  const openContextMenu = (event, chatId) => {
    event.preventDefault();
    setContextMenu({ chatId, x: event.clientX, y: event.clientY });
  };

  const closeContextMenu = () => setContextMenu(null);

  const startRename = (chat) => {
    setRenamingChatId(chat.id);
    setRenameValue(chat.title);
    closeContextMenu();
    requestAnimationFrame(() => renameInputRef.current?.focus());
  };

  const commitRename = () => {
    if (renamingChatId) renameChat(renamingChatId, renameValue);
    setRenamingChatId(null);
  };

  const requestDelete = (chatId) => {
    setDeleteTargetId(chatId);
    closeContextMenu();
  };

  const confirmDelete = () => {
    if (deleteTargetId) deleteChat(deleteTargetId);
    setDeleteTargetId(null);
  };

  const handleAddChat = () => {
    const newChat = createChat();
    navigate(`/chat/${newChat.id}`);
  };

  return (
    <Page onClick={closeContextMenu}>
      <Header>
        <Title>ChatKIKI</Title>
      </Header>

      {sortedChats.length === 0 ? (
        <EmptyState>
          아직 대화 기록이 없어요.
          <br />
          오른쪽 아래 + 버튼을 눌러 대화를 시작해보세요.
        </EmptyState>
      ) : (
        <List>
          {sortedChats.map((chat) => (
            <ListItem
              key={chat.id}
              onContextMenu={(event) => openContextMenu(event, chat.id)}
              onClick={() => {
                if (renamingChatId !== chat.id) navigate(`/chat/${chat.id}`);
              }}
            >
              {renamingChatId === chat.id ? (
                <ChatTitleInput
                  ref={renameInputRef}
                  value={renameValue}
                  onClick={(event) => event.stopPropagation()}
                  onChange={(event) => setRenameValue(event.target.value)}
                  onBlur={commitRename}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") commitRename();
                    if (event.key === "Escape") setRenamingChatId(null);
                  }}
                />
              ) : (
                <ChatTitle>{chat.title}</ChatTitle>
              )}
              <ChatDate>{getChatDateLabel(chat.updatedAt)}</ChatDate>
            </ListItem>
          ))}
        </List>
      )}

      <AddButton type="button" onClick={handleAddChat} aria-label="새 대화 시작">
        +
      </AddButton>

      {contextMenu && (
        <ContextMenu $x={contextMenu.x} $y={contextMenu.y} onClick={(event) => event.stopPropagation()}>
          <ContextMenuItem
            type="button"
            onClick={() => startRename(chats.find((c) => c.id === contextMenu.chatId))}
          >
            🖉 이름 바꾸기
          </ContextMenuItem>
          <ContextMenuItem type="button" onClick={() => requestDelete(contextMenu.chatId)}>
            🗑 삭제하기
          </ContextMenuItem>
        </ContextMenu>
      )}

      {deleteTargetId && (
        <ModalOverlay onClick={() => setDeleteTargetId(null)}>
          <ModalBox onClick={(event) => event.stopPropagation()}>
            <ModalText>채팅을 삭제할까요?</ModalText>
            <ModalActions>
              <ModalButton type="button" onClick={() => setDeleteTargetId(null)}>
                취소
              </ModalButton>
              <ModalButton type="button" $variant="danger" onClick={confirmDelete}>
                삭제
              </ModalButton>
            </ModalActions>
          </ModalBox>
        </ModalOverlay>
      )}
    </Page>
  );
}