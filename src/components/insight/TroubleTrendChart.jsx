import styled from "styled-components";

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
  text-align: center;
  font-size: 12px;
`;

const CHART_WIDTH = 340;
const CHART_HEIGHT = 150;
const AXIS_Y = 110;
const PLOT_LEFT = 18;
const PLOT_RIGHT = 322;
const DAY_RANGE = 14;

const AXIS_LABELS = [
  { label: "D -14", day: -14 },
  { label: "D -7", day: -7 },
  { label: "생리 시작", day: 0 },
  { label: "D +7", day: 7 },
  { label: "D +14", day: 14 },
];

function dayToX(day) {
  const ratio = (day + DAY_RANGE) / (DAY_RANGE * 2);
  return PLOT_LEFT + ratio * (PLOT_RIGHT - PLOT_LEFT);
}

function normalizeTroubleTimeline(timeline) {
  if (!Array.isArray(timeline)) return [];

  return timeline
    .map((item) => ({
      day: Number(item.dayFromStart),
      score: Number(item.troubleIndex),
    }))
    .filter(
      (item) =>
        Number.isFinite(item.day) &&
        Number.isFinite(item.score) &&
        item.day >= -DAY_RANGE &&
        item.day <= DAY_RANGE,
    )
    .sort((a, b) => a.day - b.day);
}

function toCoords(points) {
  const scores = points.map((point) => point.score);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  const scoreRange = maxScore - minScore || 1;

  const topY = 20;
  const bottomY = AXIS_Y - 5;

  return points.map((point) => {
    const normalized = (point.score - minScore) / scoreRange;

    return [
      dayToX(point.day),
      bottomY - normalized * (bottomY - topY),
    ];
  });
}

function buildSmoothPath(points) {
  if (points.length === 0) return "";

  const coords = toCoords(points);

  if (coords.length === 1) {
    return `M${coords[0][0]} ${coords[0][1]}`;
  }

  let path = `M${coords[0][0]} ${coords[0][1]}`;

  for (let index = 0; index < coords.length - 1; index += 1) {
    const p0 = coords[index - 1] ?? coords[index];
    const p1 = coords[index];
    const p2 = coords[index + 1];
    const p3 = coords[index + 2] ?? p2;

    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;

    path += ` C${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2[0]} ${p2[1]}`;
  }

  return path;
}

function getPeakRange(peakRange) {
  const startDay = Number(peakRange?.startDay);
  const endDay = Number(peakRange?.endDay);

  if (
    !Number.isFinite(startDay) ||
    !Number.isFinite(endDay)
  ) {
    return { startDay: 0, endDay: 0 };
  }

  return {
    startDay: Math.max(-DAY_RANGE, Math.min(DAY_RANGE, startDay)),
    endDay: Math.max(-DAY_RANGE, Math.min(DAY_RANGE, endDay)),
  };
}

export default function TroubleTrendChart({
  troubleTimeline = [],
  peakRange,
}) {
  const chartData = normalizeTroubleTimeline(troubleTimeline);

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

  const { startDay, endDay } = getPeakRange(peakRange);
  const rangeStart = Math.min(startDay, endDay);
  const rangeEnd = Math.max(startDay, endDay);
  const startX = dayToX(rangeStart);
  const endX = dayToX(rangeEnd);
  const highlightWidth = Math.max(endX - startX, 10);

  const coords = toCoords(chartData);

  return (
    <Card>
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        width="100%"
        role="img"
        aria-label="트러블 지수 변화 그래프"
      >
        <rect
          x={startX - 5}
          y="14"
          width={highlightWidth + 10}
          height="96"
          fill="#f0e9ff"
        />

        <line
          x1={startX}
          y1="14"
          x2={startX}
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

        {coords.map(([x, y], index) => (
          <circle
            key={`${chartData[index].day}-${chartData[index].score}`}
            cx={x}
            cy={y}
            r="2.5"
            fill="#9b7af8"
          />
        ))}

        {AXIS_LABELS.map(({ label, day }) => {
          const x = dayToX(day);

          return (
            <g key={label}>
              <circle cx={x} cy={AXIS_Y} r="2.2" fill="#989898" />
              <text
                x={x}
                y="130"
                fill="#858585"
                fontSize="10"
                textAnchor="middle"
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </Card>
  );
}