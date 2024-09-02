import { startOfDay, endOfDay, subDays, formatISO } from "date-fns";

export function getStartOfDay(date = new Date()) {
  return formatISO(startOfDay(date), {
    representation: "complete",
  });
}

export function getEndOfDay(date = new Date()) {
  return formatISO(endOfDay(date), {
    representation: "complete",
  });
}

export const subtractDaysFromToday = (days) => subtractDays(days);

export function subtractDays(days, date = new Date()) {
  return subDays(date, days);
}
