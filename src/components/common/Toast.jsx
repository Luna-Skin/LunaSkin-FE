import { useEffect } from "react";
import styled, { keyframes } from "styled-components";

const DISPLAY_DURATION = 2000;
const FADE_DURATION = 500;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`;

const Wrapper = styled.div`
  position: absolute;
  top: 260px;
  z-index: 100;
  margin-left: 26px;

  display: inline-flex;
  width: 334px;
  padding: 16px 24px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;

  border-radius: 18px;
  border: 1px solid rgba(0, 0, 0, 0);
  background: #f0e8ff;
  box-shadow: 0 30px 150px 0 rgba(0, 0, 0, 0.3);

  color: #9a71df;
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;

  box-sizing: border-box;
  pointer-events: none;

  animation: ${fadeOut} ${FADE_DURATION}ms ease-out forwards;
  animation-delay: ${DISPLAY_DURATION - FADE_DURATION}ms;
`;

export default function Toast({ message, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss?.();
    }, DISPLAY_DURATION);

    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  return <Wrapper role="status">{message}</Wrapper>;
}