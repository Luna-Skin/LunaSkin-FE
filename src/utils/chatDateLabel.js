// 오늘이면 "오전 3:24"처럼 시간, 오늘이 아니면 날짜(월/일 또는 연/월/일)로 표시
export function getChatDateLabel(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();

  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isToday) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours < 12 ? "오전" : "오후";
    const displayHour = hours % 12 === 0 ? 12 : hours % 12;
    return `${period} ${displayHour}:${String(minutes).padStart(2, "0")}`;
  }

  const isSameYear = date.getFullYear() === now.getFullYear();
  return isSameYear
    ? `${date.getMonth() + 1}월 ${date.getDate()}일`
    : `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}