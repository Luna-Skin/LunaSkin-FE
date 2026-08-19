import styled from "styled-components";

import photoIcon from "../../assets/icons/photo.svg";
import fileIcon from "../../assets/icons/file.svg";

const Menu = styled.div`
  position: absolute;

  bottom: 58px;
  left: 12px;

  z-index: 20;

  width: 132px;

  padding: 8px;

  box-sizing: border-box;

  border: 1px solid #e1dce9;
  border-radius: 14px;

  background: #fff;

  box-shadow:
    0 6px 18px
      rgba(72, 53, 110, 0.12);

  pointer-events: auto;

  font-family: "Pretendard Variable",
    Pretendard, sans-serif;
`;

const MenuButton = styled.button`
  display: flex;
  align-items: center;

  gap: 8px;

  width: 100%;

  padding: 5px 8px;

  border: 0;
  border-radius: 8px;

  background: transparent;

  color: #6b6b6b;

  font-family: "Pretendard Variable",
    Pretendard, sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;

  text-align: left;

  cursor: pointer;

  &:hover {
    background: #f5efff;
  }
`;

const MenuIcon = styled.img`
  width: 20px;
  height: 20px;

  flex-shrink: 0;

  object-fit: contain;

  display: block;
`;

export default function ChatPlusMenu({
  onPhotoClick,
  onFileClick,
}) {
  const handlePhotoClick = (
    event,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    onPhotoClick?.();
  };

  const handleFileClick = (
    event,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    onFileClick?.();
  };

  return (
    <Menu>
      <MenuButton
        type="button"
        onClick={handlePhotoClick}
      >
        <MenuIcon
          src={photoIcon}
          alt=""
        />

        사진 첨부하기
      </MenuButton>

      <MenuButton
        type="button"
        onClick={handleFileClick}
      >
        <MenuIcon
          src={fileIcon}
          alt=""
        />

        파일 첨부하기
      </MenuButton>
    </Menu>
  );
}