import styled from "styled-components";

const Card = styled.section`
  width: 100%;
  box-sizing: border-box;

  outline: 1.5px rgba(0, 0, 0, 0.1) solid;
  outline-offset: -1.5px;
  border-radius: 18px;
  background: #fff;

  font-family: "Pretendard Variable", Pretendard, sans-serif;
`;

const CHART_WIDTH = 354;
const CHART_HEIGHT = 214;

const ANGLES = [-90, -18, 54, 126, 198];


const MAX_RADIUS = 80.5;


const CENTER_X = 100 + 153 / 2;
const CENTER_Y = 34 + 166 / 2;


const LABEL_GAP = 4;

const LABEL_DEFS = [
  { text: "트러블", angle: -89.5, anchor: "middle", gap: LABEL_GAP, dx: 0, dy: -4 },
  { text: "유분", angle: -14, anchor: "start", gap: LABEL_GAP, dx: 0, dy: 0 },
  { text: "칙칙함", angle: 65, anchor: "start", gap: LABEL_GAP, dx: 1.5, dy: 4 },
  { text: "수분", angle: 115, anchor: "end", gap: LABEL_GAP, dx: -1.5, dy: 4 },
  { text: "탄력", angle: 194, anchor: "end", gap: LABEL_GAP, dx: 0, dy: 0 },
];

const LABELS = LABEL_DEFS.map(
  ({ text, angle, anchor, gap, dx, dy }) => {
    const radian =
      (angle * Math.PI) / 180;

    const radius = MAX_RADIUS + gap;

    return {
      text,
      anchor,
      x:
        CENTER_X +
        radius * Math.cos(radian) +
        dx,
      y:
        CENTER_Y +
        radius * Math.sin(radian) +
        dy,
    };
  },
);

const EMPTY_SCORE = 1;

const PHASE_META = {
  MENSTRUATION: {
    label: "생리기",
    color: "#FA7C7C",
    legendColor: "#FC7476",
    background: "rgba(250, 124, 124, 0.10)",
  },

  OVULATION: {
    label: "배란기",
    color: "#65C9C5",
    legendColor: "#6FC6C2",
    background: "rgba(101, 201, 197, 0.10)",
  },

  LUTEAL: {
    label: "황체기",
    color: "#A985E7",
    legendColor: "#C09EF0",
    background: "rgba(152, 132, 220, 0.10)",
  },
};

function buildGridPoints(radius) {
  return ANGLES.map((angle) => {
    const radian =
      (angle * Math.PI) / 180;

    return `${(
      radius * Math.cos(radian)
    ).toFixed(1)},${(
      radius * Math.sin(radian)
    ).toFixed(1)}`;
  }).join(" ");
}

function buildPolygonPoints(scores) {
  return ANGLES.map((angle, index) => {
    const rawScore = scores?.[index];

    const score =
      typeof rawScore === "number"
        ? rawScore
        : EMPTY_SCORE;

    const clamped = Math.max(
      0,
      Math.min(100, score),
    );

    const radius =
      (clamped / 100) * MAX_RADIUS;

    const radian =
      (angle * Math.PI) / 180;

    return `${(
      radius * Math.cos(radian)
    ).toFixed(1)},${(
      radius * Math.sin(radian)
    ).toFixed(1)}`;
  }).join(" ");
}

export default function PhaseRadarChart({
  data = {},
}) {
  return (
    <Card>
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        width="100%"
        role="img"
        aria-label="주기 단계별 피부 비교 차트"
        fontFamily="Pretendard Variable"
      >
        {/* 생리기 / 배란기 / 황체기 범례 (피그마: left 16, top 16, gap 4) */}
        <g
          fontSize="12"
          fontWeight="500"
          fill="#8B8383"
        >
          {Object.entries(PHASE_META).map(
            ([phase, meta], index) => (
              <g key={phase}>
                <circle
                  cx="20"
                  cy={20 + index * 16}
                  r="4"
                  fill={meta.legendColor}
                />

                <text
                  x="29"
                  y={24 + index * 16}
                >
                  {meta.label}
                </text>
              </g>
            ),
          )}
        </g>

        {/* 레이더 차트 */}
        <g
          transform={`translate(${CENTER_X} ${CENTER_Y})`}
        >
          {/* 가장 바깥쪽 레이더 */}
          <polygon
            points={buildGridPoints(
              MAX_RADIUS,
            )}
            fill="none"
            stroke="#E0E6F1"
            strokeWidth="0.77"
          />

          {/* 내부 기준 레이더 */}
          {[0.75, 0.5].map(
            (ratio) => (
              <polygon
                key={ratio}
                points={buildGridPoints(
                  MAX_RADIUS * ratio,
                )}
                fill="none"
                stroke="#E0E6F1"
                strokeWidth="0.77"
              />
            ),
          )}

          {/* 레이더 기준 축 */}
          {ANGLES.map((angle) => {
            const radian =
              (angle * Math.PI) / 180;

            return (
              <line
                key={angle}
                x1="0"
                y1="0"
                x2={
                  MAX_RADIUS *
                  Math.cos(radian)
                }
                y2={
                  MAX_RADIUS *
                  Math.sin(radian)
                }
                stroke="#E0E6F1"
                strokeWidth="0.77"
              />
            );
          })}

          {/* 주기별 피부 데이터 */}
          {Object.entries(PHASE_META).map(
            ([phase, meta]) => {
              const points =
                buildPolygonPoints(
                  data[phase],
                );

              return (
                <polygon
                  key={phase}
                  points={points}
                  fill={meta.background}
                  stroke={meta.color}
                  strokeWidth="0.77"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              );
            },
          )}
        </g>

        {/*
          피부 지표 (LABEL_DEFS 기반, 위 주석 참고)
        */}
        <g
          fontSize="12"
          fontWeight="500"
          fill="#7E7979"
        >
          {LABELS.map((label) => (
            <text
              key={label.text}
              x={label.x}
              y={label.y}
              textAnchor={label.anchor}
            >
              {label.text}
            </text>
          ))}
        </g>
      </svg>
    </Card>
  );
}
