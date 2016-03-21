import timeTracker from '../time_tracker/time_tracker'
import actions from '../../actions/actions';
import store from '../../stores/store';

export default class PollChanges {
  constructor() {
    timeTracker.add(this.onTick);
  }
  onTick() {
    if (store.state.serverError) {
      return;
    }
    let seconds = new Date().getSeconds();
    // poll for changes every 10 seconds
    if (seconds % 10 !== 0) {
      return;
    }
    actions.checkForUpdate(store.state.date, store.state.lastUpdated);
  }
}
