import moment from 'moment';

export function displayTimeAgo(date) {
  return moment(date).fromNow();
}
export function displayDuration(seconds) {
  return moment.duration(seconds, 'seconds').humanize();
}
export function getDaysDifference(date1, date2) {
  return moment.duration(Math.abs(date1.valueOf() - date2.valueOf())).days();
}
export function getDateByDiff(date, diff) {
  return moment(date).add(diff, 'days').toDate();
}
export function getDayOfWeek(date) {
  return moment(date).format('ddd');
}
export function getYearMonthDateTime(date) {
  return moment(date).format('YYYY-MM-DD hh:mm:ss');
}
export function getYearMonthDate(date) {
  return moment(date).format('YYYY-MM-DD');
}
export function getYearMonth(date) {
  return moment(date).format('YYYY-MM');
}
export function isToday(date) {
  return getYearMonthDate(date) == getYearMonthDate(new Date());
}
export function parseDate(datestr) {
  return moment(datestr).toDate();
}
