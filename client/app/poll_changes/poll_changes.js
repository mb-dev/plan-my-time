import TimeTracker from './time_tracker'
import actions from '../../actions/actions';

class PollChanges {
  function onTick() {
    let seconds = new Date().getSeconds();
    // poll for changes every 10 seconds
    if (seconds % 10 !== 0) {
      return;
    }
    actions.checkForUpdate();
  }
}
