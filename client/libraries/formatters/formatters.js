import moment from 'moment'

function displayTimeAgo(date) {
  return moment(date).fromNow();
}

function displayDuration(seconds) {
  return moment.duration(seconds, 'seconds').humanize();
}

export default {
  displayTimeAgo: displayTimeAgo,
  displayDuration: displayDuration
}
