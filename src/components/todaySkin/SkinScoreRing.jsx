import { useId } from "react";

export default function SkinScoreRing({ progress, size = 100, strokeWidth = 18 }) {
  const gradientId = useId();

  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const filledLength = progress * circumference;

  const scale = size / 100;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1={111.5 * scale}
          y1={116 * scale}
          x2={0}
          y2={54.5 * scale}
        >
          <stop stopColor="#D0BBF6" />
          <stop offset="1" stopColor="#9B6CE8" />
        </linearGradient>
      </defs>

      {/* 배경 트랙 */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="#F0E8FF"
        strokeWidth={strokeWidth}
      />

      {/* 점수만큼 채워지는 그라데이션 원 */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={strokeWidth}
        strokeLinecap="butt"
        strokeDasharray={`${filledLength} ${circumference}`}
        transform={`rotate(-90 ${center} ${center})`}
      />
    </svg>
  );
}