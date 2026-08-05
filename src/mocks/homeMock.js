// 사용자 기본 정보 (User 테이블 대응)
export const MOCK_USER = {
  name: "김끼끼", // 사용자 이름
  skinType: "지성", // 피부 타입 (예: 지성, 건성, 복합성...)
  skinConcerns: ["여드름", "블랙헤드"],  // 피부 고민 (예: 블랙헤드, 홍조, 트러블...). 배열 - SkinInfo 다중 선택과 동일한 구조. 여러 개 넣으면 자동으로 같이 표시됨
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
  "2026-07-30": {
    photoUrl: null, // 촬영한 피부 사진 경로 (아직 사진 없으면 null)
    score: 78, // 피부 종합 점수 (0~100), 도넛 차트에 표시됨
    statusText: "피부 상태 좋음", // 점수 옆에 붙는 한 줄 라벨 (나쁨/보통/좋음)
    statusSummary: "난포기로 접어들며 유분과 수분 밸런스가 안정되고 있어요.", // 도넛 차트 옆 짧은 요약 문구
    aiInsight: // 화면 하단 "AI 인사이트" 보라색 박스에 들어가는 상세 설명
      "현재 피부는 난포기의 영향으로 피지 분비가 비교적 안정된 상태예요. 피부 컨디션이 좋은 시기이지만 과도한 각질 제거는 피하고, 수분 세럼과 가벼운 보습제로 현재 상태를 유지해보세요.",

    // 세부 피부 지표 (0~100), "세부 피부 지표" 막대그래프 5개에 각각 대응
    metrics: {
      trouble: 25, // 트러블
      oil: 45, // 유분
      dullness: 35, // 칙칙함
      hydration: 70, // 수분
      elasticity: 65, // 탄력
    },

    // 추천 제품 목록. name: 제품명 / tag: 효능 태그 / price: 가격(원)
    recommendedProducts: [
      { id: 1, name: "라운드랩 자작나무 수분 세럼", tag: "수분 충전", price: 24000 },
      { id: 2, name: "에스트라 아토베리어 로션", tag: "장벽 보습", price: 31000 },
      { id: 3, name: "아누아 어성초 토너", tag: "진정", price: 23000 },
    ],
  },

  "2026-08-01": {
    photoUrl: null,
    score: 82,
    statusText: "피부 상태 좋음",
    statusSummary: "피부 유분이 안정되고 수분감과 탄력이 좋아지고 있어요.",
    aiInsight:
      "난포기에는 피부 회복력이 높아지고 유수분 밸런스가 안정되는 편이에요. 새로운 제품을 사용하고 싶다면 얼굴 전체에 바르기 전에 턱선이나 귀 뒤쪽에 먼저 테스트해보세요.",

    metrics: {
      trouble: 20,
      oil: 40,
      dullness: 30,
      hydration: 78,
      elasticity: 72,
    },

    recommendedProducts: [
      { id: 1, name: "토리든 다이브인 세럼", tag: "수분 보충", price: 22000 },
      { id: 2, name: "일리윤 세라마이드 아토 크림", tag: "보습 장벽", price: 18000 },
      { id: 3, name: "구달 청귤 비타C 세럼", tag: "브라이트닝", price: 28000 },
    ],
  },

  "2026-08-03": {
    photoUrl: null,
    score: 85,
    statusText: "피부 상태 좋음",
    statusSummary: "배란기로 유분과 수분 밸런스가 가장 안정적인 상태예요.",
    aiInsight:
      "현재 피부는 배란기의 영향으로 수분감과 탄력이 비교적 좋은 상태예요. 무거운 제품을 여러 겹 사용하기보다는 가벼운 수분 세럼과 진정 크림으로 현재의 피부 균형을 유지해보세요.",

    metrics: {
      trouble: 15,
      oil: 48,
      dullness: 22,
      hydration: 85,
      elasticity: 80,
    },

    recommendedProducts: [
      { id: 1, name: "웰라쥬 히알루로닉 앰플", tag: "수분 유지", price: 25000 },
      { id: 2, name: "닥터지 레드 블레미쉬 크림", tag: "수분·진정", price: 36000 },
      { id: 3, name: "라로슈포제 시카플라스트 밤", tag: "피부 진정", price: 39000 },
    ],
  },

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