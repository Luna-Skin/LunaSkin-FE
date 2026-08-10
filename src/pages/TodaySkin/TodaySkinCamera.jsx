import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaceDetector, FilesetResolver } from "@mediapipe/tasks-vision";
import FaceFrameGuide from "../../components/todaySkin/FaceFrameGuide";
import captureIcon from "../../assets/icons/camera_capture_button.svg";

const WASM_BASE = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite";

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

const VideoStage = styled.div`
  position: relative;
  width: 100%;
`;

const Video = styled.video`
  width: 100%;
  height: 536px;
  object-fit: cover;
  transform: scaleX(-1);
`;

const FaceFrameWrapper = styled.div`
  position: absolute;
  top: 96px;
  left: 52px;
  width: 298px;
  height: 333px;
  pointer-events: none;
`;

const BottomSection = styled.div`
  height: 203px;
  padding: 24px 98px 60px 99px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 28px;
`;

const GuideText = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.65);
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

const CaptureButton = styled.button`
  width: 72px;
  height: 72px;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
  }
`;

export default function TodaySkinCamera() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const detectorRef = useRef(null);

  useEffect(() => {
    async function setup() {
      // 1. detector 준비
      console.log("1. WASM 엔진 불러오는 중...");
      const vision = await FilesetResolver.forVisionTasks(WASM_BASE);

      console.log("2. 얼굴 인식 모델 불러오는 중...");
      const detector = await FaceDetector.createFromOptions(vision, {
        baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" },
        runningMode: "VIDEO",
      });
      detectorRef.current = detector;
      console.log("3. detector 준비 완료!");

      // 2. 카메라 연결
      console.log("4. 카메라 권한 요청 중...");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      console.log("5. 카메라 영상 연결 완료!");
    }

    setup();
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

      <VideoStage>
        <Video ref={videoRef} autoPlay playsInline muted />
        <FaceFrameWrapper>
          <FaceFrameGuide color="white" />
        </FaceFrameWrapper>
      </VideoStage>

      <BottomSection>
        <GuideText>밝은 곳에서 정면을 촬영해주세요</GuideText>
        <CaptureButton>
          <img src={captureIcon} alt="촬영하기" />
        </CaptureButton>
      </BottomSection>
    </Wrapper>
  );
}