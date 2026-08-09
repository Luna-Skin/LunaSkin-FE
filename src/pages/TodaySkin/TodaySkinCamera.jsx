import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  position: relative;
  min-height: 100%;
  background: #1e1b2e;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
`;

const TopBar = styled.div`
  width: 402px;
  height: 73px;
  padding: 24px 24px 30px;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
`;

const BackArrow = styled.button`
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  color: #fff;
  font-family: "Pretendard Variable";
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const TitleText = styled.span`
  color: #fff;
  font-family: "Pretendard Variable";
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

export default function TodaySkinCamera() {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      videoRef.current.srcObject = stream;
    });
  }, []);

  const handleBack = () => {
    navigate("/today-skin");
  };

  return (
    <Wrapper>
      <TopBar>
        <BackArrow onClick={handleBack}>←</BackArrow>
        <TitleText>피부 기록하기</TitleText>
      </TopBar>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ transform: "scaleX(-1)" }}
      />
    </Wrapper>
  );
}