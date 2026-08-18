import styled from "styled-components";

const Card = styled.section`
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  border: 1px solid #e9e9e9;
  border-radius: 14px;
  background: #fff;
`;

const ANGLES = [-90, -18, 54, 126, 198];
const MAX_RADIUS = 72;
const EMPTY_SCORE = 1;

const PHASE_META = {
  MENSTRUATION: {
    label: "생리기",
    color: "#FC7476",
  },
  OVULATION: {
    label: "배란기",
    color: "#6FC6C2",
  },
  LUTEAL: {
    label: "황체기",
    color: "#C09EF0",
  },
};

function buildGridPoints(radius) {
  return ANGLES.map((angle) => {
    const radian = (angle * Math.PI) / 180;

    return `${(radius * Math.cos(radian)).toFixed(1)},${(
      radius * Math.sin(radian)
    ).toFixed(1)}`;
  }).join(" ");
}

function buildPolygonPoints(scores) {
  return ANGLES.map((angle, index) => {
    const rawScore = scores?.[index];
    const score =
      typeof rawScore === "number" ? rawScore : EMPTY_SCORE;
    const clamped = Math.max(0, Math.min(100, score));
    const radius = (clamped / 100) * MAX_RADIUS;
    const radian = (angle * Math.PI) / 180;

    return `${(radius * Math.cos(radian)).toFixed(1)},${(
      radius * Math.sin(radian)
    ).toFixed(1)}`;
  }).join(" ");
}

export default function PhaseRadarChart({ data = {} }) {
  return (
    <Card>
      <svg
        viewBox="0 0 340 177"
        width="100%"
        role="img"
        aria-label="주기 단계별 피부 비교 차트"
      >
        <g fontSize="12" fill="#8a8a8a">
          {Object.entries(PHASE_META).map(
            ([phase, meta], index) => (
              <g key={phase}>
                <circle
                  cx="10"
                  cy={12 + index * 16}
                  r="4"
                  fill={meta.color}
                />
                <text x="20" y={16 + index * 16}>
                  {meta.label}
                </text>
              </g>
            ),
          )}
        </g>

        <g
          transform="translate(170 95)"
          fill="none"
          stroke="#e4e4e4"
        >
          {[1, 0.75, 0.5].map((ratio) => (
            <polygon
              key={ratio}
              points={buildGridPoints(MAX_RADIUS * ratio)}
            />
          ))}

          {ANGLES.map((angle) => {
            const radian = (angle * Math.PI) / 180;

            return (
              <line
                key={angle}
                x1="0"
                y1="0"
                x2={MAX_RADIUS * Math.cos(radian)}
                y2={MAX_RADIUS * Math.sin(radian)}
              />
            );
          })}

          {Object.entries(PHASE_META).map(([phase, meta]) => (
            <polygon
              key={phase}
              points={buildPolygonPoints(data[phase])}
              fill="none"
              stroke={meta.color}
              strokeWidth="1.2"
            />
          ))}
        </g>

        <g fontSize="10" fill="#858585">
          <text x="155" y="15">트러블</text>
          <text x="244" y="75">유분</text>
          <text x="205" y="170">칙칙함</text>
          <text x="116" y="170">수분</text>
          <text x="77" y="75">탄력</text>
        </g>
      </svg>
    </Card>
  );
}