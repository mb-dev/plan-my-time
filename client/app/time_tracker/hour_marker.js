import timeTracker from './time_tracker';
import sound       from '../../libraries/sound/sound';

const breakSound = 'zen-temple.mp3';
const tickSound = 'clock-tick.mp3';

export default class HourMarker {
  constructor() {
    timeTracker.add(this.onSecond);
  }
  onSecond() {
    let hour = new Date().getHours();
    let minute = new Date().getMinutes();
    let second = new Date().getSeconds();
    if (hour < 7 || hour >= 22) {
      return;
    }
    if (minute == 50 && second == 0) {
      sound.playSound(breakSound);
    } else if (minute % 10 == 0 && second == 0) {
      sound.playSound(tickSound);
    }
  }
}
