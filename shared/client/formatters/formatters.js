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
export function getFirstVisualDay(year, month) {
  return moment({year, month, day: 1}).startOf('week').toDate();
}
export function getLastVisualDay(year, month) {
  return moment({year, month, day: 1}).endOf('month').endOf('week').toDate();
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
export function getPrevQuarter(year, quarter) {
  if (quarter === 1) {
    return {year: year - 1, quarter: 4};
  }
  return {year: year, quarter: quarter - 1};
}
export function getNextQuarter(year, quarter) {
  if (quarter === 4) {
    return {year: year + 1, quarter: 1};
  }
  return {year: year, quarter: quarter + 1};
}
export function printQuarter(year, quarter) {
  const firstMonth = (quarter * 3) - 3;
  const lastMonth = (quarter * 3) - 1;
  const displayFirstMonth = moment().set('month', firstMonth).format('MMM');
  const displayLastMonth = moment().set('month', lastMonth).format('MMM');
  return `${displayFirstMonth} - ${displayLastMonth} ${year}`;
}
export function currentQuarter() {
  return Math.floor(new Date().getMonth() / 3) + 1;
}
export function getQuarterDates(year, quarter) {
  const firstMonth = (quarter * 3) - 3;
  const dates = [];
  dates.push(moment().set({year, month: firstMonth, date: 1}).toDate());
  dates.push(moment().set({year, month: firstMonth + 1, date: 1}).toDate());
  dates.push(moment().set({year, month: firstMonth + 2, date: 1}).toDate());
  return dates;
}
export function getQuarterMonths(year, quarter) {
  const firstMonth = (quarter * 3) - 3;
  return [
    firstMonth,
    firstMonth + 1,
    firstMonth + 2,
  ];
}
