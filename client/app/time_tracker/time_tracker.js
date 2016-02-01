export class TimeTracker {
  constructor() {
    this.subscribers = [];
    this.track();
  }
  add(func) {
    this.subscribers.push(func);
  }
  remove(func) {
    this.subscribers.splice(this.subscribers.indexOf(func), 1);
  }
  track() {
    window.setTimeout(() => {
      for (var i=0; i < this.subscribers.length; ++i) {
        this.subscribers[i]();
      }
      this.track();
    }, 1000);
  }
}

var timeTracker = new TimeTracker();
export default timeTracker;
