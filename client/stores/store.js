import {EventEmitter} from 'events';
import dispatcher from '../dispatcher/dispatcher';
import ActionType from './action_types';
import storage    from '../libraries/storage/storage';
var CHANGE_EVENT = 'change';

class Store extends EventEmitter {
  constructor() {
    super();
    this.state = {
      currentUser: null,
      hasToken: !!storage.getBearerToken(),
      date: new Date(),
      text: null,
      lastUpdated: null,
      serverError: null,
      metadata: null
    };
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
        this.state.date = payload.newDate;
        this.state.lastUpdated = new Date(payload.lastUpdated);
        this.emitChange();
        break;
      case ActionType.TASKS.TEXT_UPDATE_SUCCESS:
        this.state.serverError = null;
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
      case ActionType.TASKS.CURRENT_PERCENT_CHANGED:
        this.state.currentPercent = payload.newPercent;
        this.emitChange();
        break;
      case ActionType.TASKS.CURRENT_TASK_CHANGED:
        this.state.currentTask = payload.newTask;
        this.emitChange();
        break;
      case ActionType.TASKS.NEXT_TASK_CHANGED:
        this.state.nextTask = payload.newTask;
        this.emitChange();
        break;
      case ActionType.TASKS.SERVER_ERROR:
        this.state.serverError = payload.message;
        this.emitChange();
        break;
      case ActionType.USER.INFO:
        this.state.currentUser = payload.info;
        this.state.hasToken = true;
        this.emitChange();
        break;
      case ActionType.USER.LOGOUT:
        this.state.currentUser = null;
        this.state.hasToken = false;
        storage.clearAll();
        this.emitChange();
        break;
    }
  }
}

var store = new Store();
dispatcher.register(store.handleDispatch.bind(store));

export default store;
