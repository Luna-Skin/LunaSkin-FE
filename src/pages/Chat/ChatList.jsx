import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { useChatContext } from "../../components/chat/ChatContext";
import { getChatDateLabel } from "../../utils/chatDateLabel";

const LONG_PRESS_DURATION = 1500;

const Page = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 402px;
  min-height: 100%;
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
  user-select: none;
  -webkit-user-select: none;
`;

const ChatTitle = styled.span`
  overflow: hidden;
  color: #333;
  font-size: 14px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ChatTitleInput = styled.input`
  width: auto;
  max-width: 70%;
  padding: 2px 4px;
  border: 1px solid #0d99ff;
  border-radius: 4px;
  background: #badefe;
  color: #333;
  font-size: 14px;
  font-weight: 600;
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
  position: absolute;
  right: 20px;
  bottom: 24px;
  display: grid;
  width: 52px;
  height: 52px;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: #cfb4fd;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
`;

const ContextMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 4px;
  z-index: 30;
  overflow: hidden;
  width: 98px;
  border: 1px solid #d9d9d9;
  border-radius: 19px;
  background: #fff;
`;

const ContextMenuItem = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 120px;
  padding: 4px 14px;
  border: 0;
  background: #F7F2FF;
  color: #2C2C2C;
  text-align: left;
  font-size: 11px;
  white-space: nowrap;
  cursor: pointer;
  &:hover {
    background: #f5efff;
  }
`;

const MenuIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 9px;
  flex-shrink: 0;
  margin-right: 6px;
  font-size: 12px;
`;

const MenuText = styled.span`
  text-align: left;
  font-weight: 500;
  padding: 1px
`;

const ModalOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 40;
  display: grid;
  place-items: center;
  background: rgba(142, 142, 142, 0.4);
`;

const ModalBox = styled.div`
  width: 360px;
  padding: 16px 23px 12px;
  border-radius: 24px;
  background: #fff;
  text-align: left;
  box-sizing: border-box;
  border-radius: 20px;
`;

const ModalText = styled.p`
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 400;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 14px;
  margin-top: 45px;
`;

const ModalButton = styled.button`
  width: 65px;
  height: 38px;
  padding: 0;
  flex: none;

  border: 0;
  border-radius: 24px;

  font-size: 16px;
  font-weight: 400;

  cursor: pointer;

  background: ${({ $variant }) =>
    $variant === "danger" ? "#A985E7" : "#F0E8FF"};

  color: ${({ $variant }) =>
    $variant === "danger" ? "#FFFFFF" : "#A985E7"};
`;

export default function ChatList() {
  const navigate = useNavigate();

  const { chats, createChat, renameChat, deleteChat } = useChatContext();

  const [contextMenu, setContextMenu] = useState(null);
  const [renamingChatId, setRenamingChatId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const renameInputRef = useRef(null);
  const longPressTimer = useRef(null);
  const isLongPressRef = useRef(false);
  const menuRef = useRef(null);

  const sortedChats = [...chats].sort(
    (a, b) => b.updatedAt - a.updatedAt,
  );

  // 메뉴가 열려 있을 때 바깥을 누르면 메뉴 닫기
  useEffect(() => {
    if (!contextMenu) return undefined;

    const handleOutsidePointerDown = (event) => {
      if (menuRef.current && menuRef.current.contains(event.target)) {
        return;
      }

      setContextMenu(null);
    };

    document.addEventListener("pointerdown", handleOutsidePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointerDown);
    };
  }, [contextMenu]);

  // 이름 변경 시작
  const startRename = (chat) => {
    setRenamingChatId(chat.id);
    setRenameValue(chat.title);
    setContextMenu(null);

    requestAnimationFrame(() => {
      renameInputRef.current?.focus();
      renameInputRef.current?.select();
    });
  };

  // 이름 변경 확정
  const commitRename = () => {
    if (renamingChatId) {
      renameChat(renamingChatId, renameValue);
    }

    setRenamingChatId(null);
  };

  // 삭제 요청
  const requestDelete = (chatId) => {
    setDeleteTargetId(chatId);
    setContextMenu(null);
  };

  // 삭제 확정
  const confirmDelete = () => {
    if (deleteTargetId) {
      deleteChat(deleteTargetId);
    }

    setDeleteTargetId(null);
  };

  // 새 채팅 생성
  const handleAddChat = () => {
    const newChat = createChat();
    navigate(`/chat/${newChat.id}`);
  };

  // 롱프레스 시작
  const handlePointerDown = (chatId) => {
    isLongPressRef.current = false;

    longPressTimer.current = setTimeout(() => {
      isLongPressRef.current = true;
      setContextMenu(chatId);
    }, LONG_PRESS_DURATION);
  };

  // 롱프레스 타이머 취소
  const handlePointerRelease = () => {
    clearTimeout(longPressTimer.current);
  };

  // 채팅방 클릭
  const handleItemClick = (chatId) => {
    // 롱프레스 직후에는 채팅방으로 이동하지 않음
    if (isLongPressRef.current) {
      isLongPressRef.current = false;
      return;
    }

    if (renamingChatId !== chatId) {
      navigate(`/chat/${chatId}`);
    }
  };

  return (
    <Page>
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
              onPointerDown={() => handlePointerDown(chat.id)}
              onPointerUp={handlePointerRelease}
              onPointerLeave={handlePointerRelease}
              onPointerCancel={handlePointerRelease}
              onClick={() => handleItemClick(chat.id)}
            >
              {renamingChatId === chat.id ? (
                <ChatTitleInput
                  ref={renameInputRef}
                  value={renameValue}
                  size={Math.max(renameValue.length, 1)}
                  onClick={(event) => event.stopPropagation()}
                  onChange={(event) => setRenameValue(event.target.value)}
                  onBlur={commitRename}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      commitRename();
                    }

                    if (event.key === "Escape") {
                      setRenamingChatId(null);
                    }
                  }}
                />
              ) : (
                <ChatTitle>{chat.title}</ChatTitle>
              )}

              <ChatDate>
                {getChatDateLabel(chat.updatedAt)}
              </ChatDate>

              {contextMenu === chat.id && (
              <ContextMenu
                ref={menuRef}
                onClick={(event) => event.stopPropagation()}
              >
                <ContextMenuItem
                  type="button"
                  onClick={() => startRename(chat)}
                >
                  <MenuIcon>🖉</MenuIcon>
                  <MenuText>이름 바꾸기</MenuText>
                </ContextMenuItem>

                <ContextMenuItem
                  type="button"
                  onClick={() => requestDelete(chat.id)}
                >
                  <MenuIcon>🗑</MenuIcon>
                  <MenuText>삭제하기</MenuText>
                </ContextMenuItem>
              </ContextMenu>
            )}
            </ListItem>
          ))}
        </List>
      )}

      <AddButton
        type="button"
        onClick={handleAddChat}
        aria-label="새 대화 시작"
      >
        +
      </AddButton>

      {deleteTargetId && (
        <ModalOverlay onClick={() => setDeleteTargetId(null)}>
          <ModalBox onClick={(event) => event.stopPropagation()}>
            <ModalText>채팅을 삭제할까요?</ModalText>

            <ModalActions>
              <ModalButton
                type="button"
                onClick={() => setDeleteTargetId(null)}
              >
                취소
              </ModalButton>

              <ModalButton
                type="button"
                $variant="danger"
                onClick={confirmDelete}
              >
                삭제
              </ModalButton>
            </ModalActions>
          </ModalBox>
        </ModalOverlay>
      )}
    </Page>
  );
}