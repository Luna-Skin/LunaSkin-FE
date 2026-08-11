import styled from "styled-components";
import backIcon from "../../assets/icons/header_back.svg";

const HeaderWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  background: #ffffff;
  box-sizing: border-box;

  ${({ $variant }) =>
    $variant === "back"
      ? `
    display: flex;
    padding: 15px 138px 15px 8px;
    align-items: flex-start;
    gap: 104px;
    border-bottom: 1px solid #d9d9d9;
  `
      : `
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
  `}
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  width: 26px;
  height: 26px;
`;

const BackIcon = styled.img`
  width: 10px;
  height: 18px;
`;

const Title = styled.h1`
  margin: 0;
  font-family: "Pretendard Variable";
  font-style: normal;
  line-height: normal;

  ${({ $variant }) =>
    $variant === "back"
      ? `
    color: #000;
    font-size: 20px;
    font-weight: 600;
  `
      : `
    color: #a985e7;
    font-size: 28px;
    font-weight: 700;
  `}
`;

export default function Header({ variant = "default", title = "TodaySkin", onBack }) {
  return (
    <HeaderWrapper $variant={variant}>
      {variant === "back" && (
        <BackButton type="button" onClick={onBack} aria-label="뒤로 가기">
          <BackIcon src={backIcon} alt="" />
        </BackButton>
      )}
      <Title $variant={variant}>{title}</Title>
    </HeaderWrapper>
  );
}