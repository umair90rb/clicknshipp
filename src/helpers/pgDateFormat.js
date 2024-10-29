import { startOfDay, endOfDay, subDays, formatISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

export function getDate(date = new Date()) {
  return formatISO(date, {
    representation: 'complete',
  });
}

export function getStartOfDay(date = new Date()) {
  return formatISO(startOfDay(date), {
    representation: 'complete',
  });
}

export function getEndOfDay(date = new Date()) {
  return formatISO(endOfDay(date), {
    representation: 'complete',
  });
}

export const subtractDaysFromToday = (days) => subtractDays(days);

export function subtractDays(days, date = new Date()) {
  return subDays(date, days);
}

export const getCurrentTimeInTimezone = (timeZone = 'Etc/GMT-5') =>
  formatInTimeZone(new Date(), timeZone, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
