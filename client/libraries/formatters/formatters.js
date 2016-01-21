import moment from 'moment'

export function displayTimeAgo(date) {
  return moment(date).fromNow();
}

export function displayDuration(seconds) {
  return moment.duration(seconds, 'seconds').humanize();
}

export function getDateByDiff(date, diff) {
  return moment(date).add(diff, 'days').toDate();
}

export function getDayOfWeek(date) {
  return moment(date).format('ddd');
}

export function getYearMonthDate(date) {
  return moment(date).format("YYYY-MM-DD");
}

export function getYearMonth(date) {
  return moment(date).format("YYYY-MM");
}

export function isToday(date) {
  return getYearMonthDate(date) == getYearMonthDate(new Date());
}
