import tripsStore       from './trips_store'

class LocalPersistance {
  constructor() {
    this.onStoreChanged = this.onStoreChanged.bind(this);
  }
  subscribe() {
    tripsStore.addChangeListener(this.onStoreChanged);
  }
  unsubscribe() {
    tripsStore.removeChangeListener(this.onStoreChanged);
  }
  onStoreChanged() {
    this.updateState();
  }
  updateState() {
    window.localStorage.state = {};
  }
}

var localPersistance = new LocalPersistance();
export default localPersistance;
