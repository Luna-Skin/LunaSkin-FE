import styled from "styled-components";

const HeaderWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
`;

const HeaderText = styled.h1`
  height: 33px;
  margin: 0 0 20px 24px;
  display: flex;
  align-items: center;
  color: #a876fc;
  font-family: "Pretendard Variable";
  font-size: 28px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

export default function Header() {
  return (
    <HeaderWrapper>
      <HeaderText>LunaSkin</HeaderText>
    </HeaderWrapper>
  );
}