import styled from "styled-components";
import plusIcon from "../../assets/icons/plus.svg";
import sendIcon from "../../assets/icons/send.svg";
import deleteIcon from "../../assets/icons/delete.svg";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  padding: 8px 12px;
  box-sizing: border-box;

  border: 1px solid #ded8e7;
  border-radius: 24px;
  background: #fff;
`;

const PreviewWrapper = styled.div`
  position: relative;
  width: fit-content;
  margin-bottom: 8px;
`;

const PreviewImage = styled.img`
  display: block;
  width: 88px;
  height: 88px;
  object-fit: cover;
  border-radius: 12px;
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: -6px;
  right: -6px;

  display: grid;
  width: 22px;
  height: 22px;
  place-items: center;

  padding: 0;
  border: 1px solid #ddd;
  border-radius: 50%;
  background: #fff;
  color: #666;
  font-size: 15px;
  line-height: 1;
  cursor: pointer;
`;

const CircleButton = styled.button`
  display: grid;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  place-items: center;
  border: 1px solid #e5ddf4;
  border-radius: 50%;
  background: #F8F6FC;
  color: #5d5370;
  cursor: pointer;
`;

const ButtonIcon = styled.img`
  width: 7px;
  height: 7px;
  object-fit: contain;
`;

// 4-3-3: 입력 전엔 비활성(회색), 입력 후 활성(보라)
const SendButton = styled(CircleButton)`
  border: none;
  background: ${({ $isActive }) => ($isActive ? "#a47af5" : "#F8F6FC")};
  color: #fff;
  cursor: ${({ $isActive }) => ($isActive ? "pointer" : "default")};
  transition: background 0.15s ease;
  border: 1px solid #e5ddf4;
`;

const SendIcon = styled.img`
  width: 11px;
  height: 14px;
  display: block;
`;

const Input = styled.textarea`
  flex: 1;
  min-height: 22px;
  max-height: 72px;
  border: 0;
  outline: none;
  resize: none;
  color: #333;
  font-family: inherit;
  font-size: 14px;
  line-height: 22px;

  &::placeholder {
    color: #b6b0c0;
  }
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

export default function ChatInputBar({
  value,
  onChange,
  onSubmit,
  onToggleMenu,
  isMenuOpen,
  image,
  onRemoveImage,
}) {
  const isActive =
  value.trim().length > 0 || !!image;

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (isActive) onSubmit();
    }
  };

  return (
    <Form
  onSubmit={(event) => {
    event.preventDefault();

    if (isActive) {
      onSubmit();
    }
  }}
>
  {image && (
    <PreviewWrapper>
      <PreviewImage
        src={image}
        alt="첨부 이미지 미리보기"
      />

      <RemoveImageButton
        type="button"
        onClick={onRemoveImage}
        aria-label="첨부 이미지 삭제"
      >
        <ButtonIcon
          src={deleteIcon}
          alt=""
        />
      </RemoveImageButton>
    </PreviewWrapper>
  )}

  <InputRow>
    <CircleButton
      type="button"
      onClick={onToggleMenu}
      aria-label="첨부 메뉴"
    >
      {isMenuOpen ? (
        <ButtonIcon
          src={deleteIcon}
          alt=""
        />
      ) : (
        <ButtonIcon
          src={plusIcon}
          alt=""
        />
      )}
    </CircleButton>

    <Input
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
      }
      onKeyDown={handleKeyDown}
      placeholder="메시지를 입력하세요"
      rows="1"
    />

    <SendButton
      type="submit"
      $isActive={isActive}
      disabled={!isActive}
      aria-label="메시지 전송"
    >
      <SendIcon
        src={sendIcon}
        alt=""
      />
    </SendButton>
  </InputRow>
</Form>
  );
}