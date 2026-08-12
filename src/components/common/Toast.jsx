import { useEffect } from "react";
import styled from "styled-components";

const DISPLAY_DURATION = 2500;

const Wrapper = styled.div`
  position: absolute;
  left: 50%;
  bottom: 90px;
  transform: translateX(-50%);
  width: 340px;
  padding: 14px 20px;
  border-radius: 12px;
  background: #f0e8ff;
  color: #5b3e96;
  text-align: center;
  box-sizing: border-box;
  font-family: "Pretendard Variable";
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 1.4;
  z-index: 100;
  pointer-events: none;
`;

// message가 있는 동안만 부모가 이 컴포넌트를 렌더링하는 방식으로 사용.
// 일정 시간 후 자동으로 onDismiss를 호출해서, 부모가 message를 지우도록 알려줌
export default function Toast({ message, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss?.();
    }, DISPLAY_DURATION);

    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  return <Wrapper role="status">{message}</Wrapper>;
}