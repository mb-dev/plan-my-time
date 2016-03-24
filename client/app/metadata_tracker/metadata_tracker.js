import timeTracker from '../time_tracker/time_tracker';
import store from '../../stores/store';
import actions from '../../actions/actions';
import * as formatters from '../../libraries/formatters/formatters';

function getSeconds(date) {
  return date.getTime() / 1000;
}

function getEndTimeSeconds(item) {
  return getSeconds(item.start_time) + item.duration;
}

export default class MetadataTracker {
  constructor() {
    timeTracker.add(this.onTick);
  }
  unsubscribe() {
    timeTracker.remove(this.onTick);
  }
  onTick() {
    if (!store.state.metadata) {
      return;
    }
    let metadata = store.state.metadata.metadata;
    if (!metadata) {
      return;
    }
    let dateStr = formatters.getYearMonthDate(store.state.date);
    let found = false;
    for (let metaForDay of metadata) {
      if (metaForDay.date == dateStr) {
        metadata = metaForDay;
        found = true;
        break;
      }
    }
    if (!found) {
      return;
    }
    metadata = metadata.tasks;

    let currentTask = store.state.currentTask;
    let nextTask = store.state.nextTask;
    let currentPercent = store.state.currentPercent;
    let timeNow = new Date();

    let len = metadata.length;
    for (var i=len - 1; i >= 0; --i) {
      let startDate = formatters.parseDate(metadata[i].start_time);
      if (startDate <= timeNow.getTime()) {
        if (currentTask != metadata[i]) {
          actions.updateCurrentTask(metadata[i]);
          console.log('updated current task');
        }
        if (i+1 < metadata.length && nextTask != metadata[i+1]) {
          actions.updateNextTask(metadata[i+1]);
          nextTask = metadata[i+1];
          console.log('updated next task');
        }
        if (!nextTask) {
          break;
        }
        let startMs = startDate.getTime();
        let endMs = startMs + (metadata[i].duration*1000);
        let currentMs = timeNow.getTime();
        let distance = endMs - startMs;
        let curDistance = currentMs - startMs;
        let percent = curDistance / distance;
        percent = +percent.toFixed(2);
        if (currentPercent != percent) {
          actions.updateCurrentPercent(percent);
          console.log('updated percent');
        }
        break;
      }
    }
  }
}
