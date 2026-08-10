import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaceDetector, FilesetResolver } from "@mediapipe/tasks-vision";

import FaceFrameGuide from "../../components/todaySkin/FaceFrameGuide";
import PhotoConfirmSheet from "../../components/todaySkin/PhotoConfirmSheet";
import captureIcon from "../../assets/icons/camera_capture_button.svg";

const WASM_BASE = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite";

// 확인 화면 UI 테스트용 임시 데이터
const DEMO_PHOTO_FEATURES = [
  "안경 미착용",
  "조명 좋음",
  "메이크업 없음",
  "피부 가림 없음",
];

function isFaceAligned(detection, video, faceFrame) {
  const { originX, originY, width, height } = detection.boundingBox;

  const displayWidth = video.clientWidth;
  const displayHeight = video.clientHeight;
  const videoWidth = video.videoWidth;
  const videoHeight = video.videoHeight;

  if (!displayWidth || !displayHeight || !videoWidth || !videoHeight) {
    return false;
  }

  // object-fit: cover에 맞게 MediaPipe 좌표를 화면 좌표로 변환
  const scale = Math.max(displayWidth / videoWidth, displayHeight / videoHeight);
  const offsetX = (videoWidth * scale - displayWidth) / 2;
  const offsetY = (videoHeight * scale - displayHeight) / 2;

  let faceCenterX = (originX + width / 2) * scale - offsetX;
  const faceCenterY = (originY + height / 2) * scale - offsetY;
  const faceWidth = width * scale;

  // 화면이 좌우 반전되어 있으므로 X 좌표도 반전
  faceCenterX = displayWidth - faceCenterX;

  const videoRect = video.getBoundingClientRect();
  const guideRect = faceFrame.getBoundingClientRect();

  const guideCenterX = guideRect.left - videoRect.left + guideRect.width / 2;
  const guideCenterY = guideRect.top - videoRect.top + guideRect.height / 2;

  const centeredX = Math.abs(faceCenterX - guideCenterX) < guideRect.width * 0.22;
  const centeredY = Math.abs(faceCenterY - guideCenterY) < guideRect.height * 0.22;

  const rightSize =
    faceWidth > guideRect.width * 0.55 && faceWidth < guideRect.width * 1.05;

  return centeredX && centeredY && rightSize;
}

// 현재 카메라 화면을 3:4 비율로 캡처
function captureThreeByFour(video) {
  const canvas = document.createElement("canvas");

  const targetWidth = 402;
  const targetHeight = 536;
  const targetRatio = targetWidth / targetHeight;

  const videoWidth = video.videoWidth;
  const videoHeight = video.videoHeight;
  const videoRatio = videoWidth / videoHeight;

  let sourceX = 0;
  let sourceY = 0;
  let sourceWidth = videoWidth;
  let sourceHeight = videoHeight;

  if (videoRatio > targetRatio) {
    sourceWidth = videoHeight * targetRatio;
    sourceX = (videoWidth - sourceWidth) / 2;
  } else {
    sourceHeight = videoWidth / targetRatio;
    sourceY = (videoHeight - sourceHeight) / 2;
  }

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext("2d");

  // 사용자가 보는 화면과 동일하게 좌우 반전
  ctx.translate(targetWidth, 0);
  ctx.scale(-1, 1);

  ctx.drawImage(
    video,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    targetWidth,
    targetHeight,
  );

  return canvas.toDataURL("image/jpeg", 0.92);
}

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 812px;
  background: #1e1b2e;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  overflow: hidden;
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
  flex-shrink: 0;
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
  height: 536px;
  flex-shrink: 0;
  overflow: hidden;
`;

const Video = styled.video`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scaleX(-1);
`;

const FaceFrameWrapper = styled.div`
  position: absolute;
  top: 100px;
  left: 58px;
  width: 286px;
  height: 300px;
  pointer-events: none;
`;

const BottomSection = styled.div`
  width: 100%;
  height: 203px;
  padding: 24px 98px 60px 99px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 28px;
  flex-shrink: 0;
`;

const GuideText = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.65);
  text-align: center;
  white-space: nowrap;
  font-family: "Pretendard Variable";
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

const CaptureButton = styled.button`
  width: 72px;
  height: 72px;
  flex-shrink: 0;
  border: none;
  background: none;
  padding: 0;
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.45 : 1)};
  transition: opacity 0.2s ease;

  img {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

const ConfirmWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 812px;
  background: #fff;
  box-sizing: border-box;
  overflow: hidden;
`;

const ConfirmHeader = styled.div`
  width: 100%;
  height: 70px;
  background: #fff;
`;

const PreviewImage = styled.img`
  display: block;
  width: 100%;
  height: 536px;
  object-fit: cover;
`;

export default function TodaySkinCamera() {
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const faceFrameRef = useRef(null);
  const detectorRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const lastVideoTimeRef = useRef(-1);
  const notAlignedSinceRef = useRef(null);

  const [detected, setDetected] = useState(false);
  const [faceAligned, setFaceAligned] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [alignmentTimeout, setAlignmentTimeout] = useState(false);

  const [step, setStep] = useState("shoot");
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [photoFeatures, setPhotoFeatures] = useState([]);

  useEffect(() => {
    if (step !== "shoot") return undefined;

    let cancelled = false;

    setCameraReady(false);
    setDetected(false);
    setFaceAligned(false);
    setAlignmentTimeout(false);

    lastVideoTimeRef.current = -1;
    notAlignedSinceRef.current = null;

    function detectLoop() {
      const video = videoRef.current;
      const detector = detectorRef.current;
      const faceFrame = faceFrameRef.current;

      if (!video || !detector || !faceFrame) return;

      if (video.videoWidth === 0 || video.videoHeight === 0) {
        rafRef.current = requestAnimationFrame(detectLoop);
        return;
      }

      if (video.currentTime !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = video.currentTime;

        try {
          const now = performance.now();
          const result = detector.detectForVideo(video, now);
          const detection = result.detections[0];

          const hasFace = Boolean(detection);
          setDetected(hasFace);

          const aligned = detection
            ? isFaceAligned(detection, video, faceFrame)
            : false;

          setFaceAligned(aligned);

          if (aligned) {
            notAlignedSinceRef.current = null;
            setAlignmentTimeout(false);
          } else {
            if (notAlignedSinceRef.current === null) {
              notAlignedSinceRef.current = now;
            }

            if (now - notAlignedSinceRef.current >= 10000) {
              setAlignmentTimeout(true);
            }
          }
        } catch (error) {
          console.error("얼굴 감지 오류:", error);
        }
      }

      rafRef.current = requestAnimationFrame(detectLoop);
    }

    async function setup() {
      try {
        const vision = await FilesetResolver.forVisionTasks(WASM_BASE);
        if (cancelled) return;

        const detector = await FaceDetector.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: MODEL_URL,
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          minDetectionConfidence: 0.5,
        });

        if (cancelled) {
          detector.close();
          return;
        }

        detectorRef.current = detector;

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 720 },
            height: { ideal: 1280 },
          },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        const video = videoRef.current;

        if (!video) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        video.srcObject = stream;
        await video.play();

        if (cancelled) return;

        setCameraReady(true);
        detectLoop();
      } catch (error) {
        console.error("카메라 또는 MediaPipe 초기화 실패:", error);
        setCameraReady(false);
      }
    }

    setup();

    return () => {
      cancelled = true;

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = null;

      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;

      detectorRef.current?.close();
      detectorRef.current = null;
    };
  }, [step]);

  const handleBack = () => {
    navigate("/today-skin");
  };

  const handleCapture = () => {
    if (!faceAligned) return;

    const video = videoRef.current;
    if (!video) return;

    const photoDataUrl = captureThreeByFour(video);

    setCapturedPhoto(photoDataUrl);

    // TODO: 이미지 분석 API 연결 후 실제 분석 결과로 교체
    setPhotoFeatures(DEMO_PHOTO_FEATURES);

    setStep("confirm");
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    setPhotoFeatures([]);
    setStep("shoot");
  };

  const handleContinue = () => {
    // 분석 결과 화면으로 바로 가지 않고, 생활 습관을 마저 입력할 수 있도록
    // 폼 화면(TodaySkinForm)으로 돌아가면서 방금 찍은 사진을 함께 넘겨줌
    navigate("/today-skin", {
      state: { capturedPhoto },
    });
  };

  const getGuideText = () => {
    if (!cameraReady) {
      return "카메라를 준비하고 있어요";
    }

    if (alignmentTimeout) {
      if (!detected) {
        return "얼굴이 잘 보이도록 위치를 조정해주세요";
      }

      return "얼굴을 가이드 안에 맞춰주세요";
    }

    if (faceAligned) {
      return "촬영해주세요";
    }

    return "밝은 곳에서 정면을 촬영해주세요";
  };

  return (
    <Wrapper>
      {step === "shoot" ? (
        <>
          <TopBar>
            <BackArrow
              type="button"
              onClick={handleBack}
              aria-label="뒤로 가기"
            >
              ←
            </BackArrow>
            <TitleText>피부 기록하기</TitleText>
          </TopBar>

          <VideoStage>
            <Video ref={videoRef} autoPlay playsInline muted />

            <FaceFrameWrapper ref={faceFrameRef}>
              <FaceFrameGuide color={faceAligned ? "#4EBA69" : "white"} />
            </FaceFrameWrapper>
          </VideoStage>

          <BottomSection>
            <GuideText>{getGuideText()}</GuideText>

            <CaptureButton
              type="button"
              onClick={handleCapture}
              disabled={!faceAligned}
              aria-label="촬영하기"
            >
              <img src={captureIcon} alt="" />
            </CaptureButton>
          </BottomSection>
        </>
      ) : (
        <ConfirmWrapper>
          <ConfirmHeader />

          <PreviewImage
            src={capturedPhoto}
            alt="촬영한 피부 사진"
          />

          <PhotoConfirmSheet
            features={photoFeatures}
            onContinue={handleContinue}
            onRetake={handleRetake}
          />
        </ConfirmWrapper>
      )}
    </Wrapper>
  );
}