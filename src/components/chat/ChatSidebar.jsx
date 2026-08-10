import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 40;
  background: rgba(0, 0, 0, 0.35);
`;

const Panel = styled.aside`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  width: 78%;
  max-width: 300px;
  height: 100%;
  padding: 22px 16px;
  background: #fff;
  box-shadow: 4px 0 16px rgba(0, 0, 0, 0.08);
`;

const Title = styled.h2`
  margin-bottom: 16px;
  color: #7c4dff;
  font-size: 18px;
  font-weight: 700;
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
`;

const Item = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 8px;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    background: #f5efff;
  }
`;

const ItemName = styled.span`
  overflow: hidden;
  color: #333;
  font-size: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ItemDate = styled.span`
  flex-shrink: 0;
  margin-left: 8px;
  color: #aaa;
  font-size: 11px;
`;

// TODO: 실제로는 서버/스토어에서 대화 목록을 받아와야 함.
const MOCK_CHATS = [
  { id: 1, title: "투데이 스킨 상세 분석 문의", date: "오늘" },
  { id: 2, title: "건성 피부 관리 루틴 추천", date: "오늘" },
  { id: 3, title: "트러블 관리법", date: "어제" },
  { id: 4, title: "황체기 피부 특징", date: "8월 23일" },
];

export default function ChatSidebar({ onClose, onSelectChat }) {
  return (
    <Overlay onClick={onClose}>
      <Panel onClick={(event) => event.stopPropagation()}>
        <Title>채팅 기록</Title>
        <List>
          {MOCK_CHATS.map((chat) => (
            <Item key={chat.id} onClick={() => onSelectChat?.(chat.id)}>
              <ItemName>{chat.title}</ItemName>
              <ItemDate>{chat.date}</ItemDate>
            </Item>
          ))}
        </List>
      </Panel>
    </Overlay>
  );
}