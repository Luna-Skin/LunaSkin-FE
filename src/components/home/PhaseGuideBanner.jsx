import styled from "styled-components";

const Banner = styled.div`
  width: 354px;
  height: 97px;
  border-radius: 18px;
  background: linear-gradient(97deg, #f0e8ff 0.8%, #e7fbfa 99.16%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 17px 16px 16px 21px;
  margin: 20px auto;
`;

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TitleRow = styled.div`
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
  width : 100%;
`;

const TitleDot = styled.span`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #275dae;
`;

const TitleText = styled.span`
  color: #275dae;
  font-family: "Pretendard Variable";
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const Description = styled.p`
  color: #3c3c3c;
  text-align: left;
  font-family: "Pretendard Variable";
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

export default function PhaseGuideBanner({ title, description }) {
  return (
    <Banner>
      <ContentBox>
        <TitleRow>
          <TitleDot />
          <TitleText>{title}</TitleText>
        </TitleRow>
        <Description>{description}</Description>
      </ContentBox>
    </Banner>
  );
}
