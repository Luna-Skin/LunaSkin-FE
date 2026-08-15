import dayjs from "dayjs";

const POINTS_KEY = "lunaSkinPoints";
const LAST_CLAIMED_DATE_KEY = "lunaSkinPointsLastClaimedDate";

// 여기에 초기값을 직접 둠 (데모 기준값 정해지면 숫자 바꾸기 ~)
const INITIAL_POINTS = 4350;

// 지금까지 쌓인 포인트
export function getPoints() {
  const saved = localStorage.getItem(POINTS_KEY);
  return saved !== null ? Number(saved) : INITIAL_POINTS;
}

// 오늘 이미 받았는지 
export function hasClaimedToday() {
  const lastClaimedDate = localStorage.getItem(LAST_CLAIMED_DATE_KEY);
  return lastClaimedDate === dayjs().format("YYYY-MM-DD");
}

// 오늘 아직 안 받았으면 포인트를 더하고 true 반환, 이미 받았으면 false 반환
export function claimDailyPoints(amount) {
  if (hasClaimedToday()) return false;

  const newTotal = getPoints() + amount;
  localStorage.setItem(POINTS_KEY, String(newTotal));
  localStorage.setItem(LAST_CLAIMED_DATE_KEY, dayjs().format("YYYY-MM-DD"));
  return true;
}