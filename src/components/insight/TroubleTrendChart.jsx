import dayjs from "dayjs";
import styled from "styled-components";
import { findCurrentCycle } from "../../utils/cyclePhase";

const Card = styled.section`
  padding: 14px 12px 10px;
  border: 1px solid #e9e9e9;
  border-radius: 14px;
  background: #fff;
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 150px;
  color: #999;
  font-size: 12px;
  text-align: center;
`;

const CHART_WIDTH = 340;
const CHART_HEIGHT = 150;
const AXIS_Y = 110;
const PLOT_LEFT = 18;
const PLOT_RIGHT = 322;
const DAY_RANGE = 14; // D-14 ~ D+14

function dayToX(day) {
  const ratio = (day + DAY_RANGE) / (DAY_RANGE * 2);
  return PLOT_LEFT + ratio * (PLOT_RIGHT - PLOT_LEFT);
}

// points를 x,y 좌표로 변환
function toCoords(points) {
  const scores = points.map((p) => p.score);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  const scoreRange = maxScore - minScore || 1;

  const TOP_Y = 20;
  const BOTTOM_Y = AXIS_Y - 5;

  return points.map((p) => {
    const x = dayToX(p.day);
    const normalized = (p.score - minScore) / scoreRange;
    const y = BOTTOM_Y - normalized * (BOTTOM_Y - TOP_Y);
    return [x, y];
  });
}

// Catmull-Rom → Cubic Bezier 변환으로 부드러운 곡선 생성
function buildSmoothPath(points) {
  if (!points || points.length === 0) return "";

  const coords = toCoords(points);

  if (coords.length === 1) {
    const [x, y] = coords[0];
    return `M${x} ${y}`;
  }

  let d = `M${coords[0][0]} ${coords[0][1]}`;

  for (let i = 0; i < coords.length - 1; i += 1) {
    const p0 = coords[i - 1] ?? coords[i];
    const p1 = coords[i];
    const p2 = coords[i + 1];
    const p3 = coords[i + 2] ?? p2;

    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;

    d += ` C${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2[0]} ${p2[1]}`;
  }

  return d;
}

const AXIS_LABELS = [
  { label: "D -14", day: -14 },
  { label: "D -7", day: -7 },
  { label: "생리 시작", day: 0 },
  { label: "D +7", day: 7 },
  { label: "D +14", day: 14 },
];

// skinRecords: { "2026-08-01": { troubleScore: 42, ... }, ... } 형태를 가정.
// TODO: 실제 필드명이 troubleScore가 아니면 아래 한 줄만 고치면 됨.
export function buildTroubleDataFromRecords(cycleStartDate, skinRecords) {
  if (!cycleStartDate || !skinRecords) return [];

  const points = [];
  for (let day = -DAY_RANGE; day <= DAY_RANGE; day += 1) {
    const dateStr = dayjs(cycleStartDate).add(day, "day").format("YYYY-MM-DD");
    const record = skinRecords[dateStr];
    if (record && typeof record.troubleScore === "number") {
      points.push({ day, score: record.troubleScore });
    }
  }
  return points;
}

// periodCycles + skinRecords가 실제로 있어야만 그래프를 그림.
// 기록이 없으면 mock으로 대체하지 않고 빈 상태를 보여줌.
export default function TroubleTrendChart({ periodCycles = [], skinRecords = {} }) {
  const today = dayjs().format("YYYY-MM-DD");
  const currentCycle = findCurrentCycle(periodCycles, today);

  const chartData = currentCycle
    ? buildTroubleDataFromRecords(currentCycle.cycleStartDate, skinRecords)
    : [];

  if (chartData.length === 0) {
    return (
      <Card>
        <EmptyState>
          아직 기록된 피부 데이터가 없어요.
          <br />
          투데이스킨을 기록하면 그래프가 표시돼요.
        </EmptyState>
      </Card>
    );
  }

  const highlightHalfWidth = (PLOT_RIGHT - PLOT_LEFT) / (DAY_RANGE * 2);
  const centerX = dayToX(0);

  return (
    <Card>
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        width="100%"
        role="img"
        aria-label="트러블 지수 변화 그래프"
      >
        <rect
          x={centerX - highlightHalfWidth}
          y="14"
          width={highlightHalfWidth * 2}
          height="96"
          fill="#f0e9ff"
        />

        <line
          x1={centerX}
          y1="14"
          x2={centerX}
          y2={AXIS_Y}
          stroke="#9b7af8"
          strokeWidth="1"
          strokeDasharray="3 3"
        />

        <line
          x1={PLOT_LEFT}
          y1={AXIS_Y}
          x2={PLOT_RIGHT}
          y2={AXIS_Y}
          stroke="#b8b8b8"
          strokeWidth="1"
        />

        <path
          d={buildSmoothPath(chartData)}
          fill="none"
          stroke="#9b7af8"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {AXIS_LABELS.map(({ label, day }) => {
          const x = dayToX(day);
          return (
            <g key={label}>
              <circle cx={x} cy={AXIS_Y} r="2.2" fill="#989898" />
              <text x={x} y="130" fill="#858585" fontSize="10" textAnchor="middle">
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </Card>
  );
}