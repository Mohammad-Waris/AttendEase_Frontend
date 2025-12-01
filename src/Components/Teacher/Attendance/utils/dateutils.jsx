// utils/dateUtils.js
export const formatDateKey = (date) => {
  return date.toISOString().split('T')[0];
};

export const isSameDay = (dateA, dateB) => {
  return dateA.toDateString() === dateB.toDateString();
};

export const isToday = (date) => {
  return isSameDay(date, new Date());
};

export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay(); // 0 = Sunday, 1 = Monday, etc.
};

export const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa',];