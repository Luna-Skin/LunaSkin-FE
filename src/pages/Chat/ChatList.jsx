import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { useChatContext } from "../../components/chat/ChatContext";
import { getChatDateLabel } from "../../utils/chatDateLabel";

import trashIcon from "../../assets/icons/Trash.svg";
import editIcon from "../../assets/icons/Edit.svg";

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

  font-family: "Pretendard Variable", Pretendard, sans-serif;
`;

const Header = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;

  height: 83px;
  box-sizing: border-box;

  padding: 24px 20px;

  border-bottom: 1px solid #d9d9d9;
  background: #fff;
`;

const Title = styled.h1`
  margin: 0;

  color: #a985e7;
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
`;

const List = styled.ul`
  flex: 1;

  overflow-y: auto;

  margin: 0;
  padding: 0;

  list-style: none;
`;

const ListItem = styled.li`
  position: relative;

  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  height: 52px;
  box-sizing: border-box;

  padding: 0 20px;

  border-bottom: 0;

  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
`;

const ChatTitle = styled.span`
  min-width: 0;

  overflow: hidden;

  color: #2c2c2c;
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;

  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: break-word;
`;

const ChatTitleInput = styled.input`
  width: auto;
  max-width: 70%;
  height: 36px;

  box-sizing: border-box;

  padding: 0 12px;

  border: 1px solid #0d99ff;
  border-radius: 0;

  outline: none;

  background: #badefe;

  color: #2c2c2c;

  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;

  word-wrap: break-word;

  &:focus {
    outline: none;
  }
`;

const ChatDate = styled.span`
  flex-shrink: 0;

  margin-left: 12px;

  color: #7e7979;
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;

  word-wrap: break-word;
`;

const EmptyState = styled.p`
  margin: 0;
  padding: 60px 20px;

  color: #7e7979;
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;

  text-align: center;
`;

const AddButton = styled.button`
  position: absolute;
  right: 20px;
  bottom: 24px;

  display: grid;
  place-items: center;

  width: 52px;
  height: 52px;

  padding: 0;

  border: 0;
  border-radius: 50%;

  background: #cfb4fd;
  color: #fff;

  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 24px;
  font-weight: 500;

  cursor: pointer;
`;

const ContextMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 20px;
  z-index: 30;

  overflow: hidden;

  width: 105px;

  border: 1px solid #d9d9d9;
  border-radius: 19px;

  background: #fff;
`;

const ContextMenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;

  width: 100%;

  padding: 5px 14px;

  border: 0;

  background: #f7f2ff;
  color: #2c2c2c;

  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;

  text-align: left;
  white-space: nowrap;

  cursor: pointer;

  &:hover {
    background: #f5efff;
  }
`;

const MenuIcon = styled.img`
  width: 16px;
  height: 16px;

  flex-shrink: 0;

  display: block;

  object-fit: contain;
`;

const ModalOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 40;

  display: grid;
  place-items: center;

  background: rgba(0, 0, 0, 0.4);
`;

const ModalBox = styled.div`
  position: relative;

  width: 330px;
  height: 160px;
  box-sizing: border-box;

  padding: 24px;

  border-radius: 18px;

  background: #ffffff;

  outline: 1.5px rgba(0, 0, 0, 0.1) solid;
  outline-offset: -1.5px;

  font-family: "Pretendard Variable", Pretendard, sans-serif;
`;

const ModalText = styled.p`
  margin: 0;

  color: #2c2c2c;

  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 18px;
  font-weight: 500;
  line-height: 20px;

  word-wrap: break-word;
`;

const ModalActions = styled.div`
  position: absolute;

  right: 24px;
  bottom: 24px;

  display: inline-flex;
  align-items: center;

  gap: 12px;
`;

const ModalButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 8px 16px;

  border: 0;
  border-radius: 18px;

  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 20px;
  font-weight: 500;
  line-height: 20px;

  cursor: pointer;

  background: ${({ $variant }) =>
    $variant === "danger"
      ? "#A985E7"
      : "#F0E8FF"};

  color: ${({ $variant }) =>
    $variant === "danger"
      ? "#FFFFFF"
      : "#A985E7"};
`;

export default function ChatList() {
  const navigate = useNavigate();

  const {
    chats,
    isLoadingChats,
    createChat,
    renameChat,
    deleteChat,
  } = useChatContext();

  const [contextMenu, setContextMenu] =
    useState(null);

  const [renamingChatId, setRenamingChatId] =
    useState(null);

  const [renameValue, setRenameValue] =
    useState("");

  const [deleteTargetId, setDeleteTargetId] =
    useState(null);

  const renameInputRef = useRef(null);
  const longPressTimer = useRef(null);
  const isLongPressRef = useRef(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!contextMenu) return undefined;

    const handleOutsidePointerDown = (event) => {
      if (
        menuRef.current &&
        menuRef.current.contains(event.target)
      ) {
        return;
      }

      setContextMenu(null);
    };

    document.addEventListener(
      "pointerdown",
      handleOutsidePointerDown,
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handleOutsidePointerDown,
      );
    };
  }, [contextMenu]);

  const startRename = (chat) => {
    setRenamingChatId(chat.chatRoomId);
    setRenameValue(chat.title);
    setContextMenu(null);

    requestAnimationFrame(() => {
      renameInputRef.current?.focus();
      renameInputRef.current?.select();
    });
  };

  const commitRename = async () => {
    if (renamingChatId === null) return;

    try {
      await renameChat(
        renamingChatId,
        renameValue,
      );
    } catch (error) {
      console.error(
        "이름 변경에 실패했습니다.",
        error,
      );

      alert("이름을 변경하지 못했어요.");
    } finally {
      setRenamingChatId(null);
    }
  };

  const confirmDelete = async () => {
    if (deleteTargetId === null) return;

    try {
      await deleteChat(deleteTargetId);
    } catch (error) {
      console.error(
        "채팅방 삭제 실패:",
        error,
      );

      alert("채팅방을 삭제하지 못했어요.");
    } finally {
      setDeleteTargetId(null);
    }
  };

  const handleAddChat = async () => {
    try {
      const newChat =
        await createChat("새로운 대화");

      navigate(
        `/chat/${newChat.chatRoomId}`,
      );
    } catch (error) {
      console.error(
        "채팅방 생성 실패:",
        error,
      );

      alert("채팅방을 만들지 못했어요.");
    }
  };

  const handlePointerDown = (chatRoomId) => {
    isLongPressRef.current = false;

    longPressTimer.current = setTimeout(() => {
      isLongPressRef.current = true;
      setContextMenu(chatRoomId);
    }, LONG_PRESS_DURATION);
  };

  const handlePointerRelease = () => {
    clearTimeout(longPressTimer.current);
  };

  const handleItemClick = (chatRoomId) => {
    if (isLongPressRef.current) {
      isLongPressRef.current = false;
      return;
    }

    if (renamingChatId !== chatRoomId) {
      navigate(`/chat/${chatRoomId}`);
    }
  };

  return (
    <Page>
      <Header>
        <Title>ChatKIKI</Title>
      </Header>

      {isLoadingChats ? (
        <EmptyState>
          채팅방을 불러오는 중이에요.
        </EmptyState>
      ) : chats.length === 0 ? (
        <EmptyState>
          아직 대화 기록이 없어요.
          <br />
          오른쪽 아래 + 버튼을 눌러
          대화를 시작해보세요.
        </EmptyState>
      ) : (
        <List>
          {chats.map((chat) => (
            <ListItem
              key={chat.chatRoomId}
              onPointerDown={() =>
                handlePointerDown(
                  chat.chatRoomId,
                )
              }
              onPointerUp={handlePointerRelease}
              onPointerLeave={handlePointerRelease}
              onPointerCancel={
                handlePointerRelease
              }
              onClick={() =>
                handleItemClick(
                  chat.chatRoomId,
                )
              }
            >
              {renamingChatId ===
              chat.chatRoomId ? (
                <ChatTitleInput
                  ref={renameInputRef}
                  value={renameValue}
                  size={Math.max(
                    renameValue.length,
                    1,
                  )}
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                  onChange={(event) =>
                    setRenameValue(
                      event.target.value,
                    )
                  }
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
                <ChatTitle>
                  {chat.title}
                </ChatTitle>
              )}

              <ChatDate>
                {getChatDateLabel(
                  chat.createdAt,
                )}
              </ChatDate>

              {contextMenu ===
                chat.chatRoomId && (
                <ContextMenu
                  ref={menuRef}
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                >
                  <ContextMenuItem
                    type="button"
                    onClick={() =>
                      startRename(chat)
                    }
                  >
                    <MenuIcon
                      src={editIcon}
                      alt=""
                    />
                    이름 바꾸기
                  </ContextMenuItem>

                  <ContextMenuItem
                    type="button"
                    onClick={() => {
                      setDeleteTargetId(
                        chat.chatRoomId,
                      );
                      setContextMenu(null);
                    }}
                  >
                    <MenuIcon
                      src={trashIcon}
                      alt=""
                    />
                    삭제하기
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

      {deleteTargetId !== null && (
        <ModalOverlay
          onClick={() =>
            setDeleteTargetId(null)
          }
        >
          <ModalBox
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <ModalText>
              채팅을 삭제할까요?
            </ModalText>

            <ModalActions>
              <ModalButton
                type="button"
                onClick={() =>
                  setDeleteTargetId(null)
                }
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