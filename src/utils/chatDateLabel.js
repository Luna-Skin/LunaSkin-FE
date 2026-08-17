export function getChatDateLabel(timestamp) {
  const date = new Date(timestamp);
  const today = new Date();

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(date, today)) return "오늘";

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (isSameDay(date, yesterday)) return "어제";

  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}