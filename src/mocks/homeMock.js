// 사용자 기본 정보 (User 테이블 대응)
export const MOCK_USER = {
  name: "김끼끼", // 사용자 이름
  skinType: "지성", // 피부 타입 (예: 지성, 건성, 복합성...)
  skinConcern: "블랙헤드", // 피부 고민 (예: 블랙헤드, 홍조, 트러블...)
};

// Period_Cycle 테이블 대응
// 사용자가 매달 실제로 생리 시작/종료를 기록하면 이 배열에 하나씩 쌓입니다.
// - 과거 날짜를 물어보면: 그 시점에 실제로 기록되어 있던 항목이 사용됨
// - 미래 날짜를 물어보면: 가장 최근 기록을 기준으로 자동 예측됨
export const MOCK_PERIOD_CYCLES = [
  {
    cycleStartDate: "2026-06-22", // 생리 시작일
    periodDuration: 5, // 생리 지속 기간 (일)
    predictedCycleLength: 27, // 예상 생리 주기 (일) - 이 기록이 몇 일 주기였는지
  },
  {
    cycleStartDate: "2026-07-20",
    periodDuration: 4,
    predictedCycleLength: 28,
  },
];

// 날짜별 피부 기록 (Today_Skin + AI_Analysis + Detailed_Skin_Analysis 대응)
// 날짜 문자열("YYYY-MM-DD")을 키로 사용해 바로 조회할 수 있게 만든 객체
export const MOCK_SKIN_RECORDS = {
  "2026-08-06": {
    photoUrl: null, // 촬영한 피부 사진 경로 (아직 사진 없으면 null)
    score: 70, // 피부 종합 점수 (0~100), 도넛 차트에 표시됨
    statusText: "피부 상태 보통", // 점수 옆에 붙는 한 줄 라벨 (나쁨/보통/좋음)
    statusSummary: "황체기 피지 분비 증가로 T존 유분·턱 민감도가 높아졌어요.", // 도넛 차트 옆 짧은 요약 문구
    aiInsight: // 화면 하단 "AI 인사이트" 보라색 박스에 들어가는 상세 설명
      "현재 피부는 황체기의 프로게스테론 상승으로 피지선이 활성화된 상태예요. 주 1회 클레이 마스크와 BHA 토너 루틴이 효과적이에요. 과도한 세안은 오히려 피지 분비를 촉진하니 하루 2회를 넘기지 마세요.",

    // 세부 피부 지표 (0~100), "세부 피부 지표" 막대그래프 5개에 각각 대응
    metrics: {
      trouble: 45, // 트러블
      oil: 90, // 유분
      dullness: 65, // 칙칙함
      hydration: 20, // 수분
      elasticity: 50, // 탄력
    },

    // 추천 제품 목록. name: 제품명 / tag: 효능 태그 / price: 가격(원)
    recommendedProducts: [
      { id: 1, name: "COSRX BHA 블랙헤드 파워 리퀴드", tag: "피지 조절", price: 15000 },
      { id: 2, name: "닥터자르트 시카케어 크림", tag: "진정·보습", price: 32000 },
      { id: 3, name: "이니스프리 나이아신아마이드 세럼", tag: "브라이트닝", price: 22000 },
    ],
  },
};

// 주기 단계별 안내 문구 (홈 화면 4번 영역)
// 키는 Cycle_Phase 테이블의 phasetype ENUM 값과 동일하게 맞춤
// MENSTRUATION: 생리기 / FOLLICULAR: 난포기 / OVULATION: 배란기 / LUTEAL: 황체기
export const PHASE_GUIDE = {
  MENSTRUATION: "생리 중엔 피부 장벽이 약해져 건조·민감해지기 쉬워요",
  FOLLICULAR: "난포기엔 피지 분비가 안정되어 컨디션이 좋아지는 시기예요",
  OVULATION: "배란기엔 피지·수분 밸런스가 가장 좋아요. 가벼운 케어로 컨디션을 유지해보세요.",
  LUTEAL: "황체기엔 피지 분비가 늘어 트러블이 생기기 쉬워요",
};

// 주기 단계별 추천 루틴 (홈 화면 6번 영역)
// title: 루틴 카테고리 이름 (스킨케어/행동/운동) / description: 실제 추천 내용
export const PHASE_ROUTINES = {
  MENSTRUATION: [
    { id: 1, title: "오늘의 스킨케어", description: "저자극 수분크림 사용하기" },
    { id: 2, title: "오늘의 행동", description: "따뜻한 물로 반신욕하기" },
    { id: 3, title: "오늘의 운동", description: "무리하지 않는 가벼운 스트레칭" },
  ],
  FOLLICULAR: [
    { id: 1, title: "오늘의 스킨케어", description: "약산성 각질 토너로 턴오버 촉진하기" },
    { id: 2, title: "오늘의 행동", description: "새 스킨케어 제품 패치 테스트해보기" },
    { id: 3, title: "오늘의 운동", description: "평소보다 강도 높은 운동 도전하기" },
  ],
  OVULATION: [
    { id: 1, title: "오늘의 스킨케어", description: "진정 세럼으로 마무리하기" },
    { id: 2, title: "오늘의 행동", description: "물 2L 마시기" },
    { id: 3, title: "오늘의 운동", description: "가벼운 운동하기" },
  ],
  LUTEAL: [
    { id: 1, title: "오늘의 스킨케어", description: "BHA 토너로 모공 관리하기" },
    { id: 2, title: "오늘의 행동", description: "짠 음식·자극적인 음식 줄이기" },
    { id: 3, title: "오늘의 운동", description: "가벼운 유산소로 PMS 완화하기" },
  ],
};