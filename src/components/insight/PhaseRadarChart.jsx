import styled from "styled-components";

const Card = styled.section`
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  border: 1px solid #e9e9e9;
  border-radius: 14px;
  background: #fff;
`;

// ======================================================
// 오각형의 각도
//
//             트러블
//                ↑
//       탄력              유분
//
//       수분              칙칙함
//
// 순서:
// 트러블 → 유분 → 칙칙함 → 수분 → 탄력
// ======================================================
const ANGLES = [-90, -18, 54, 126, 198];
const MAX_RADIUS = 72;
const EMPTY_SCORE = 1;

// ======================================================
// 주기 단계별 색상
// ======================================================
const PHASE_META = {
  MENSTRUATION: {
    label: "생리기",
    color: "#FC7476",
    fill: "#8B8383",
  },

  OVULATION: {
    label: "배란기",
    color: "#6FC6C2",
    fill: "#8B8383",
  },

  LUTEAL: {
    label: "황체기",
    color: "#C09EF0",
    fill: "#8B8383",
  },
};

// ======================================================
// 기준 오각형 좌표 생성
//
// MAX_RADIUS를 기준으로 계산하기 때문에
// MAX_RADIUS 값만 변경해도 모든 기준 오각형이
// 자동으로 같은 비율로 변경됨.
// ======================================================
function buildGridPoints(radius) {
  return ANGLES.map((angle) => {
    const rad = (angle * Math.PI) / 180;

    const x = radius * Math.cos(rad);
    const y = radius * Math.sin(rad);

    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

// ======================================================
// 실제 피부 점수 데이터를 오각형 좌표로 변환
//
// scores 순서:
// [트러블, 유분, 칙칙함, 수분, 탄력]
//
// 점수 범위:
// 0 ~ 100
// ======================================================
function buildPolygonPoints(scores) {
  return ANGLES.map((angle, index) => {
    const rawScore = scores?.[index];

    // 데이터가 없으면 중심에 거의 붙도록 처리
    const score =
      typeof rawScore === "number"
        ? rawScore
        : EMPTY_SCORE;

    // 점수를 0~100 범위로 제한
    const clamped = Math.max(
      0,
      Math.min(100, score)
    );

    // 점수를 실제 그래프 반지름으로 변환
    const radius =
      (clamped / 100) * MAX_RADIUS;

    const rad = (angle * Math.PI) / 180;

    const x = radius * Math.cos(rad);
    const y = radius * Math.sin(rad);

    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

// ======================================================
// 주기 단계별 피부 비교 레이더 차트
// ======================================================
export default function PhaseRadarChart({ data = {} }) {
  return (
    <Card>
      <svg
        viewBox="0 0 340 177"
        width="100%"
        role="img"
        aria-label="주기 단계별 피부 비교 차트"
      >

        {/* ==================================================
            왼쪽 상단 범례

            Insight.jsx의 SectionTitle 아래에 들어가기 때문에
            카드 내부에서 너무 위쪽으로 붙지 않도록 조정
        ================================================== */}
        <g
          fontSize="12"
          fill="#8a8a8a"
        >

          {/* 생리기 */}
          <circle
            cx="10"
            cy="12"
            r="4"
            fill={PHASE_META.MENSTRUATION.color}
          />

          <text
            x="20"
            y="16"
          >
            {PHASE_META.MENSTRUATION.label}
          </text>


          {/* 배란기 */}
          <circle
            cx="10"
            cy="28"
            r="4"
            fill={PHASE_META.OVULATION.color}
          />

          <text
            x="20"
            y="32"
          >
            {PHASE_META.OVULATION.label}
          </text>


          {/* 황체기 */}
          <circle
            cx="10"
            cy="44"
            r="4"
            fill={PHASE_META.LUTEAL.color}
          />

          <text
            x="20"
            y="48"
          >
            {PHASE_META.LUTEAL.label}
          </text>

        </g>


        {/* ==================================================
            레이더 그래프

            중요:
            그래프 중심을 y=125로 설정.

            위쪽 라벨 "트러블"과 그래프 사이에
            적절한 여백을 만들기 위해
            그래프를 카드의 중앙보다 조금 아래쪽에 배치.
        ================================================== */}
        <g
          transform="translate(170 95)"
          fill="none"
          stroke="#e4e4e4"
        >

          {/* ----------------------------------------------
              가장 바깥쪽 기준 오각형
          ---------------------------------------------- */}
          <polygon
            points={buildGridPoints(MAX_RADIUS)}
          />


          {/* ----------------------------------------------
              중간 기준 오각형
          ---------------------------------------------- */}
          <polygon
            points={buildGridPoints(
              MAX_RADIUS * 0.75
            )}
          />


          {/* ----------------------------------------------
              안쪽 기준 오각형
          ---------------------------------------------- */}
          <polygon
            points={buildGridPoints(
              MAX_RADIUS * 0.5
            )}
          />


          {/* ----------------------------------------------
              중심에서 각 꼭짓점으로 뻗는 기준선
          ---------------------------------------------- */}
          {ANGLES.map((angle, index) => {
            const rad =
              (angle * Math.PI) / 180;

            const x =
              MAX_RADIUS * Math.cos(rad);

            const y =
              MAX_RADIUS * Math.sin(rad);

            return (
              <line
                key={index}
                x1="0"
                y1="0"
                x2={x}
                y2={y}
              />
            );
          })}


          {/* ==================================================
              생리기 데이터
          ================================================== */}
          <polygon
            points={buildPolygonPoints(
              data.MENSTRUATION
            )}
            fill={PHASE_META.MENSTRUATION.fill}
            stroke={PHASE_META.MENSTRUATION.color}
          />


          {/* ==================================================
              배란기 데이터
          ================================================== */}
          <polygon
            points={buildPolygonPoints(
              data.OVULATION
            )}
            fill={PHASE_META.OVULATION.fill}
            stroke={PHASE_META.OVULATION.color}
          />


          {/* ==================================================
              황체기 데이터
          ================================================== */}
          <polygon
            points={buildPolygonPoints(
              data.LUTEAL
            )}
            fill={PHASE_META.LUTEAL.fill}
            stroke={PHASE_META.LUTEAL.color}
          />

        </g>


        {/* ==================================================
            그래프 항목 이름

            그래프 중심이 (170, 125)이므로
            각 꼭짓점 바깥쪽에 여백을 두고 배치.
        ================================================== */}
        <g
          fontSize="10"
          fill="#858585"
        >

          {/* ------------------------------------------------
              트러블
              그래프 최상단 바깥
          ------------------------------------------------ */}
          <text
            x="155"
            y="15"
          >
            트러블
          </text>


          {/* ------------------------------------------------
              유분
              오른쪽 위
          ------------------------------------------------ */}
          <text
            x="244"
            y="75"
          >
            유분
          </text>


          {/* ------------------------------------------------
              칙칙함
              오른쪽 아래
          ------------------------------------------------ */}
          <text
            x="205"
            y="170"
          >
            칙칙함
          </text>


          {/* ------------------------------------------------
              수분
              왼쪽 아래
          ------------------------------------------------ */}
          <text
            x="116"
            y="170"
          >
            수분
          </text>


          {/* ------------------------------------------------
              탄력
              왼쪽 위
          ------------------------------------------------ */}
          <text
            x="77"
            y="75"
          >
            탄력
          </text>

        </g>

      </svg>
    </Card>
  );
}