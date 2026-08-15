import styled from "styled-components";

const HeaderWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  height: 77px;
  background: #ffffff;
`;

const HeaderText = styled.h1`
  position: absolute;
  top: 24px;
  left: 23px;
  margin: 0;
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