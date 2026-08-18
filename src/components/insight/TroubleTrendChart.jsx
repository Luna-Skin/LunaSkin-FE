import styled from "styled-components";

const Card = styled.section`
  width: 100%;
  box-sizing: border-box;
  padding: 14px 12px 10px;

  border-radius: 18px;
  outline: 1.5px rgba(0, 0, 0, 0.1) solid;
  outline-offset: -1.5px;

  background: #fff;

  font-family: "Pretendard Variable", Pretendard, sans-serif;
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 150px;

  color: #999;
  text-align: center;

  font-family: "Pretendard Variable", Pretendard, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
`;

const CHART_WIDTH = 340;
const CHART_HEIGHT = 150;

const AXIS_Y = 110;

const PLOT_LEFT = 18;
const PLOT_RIGHT = 322;

const DAY_RANGE = 14;

const AXIS_LABELS = [
  { label: "D - 14", day: -14 },
  { label: "D - 7", day: -7 },
  { label: "생리 시작", day: 0 },
  { label: "D + 7", day: 7 },
  { label: "D + 14", day: 14 },
];

function dayToX(day) {
  const ratio =
    (day + DAY_RANGE) /
    (DAY_RANGE * 2);

  return (
    PLOT_LEFT +
    ratio * (PLOT_RIGHT - PLOT_LEFT)
  );
}

function normalizeTroubleTimeline(
  timeline,
) {
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
  const scores = points.map(
    (point) => point.score,
  );

  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);

  const scoreRange =
    maxScore - minScore || 1;

  const topY = 20;
  const bottomY = AXIS_Y - 5;

  return points.map((point) => {
    const normalized =
      (point.score - minScore) /
      scoreRange;

    return [
      dayToX(point.day),
      bottomY -
        normalized *
          (bottomY - topY),
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

  for (
    let index = 0;
    index < coords.length - 1;
    index += 1
  ) {
    const p0 =
      coords[index - 1] ?? coords[index];

    const p1 = coords[index];

    const p2 = coords[index + 1];

    const p3 =
      coords[index + 2] ?? p2;

    const cp1x =
      p1[0] +
      (p2[0] - p0[0]) / 6;

    const cp1y =
      p1[1] +
      (p2[1] - p0[1]) / 6;

    const cp2x =
      p2[0] -
      (p3[0] - p1[0]) / 6;

    const cp2y =
      p2[1] -
      (p3[1] - p1[1]) / 6;

    path +=
      ` C${cp1x} ${cp1y},` +
      ` ${cp2x} ${cp2y},` +
      ` ${p2[0]} ${p2[1]}`;
  }

  return path;
}

function getPeakRange(peakRange) {
  const startDay = Number(
    peakRange?.startDay,
  );

  const endDay = Number(
    peakRange?.endDay,
  );

  if (
    !Number.isFinite(startDay) ||
    !Number.isFinite(endDay)
  ) {
    return {
      startDay: 0,
      endDay: 0,
    };
  }

  return {
    startDay: Math.max(
      -DAY_RANGE,
      Math.min(DAY_RANGE, startDay),
    ),

    endDay: Math.max(
      -DAY_RANGE,
      Math.min(DAY_RANGE, endDay),
    ),
  };
}

export default function TroubleTrendChart({
  troubleTimeline = [],
  peakRange,
}) {
  const chartData =
    normalizeTroubleTimeline(
      troubleTimeline,
    );

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

  const {
    startDay,
    endDay,
  } = getPeakRange(peakRange);

  /*
   * 생리 시작일은 항상 day = 0.
   *
   * 트러블 기간은 생리 시작일을 기준으로
   * 왼쪽 또는 오른쪽에 붙는다.
   *
   * 예:
   * -5 ~ 0  → 생리 시작일 왼쪽
   *  0 ~ 5  → 생리 시작일 오른쪽
   *
   * 따라서 바와 점선의 기준점이
   * 항상 같은 위치에 놓인다.
   */
  const periodStart =
    Math.min(startDay, endDay);

  const periodEnd =
    Math.max(startDay, endDay);

  const periodStartX =
    dayToX(periodStart);

  const periodEndX =
    dayToX(periodEnd);

  /*
   * 생리 시작일의 x 좌표.
   * 연보라색 영역이 이 위치에서
   * 좌우 어느 한쪽으로 붙도록 사용한다.
   */
  const menstruationStartX =
    dayToX(0);

  /*
   * 트러블 기간이 생리 시작일 기준
   * 왼쪽인지 오른쪽인지 판단한다.
   */
  const isBeforePeriod =
    periodEnd <= 0;

  const isAfterPeriod =
    periodStart >= 0;

  let highlightX;
  let highlightWidth;

  if (isBeforePeriod) {
    /*
     * -5 ~ 0
     *
     * 점선이 오른쪽 끝에 위치하고
     * 연보라색 바가 그 왼쪽에 붙는다.
     */
    highlightX = periodStartX;

    highlightWidth =
      menstruationStartX -
      periodStartX;
  } else if (isAfterPeriod) {
    /*
     * 0 ~ 5
     *
     * 점선이 왼쪽 끝에 위치하고
     * 연보라색 바가 그 오른쪽에 붙는다.
     */
    highlightX =
      menstruationStartX;

    highlightWidth =
      periodEndX -
      menstruationStartX;
  } else {
    /*
     * 혹시 API에서
     * -5 ~ 5처럼 생리 시작일을
     * 기간 내부에 포함해서 내려주는 경우.
     *
     * 이 경우 생리 시작일을 기준으로
     * 전체 트러블 기간을 표현한다.
     */
    highlightX =
      periodStartX;

    highlightWidth =
      periodEndX -
      periodStartX;
  }

  /*
   * 너무 작은 값이 들어와도
   * 점선과 영역이 겹쳐 보이지 않도록
   * 최소 너비를 아주 작게 보정한다.
   */
  highlightWidth = Math.max(
    highlightWidth,
    1,
  );

  return (
    <Card>
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        width="100%"
        role="img"
        aria-label="트러블 지수 변화 그래프"
        fontFamily="Pretendard Variable"
      >
        {/* 
          트러블 기간 영역

          생리 시작일을 기준으로
          왼쪽 또는 오른쪽에 붙는다.
        */}
        {highlightWidth > 0 && (
          <rect
            x={highlightX}
            y="14"
            width={highlightWidth}
            height="96"
            fill="rgba(168.98, 133.03, 231.07, 0.20)"
          />
        )}

        {/* 
          생리 시작일 기준 점선

          반드시 연보라색 바의 한쪽 끝과
          같은 x 좌표를 사용한다.
        */}
        <line
          x1={menstruationStartX}
          y1="14"
          x2={menstruationStartX}
          y2={AXIS_Y}
          stroke="#9B7AF8"
          strokeWidth="1"
          strokeDasharray="3 3"
        />

        {/* 가로축 */}
        <line
          x1={PLOT_LEFT}
          y1={AXIS_Y}
          x2={PLOT_RIGHT}
          y2={AXIS_Y}
          stroke="#B8B8B8"
          strokeWidth="1"
        />

        {/* 
          트러블 지수 곡선

          포인트 원은 제거하고
          매끈한 곡선만 표시한다.
        */}
        <path
          d={buildSmoothPath(chartData)}
          fill="none"
          stroke="#9B7AF8"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 날짜 축 */}
        {AXIS_LABELS.map(
          ({ label, day }) => {
            const x = dayToX(day);

            return (
              <g key={label}>
                {/* 날짜 포인트 */}
                <circle
                  cx={x}
                  cy={AXIS_Y}
                  r="2.2"
                  fill="#828898"
                />

                {/* 날짜 텍스트 */}
                <text
                  x={x}
                  y="130"
                  fill="#828898"
                  fontSize="12"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {label}
                </text>
              </g>
            );
          },
        )}
      </svg>
    </Card>
  );
}