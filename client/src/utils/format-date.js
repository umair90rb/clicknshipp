import { startOfDay, endOfDay, format, formatDistanceToNow, isToday, subDays, addDays, parse, parseISO } from 'date-fns';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default (date = new Date().toISOString()) => {
  const dateObj = new Date(date);
  const day = dateObj.getDay();
  const month = dateObj.getMonth();
  const year = dateObj.getFullYear();
  const hours = dateObj.getHours();
  const min = dateObj.getMinutes();
  const ampm = hours < 12 ? 'AM' : 'PM';

  return `${MONTHS[month]} ${day} ${year} at ${hours < 12 ? hours : hours - 12}:${min} ${ampm}`;
};

export const getDate = (date = '') => date?.split('T')[0];

export const getStartOfDay = (date = new Date()) => startOfDay(format(date, 'yyyy-MM-dd HH:mm:ss.SSS XXX"'));

export const getEndOfDay = (date = new Date()) => endOfDay(format(date, 'yyyy-MM-dd HH:mm:ss.SSS XXX"'));

export const formatDate = (formatStr = 'dd/MM/yyyy', date = new Date()) => format(date, formatStr);

export const parseAndFormatDate = (date, from = 'dd/MM/yyyy hh:mm:ss a', to = 'dd/MM/yyyy') =>
  formatDate(to, parse(date, from, new Date()));

export const parseTimestampToDate = (date, formatStr = 'dd MMM yyyy') => format(parseISO(date), formatStr);

export const parseTimestamp = (date, formatStr = 'dd/MM/yyyy hh:mm:ss a') => format(parseISO(date), formatStr);

export const formatDistance = (date) => formatDistanceToNow(date, { addSuffix: true });

export const isItToday = (date) => isToday(date);

export const subtractDaysFromToday = (days) => subtractDays(days);

export function subtractDays(days, date = new Date()) {
  return subDays(date, days);
}

export const addDaysToCurrentDate = (days) => addDaysTo(days);

export function addDaysTo(days, date = new Date()) {
  return addDays(date, days);
}

export function formatDateTime(dateTimeString, omitYearAndSec = false) {
  if (!dateTimeString) {
    return 'None';
  }
  const date = new Date(dateTimeString);

  const options = {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  };
  if (!omitYearAndSec) {
    options.year = 'numeric';
    options.second = 'numeric';
  }

  return date.toLocaleString('en-US', options);
}
