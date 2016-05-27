import moment from 'moment';

moment.updateLocale('en', {week: {dow: 1}});

export function displayTimeAgo(date) {
  return moment(date).fromNow();
}
export function displayDuration(seconds) {
  return moment.duration(seconds, 'seconds').humanize();
}
export function getDaysDifference(date1, date2) {
  return Math.floor(moment.duration(Math.abs(date1.valueOf() - date2.valueOf())).asDays());
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
export function displayDateMonth(date) {
  return moment(date).format('MM/DD');
}
export function displayTimeAsNumber(date) {
  const hour = date.getHours();
  const minute = date.getMinutes();
  return hour + (minute / 60);
}
export function getTimeFormat(date) {
  return moment(date).format('h:mma');
}
export function isToday(date) {
  return getYearMonthDate(date) === getYearMonthDate(new Date());
}
export function parseDate(datestr) {
  return moment(datestr).toDate();
}
export function getFirstVisualDay(date) {
  return moment(date).startOf('month').startOf('week').toDate();
}
export function getLastVisualDay(date) {
  return moment(date).endOf('month').endOf('week').toDate();
}
export function getWeeksInAMonth(date) {
  return moment(moment(date).endOf('month') - moment(date).startOf('month')).weeks();
}
export function getWeeksBetweenDates(date1, date2) {
  return Math.ceil(moment.duration(date2.getTime() - date1.getTime()).asWeeks());
}
export function getNextMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1); 
}
export function getPrevMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() - 1, 1);
}
export function getStartQuarterFromDate(date) {
  const rem = date.getMonth() % 3;
  return new Date(date.getFullYear(), date.getMonth() - rem, 1);
}
export function getEndOfQuarterFromDate(date) {
  const rem = 2 - date.getMonth() % 3;
  return moment(new Date(date.getFullYear(), date.getMonth() + rem, 1)).endOf('month').toDate();
}
