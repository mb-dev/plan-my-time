import moment from 'moment'

function displayTimeAgo(date) {
  return moment(date).fromNow();
}

export default {
  displayTimeAgo: displayTimeAgo
}
