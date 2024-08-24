export function getStartOfDay(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}T00:00`;
}

export function getEndOfDay(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}T23:59`;
}

export function subtractDaysFromToday(days) {
  const today = new Date();
  today.setDate(today.getDate() - days);
  return getEndOfDay(today);
}
