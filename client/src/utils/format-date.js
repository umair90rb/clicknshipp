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

export const getDate = (date) => date.split('T')[0];
