import styled from "styled-components";

const Card = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 354px;
  height: 77px;
  align-self: stretch;
  padding: 0 19px;
  border-radius: 18px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  background: #fff;
`;

const IconBox = styled.div`
  display: flex;
  width: 44px;
  height: 44px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  background: #e2fcff;
  flex-shrink: 0;
`;

const IconImage = styled.img`
  width: 30px;
  height: 30px;
`;

const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.span`
  color: #66d1dd;
  font-family: "Pretendard Variable";
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const Description = styled.span`
  color: #3c3c3c;
  font-family: "Pretendard Variable";
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

export default function RoutineCard({ icon, title, description }) {
  return (
    <Card>
      <IconBox>
        <IconImage src={icon} alt={title} />
      </IconBox>
      <TextBox>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </TextBox>
    </Card>
  );
}