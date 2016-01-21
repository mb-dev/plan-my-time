import {EventEmitter} from 'events'
import dispatcher from '../dispatcher/dispatcher'
import ActionType from './action_types'

var CHANGE_EVENT = 'change';

class Store extends EventEmitter {
  constructor() {
    super();
    this.state = {date: new Date()};
  }
  emitChange() {
    this.emit(CHANGE_EVENT);
  }
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
  handleDispatch(payload) {
    switch (payload.actionType) {
      case ActionType.TASKS.TEXT_CHANGED_FROM_SERVER:
        this.state.text = payload.newText;
        this.state.lastUpdated = new Date(payload.lastUpdated);
        this.emitChange();
        break;
      case ActionType.TASKS.TEXT_UPDATE_SUCCESS:
        this.state.text = payload.newText;
        this.state.lastUpdated = new Date(payload.lastUpdated);
        this.emitChange();
        break;
      case ActionType.TASKS.GET_METADATA:
        this.state.metadata = payload.metadata;
        this.emitChange();
        break;
      case ActionType.TASKS.CHANGE_DATE:
        this.state.date = payload.newDate;
        this.emitChange();
        break;
    }
  }
}

var store = new Store();
dispatcher.register(store.handleDispatch.bind(store));

export default store;
