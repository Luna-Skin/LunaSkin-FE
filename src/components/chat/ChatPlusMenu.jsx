import styled from "styled-components";

const Menu = styled.div`
  position: absolute;
  bottom: 58px;
  left: 12px;
  width: 132px;
  padding: 8px;
  border: 1px solid #e1dce9;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 6px 18px rgba(72, 53, 110, 0.12);
`;

const MenuButton = styled.button`
  width: 100%;
  padding: 9px 8px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #555;
  text-align: left;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    background: #f5efff;
  }
`;

export default function ChatPlusMenu({ onPhotoClick, onFileClick }) {
  return (
    <Menu>
      <MenuButton type="button" onClick={onPhotoClick}>
        ▧ 사진 첨부하기
      </MenuButton>
      <MenuButton type="button" onClick={onFileClick}>
        ▱ 파일 첨부하기
      </MenuButton>
    </Menu>
  );
}