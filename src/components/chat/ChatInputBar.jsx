import styled from "styled-components";

const Form = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ded8e7;
  border-radius: 24px;
  background: #fff;
`;

const CircleButton = styled.button`
  display: grid;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  place-items: center;
  border: 1px solid #e5ddf4;
  border-radius: 50%;
  background: #faf7ff;
  color: #5d5370;
  cursor: pointer;
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

export default function ChatInputBar({
  value,
  onChange,
  onSubmit,
  onToggleMenu,
  isMenuOpen,
}) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <CircleButton type="button" onClick={onToggleMenu} aria-label="첨부 메뉴">
        {isMenuOpen ? "×" : "+"}
      </CircleButton>

      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="메시지를 입력하세요"
        rows="1"
      />

      <CircleButton type="submit" aria-label="메시지 전송">
        ↑
      </CircleButton>
    </Form>
  );
}