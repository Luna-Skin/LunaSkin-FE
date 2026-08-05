import styled from "styled-components";

const HeaderText = styled.h1`
  height: 33px;
  margin: 0 0 0 24px;
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
  return <HeaderText>LunaSkin</HeaderText>;
}