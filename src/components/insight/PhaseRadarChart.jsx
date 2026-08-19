import styled from "styled-components";

const Card = styled.section`
  width: 100%;
  box-sizing: border-box;
  padding: 12px;

  border: 1.5px solid rgba(0, 0, 0, 0.1);
  border-radius: 18px;
  background: #fff;

  font-family: "Pretendard Variable", Pretendard, sans-serif;
`;

const ANGLES = [-90, -18, 54, 126, 198];
const MAX_RADIUS = 77.5;
const EMPTY_SCORE = 1;

const PHASE_META = {
  MENSTRUATION: {
    label: "생리기",
    color: "#FA7C7C",
    background: "rgba(250, 124, 124, 0.10)",
  },

  OVULATION: {
    label: "배란기",
    color: "#65C9C5",
    background: "rgba(101, 201, 197, 0.10)",
  },

  LUTEAL: {
    label: "황체기",
    color: "#A985E7",
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
        viewBox="0 0 340 206"
        width="100%"
        role="img"
        aria-label="주기 단계별 피부 비교 차트"
        fontFamily="Pretendard Variable"
      >
        {/* 생리기 / 배란기 / 황체기 범례 */}
        <g
          fontSize="12"
          fontWeight="500"
          fill="#8B8383"
        >
          {Object.entries(PHASE_META).map(
            ([phase, meta], index) => (
              <g key={phase}>
                <circle
                  cx="10"
                  cy={12 + index * 16}
                  r="4"
                  fill={meta.color}
                />

                <text
                  x="20"
                  y={16 + index * 16}
                >
                  {meta.label}
                </text>
              </g>
            ),
          )}
        </g>

        {/* 레이더 차트 */}
        <g transform="translate(169.5 103)">
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

        {/* 피부 지표 */}
        <g
          fontSize="12"
          fontWeight="500"
          fill="#7E7979"
          textAnchor="middle"
        >
          <text x="155" y="18">
            트러블
          </text>

          <text x="249" y="81">
            유분
          </text>

          <text x="208" y="182">
            칙칙함
          </text>

          <text x="112" y="182">
            수분
          </text>

          <text x="71" y="81">
            탄력
          </text>
        </g>
      </svg>
    </Card>
  );
}