import { useState } from "react";
import styled from "styled-components";

const Card = styled.section`
  position: relative;
  padding: 12px;
  border: 1px solid #e9e9e9;
  border-radius: 14px;
  background: #fff;
`;

const InfoButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  display: grid;
  width: 15px;
  height: 15px;
  place-items: center;
  padding: 0;
  border: 1px solid #777;
  border-radius: 50%;
  background: #fff;
  color: #555;
  font-size: 10px;
  cursor: pointer;
`;

const Tooltip = styled.div`
  position: absolute;
  top: 34px;
  right: 10px;
  z-index: 3;
  width: 188px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #9b6dff;
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  line-height: 1.45;

  &::after {
    position: absolute;
    top: -7px;
    right: 8px;
    border-right: 7px solid transparent;
    border-bottom: 8px solid #9b6dff;
    border-left: 7px solid transparent;
    content: "";
  }
`;

// 트러블(top) → 유분(우상단) → 칙칙함(우하단) → 수분(좌하단) → 탄력(좌상단) 순,
// 기존 하드코딩 좌표(0,-70 / 67,-22 / 41,57 / -41,57 / -67,-22)와 각도가 일치하도록 맞춘 값.
const ANGLES = [-90, -18, 54, 126, 198];
const MAX_RADIUS = 70;
const EMPTY_SCORE = 1; // 데이터 없을 때 중심에 거의 붙어있도록 하는 최소값

const PHASE_META = {
  MENSTRUATION: { label: "생리기", color: "#ff7d7d", fill: "rgba(255,125,125,0.15)" },
  OVULATION: { label: "배란기", color: "#78d4d5", fill: "rgba(120,212,213,0.12)" },
  LUTEAL: { label: "황체기", color: "#b495ff", fill: "rgba(180,149,255,0.12)" },
};

// scores: [트러블, 유분, 칙칙함, 수분, 탄력] (각 0~100). 없으면 EMPTY_SCORE로 대체.
function buildPolygonPoints(scores) {
  return ANGLES.map((angle, index) => {
    const rawScore = scores?.[index];
    const score = typeof rawScore === "number" ? rawScore : EMPTY_SCORE;
    const clamped = Math.max(0, Math.min(100, score));
    const radius = (clamped / 100) * MAX_RADIUS;
    const rad = (angle * Math.PI) / 180;
    const x = radius * Math.cos(rad);
    const y = radius * Math.sin(rad);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

// data 예시: { MENSTRUATION: [40, 60, 55, 30, 50], OVULATION: [...], LUTEAL: [...] }
// 특정 phase가 없으면 해당 도형은 중심에 모인 점으로 표시됨 (숨겨지지 않음).
export default function PhaseRadarChart({ data = {} }) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  return (
    <Card>
      <InfoButton
        type="button"
        aria-label="그래프 설명 보기"
        aria-expanded={isTooltipOpen}
        onClick={() => setIsTooltipOpen((current) => !current)}
      >
        i
      </InfoButton>

      {isTooltipOpen && (
        <Tooltip>
          탄력 · 수분은 높을수록 좋고,<br />
          트러블 · 칙칙함 · 유분은 낮을수록 좋아요.
        </Tooltip>
      )}

      <svg viewBox="0 0 340 210" width="100%" role="img" aria-label="주기 단계별 피부 비교 차트">
        <g fontSize="10" fill="#8a8a8a">
          <circle cx="10" cy="12" r="4" fill={PHASE_META.MENSTRUATION.color} />
          <text x="20" y="16">{PHASE_META.MENSTRUATION.label}</text>
          <circle cx="10" cy="28" r="4" fill={PHASE_META.OVULATION.color} />
          <text x="20" y="32">{PHASE_META.OVULATION.label}</text>
          <circle cx="10" cy="44" r="4" fill={PHASE_META.LUTEAL.color} />
          <text x="20" y="48">{PHASE_META.LUTEAL.label}</text>
        </g>

        <g transform="translate(170 118)" fill="none" stroke="#e4e4e4">
          <polygon points="0,-70 67,-22 41,57 -41,57 -67,-22" />
          <polygon points="0,-52 49,-16 30,42 -30,42 -49,-16" />
          <polygon points="0,-34 32,-10 20,27 -20,27 -32,-10" />
          <line x1="0" y1="0" x2="0" y2="-70" />
          <line x1="0" y1="0" x2="67" y2="-22" />
          <line x1="0" y1="0" x2="41" y2="57" />
          <line x1="0" y1="0" x2="-41" y2="57" />
          <line x1="0" y1="0" x2="-67" y2="-22" />

          <polygon
            points={buildPolygonPoints(data.MENSTRUATION)}
            fill={PHASE_META.MENSTRUATION.fill}
            stroke={PHASE_META.MENSTRUATION.color}
          />
          <polygon
            points={buildPolygonPoints(data.OVULATION)}
            fill={PHASE_META.OVULATION.fill}
            stroke={PHASE_META.OVULATION.color}
          />
          <polygon
            points={buildPolygonPoints(data.LUTEAL)}
            fill={PHASE_META.LUTEAL.fill}
            stroke={PHASE_META.LUTEAL.color}
          />
        </g>

        <g fontSize="10" fill="#858585">
          <text x="157" y="42">트러블</text>
          <text x="244" y="100">유분</text>
          <text x="205" y="190">칙칙함</text>
          <text x="115" y="190">수분</text>
          <text x="59" y="100">탄력</text>
        </g>
      </svg>
    </Card>
  );
}