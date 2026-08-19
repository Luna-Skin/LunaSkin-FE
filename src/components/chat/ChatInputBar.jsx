import styled from "styled-components";
import plusIcon from "../../assets/icons/plus.svg";
import sendIcon from "../../assets/icons/send.svg";
import deleteIcon from "../../assets/icons/delete.svg";
import nonoIcon from "../../assets/icons/nono.svg";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: stretch;

  width: 100%;

  box-sizing: border-box;

  padding: 8px 12px;

  border: 1px solid #d9d9d9;
  border-radius: 30px;

  background: #fff;

  font-family: "Pretendard Variable",
    Pretendard, sans-serif;
`;

const PreviewWrapper = styled.div`
  position: relative;

  width: fit-content;

  margin-bottom: 8px;
`;

const PreviewImage = styled.img`
  display: block;

  width: 98px;
  height: 131px;

  object-fit: cover;

  border-radius: 10px;
`;

const RemoveImageButton = styled.button`
  position: absolute;

  top: 4px;
  right: 4px;

  display: grid;

  width: 12px;
  height: 12px;

  place-items: center;

  padding: 0;

  border: 0.6px solid #ede8f8;
  border-radius: 50%;

  background: #f8f6fc;
  color: #666;

  cursor: pointer;
`;

const RemoveImageIcon = styled.img`
  width: 6px;
  height: 6px;

  object-fit: contain;
`;

const CircleButton = styled.button`
  display: grid;

  width: 28px;
  height: 28px;

  flex-shrink: 0;

  place-items: center;

  padding: 0;

  border: 1px solid #ede8f8;
  border-radius: 50%;

  background: #f8f6fc;

  color: #5d5370;

  cursor: pointer;
`;

const ButtonIcon = styled.img`
  width: 7px;
  height: 7px;

  object-fit: contain;
`;

const SendButton = styled(CircleButton)`
  border: 1px solid #ede8f8;

  background: ${({ $isActive }) =>
    $isActive
      ? "#cfb4fd"
      : "#f8f6fc"};

  color: #fff;

  cursor: ${({ $isActive }) =>
    $isActive
      ? "pointer"
      : "default"};

  transition:
    background 0.15s ease;
`;

const SendIcon = styled.img`
  display: block;

  width: 11px;
  height: 14px;
`;

const Input = styled.textarea`
  flex: 1;

  min-height: 22px;
  max-height: 72px;

  padding: 0;

  border: 0;
  outline: none;

  resize: none;

  color: black;

  font-family: "Pretendard Variable",
    Pretendard, sans-serif;
  font-size: 15px;
  font-weight: 400;
  line-height: 20px;

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
  /*
   * 사진만 첨부하고 텍스트가 없으면
   * 전송 버튼을 비활성 상태로 둔다.
   * (사진 단독 전송 방지 — 캡션 없이는 보낼 수 없다)
   */
  const isActive = value.trim().length > 0;

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      if (isActive) {
        onSubmit();
      }
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
            <RemoveImageIcon
              src={nonoIcon}
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
            onChange(
              event.target.value,
            )
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