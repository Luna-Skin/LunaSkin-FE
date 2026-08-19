import styled from "styled-components";
import arrowIcon from "../../assets/icons/card_arrow_button.svg";

const Container = styled.div`
  display: flex;
  padding: 22px 20.002px 22px 20px;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  gap: 12px;
  border-radius: 18px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  background: #fff;
  box-sizing: border-box;
  width: 354px;
  min-height: 96px;
  margin: 12px auto 0;
`;
const Icon = styled.img`
  width: 44px;
  height: 44px;
  flex-shrink: 0;
`;

const TextGroup = styled.div`
  display: flex;
  min-width: 206px;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.span`
  color: #9a71df;
  font-family: "Pretendard Variable";
  font-size: 17px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

const Description = styled.p`
  margin: 0;
  color: #4e4e4e;
  font-family: "Pretendard Variable";
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ArrowButton = styled.button`
  width: 35.998px;
  height: 35.998px;
  flex-shrink: 0;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;

  img {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

export default function TodaySkinStatusCard({ icon, label, description, onClick }) {
  return (
    <Container>
      <Icon src={icon} alt="" />
      <TextGroup>
        <Label>{label}</Label>
        <Description>{description}</Description>
      </TextGroup>
      <ArrowButton type="button" onClick={onClick} aria-label="자세히 보기">
        <img src={arrowIcon} alt="" />
      </ArrowButton>
    </Container>
  );
}