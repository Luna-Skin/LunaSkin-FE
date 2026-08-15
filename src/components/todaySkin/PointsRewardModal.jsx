import styled from "styled-components";
import rewardImage from "../../assets/images/points_reward_illustration.svg";

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

const Container = styled.div`
  position: relative;
  width: 354px;
  border-radius: 18px;
  overflow: hidden;
  background: #fff;
  box-sizing: border-box;
`;

const Illustration = styled.img`
  display: block;
  width: 100%;
  height: auto;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 210px;
  left: 24px;
  display: flex;
  width: 306px;
  height: 52px;
  padding: 16px 32px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 18px;
  border: none;
  background: #a985e7;
  cursor: pointer;
  box-sizing: border-box;
`;

const CloseLabel = styled.span`
  color: #fff;
  text-align: right;
  font-family: "Pretendard Variable";
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;


export default function PointsRewardModal({ points = 50, onClose }) {
  return (
    <Overlay onClick={onClose}>
      <Container onClick={(event) => event.stopPropagation()}>
        <Illustration src={rewardImage} alt={`${points}P를 받았어요!`} />
        <CloseButton type="button" onClick={onClose}>
          <CloseLabel>닫기</CloseLabel>
        </CloseButton>
      </Container>
    </Overlay>
  );
}