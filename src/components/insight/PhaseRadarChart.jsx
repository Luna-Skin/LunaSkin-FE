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

export default function PhaseRadarChart() {
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
          <circle cx="10" cy="12" r="4" fill="#ff7d7d" />
          <text x="20" y="16">생리기</text>
          <circle cx="10" cy="28" r="4" fill="#78d4d5" />
          <text x="20" y="32">배란기</text>
          <circle cx="10" cy="44" r="4" fill="#b495ff" />
          <text x="20" y="48">황체기</text>
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
            points="0,-38 43,-14 24,33 -28,38 -40,-13"
            fill="rgba(255,125,125,0.15)"
            stroke="#ff7d7d"
          />
          <polygon
            points="0,-57 52,-17 36,49 -41,57 -55,-18"
            fill="rgba(120,212,213,0.12)"
            stroke="#78d4d5"
          />
          <polygon
            points="0,-68 62,-20 31,43 -33,45 -44,-14"
            fill="rgba(180,149,255,0.12)"
            stroke="#b495ff"
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