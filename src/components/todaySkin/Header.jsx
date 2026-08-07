import styled from "styled-components";

const HeaderWrapper = styled.header`
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  margin: 0;
  color: #a985e7;
  font-family: "Pretendard Variable";
  font-size: 28px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

export default function Header() {
  return (
    <HeaderWrapper>
      <Title>TodaySkin</Title>
    </HeaderWrapper>
  );
}