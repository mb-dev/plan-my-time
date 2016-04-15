import {EventEmitter} from 'events';
import _ from 'lodash';
import dispatcher from '../dispatcher/dispatcher';
import ActionType from './action_types';
import storage    from '../libraries/storage/storage';
const CHANGE_EVENT = 'change';

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
      metadata: null,
      tags: [],
      report: {
        metadata: null,
        date: new Date(),
      },
      tag_details: {
        entries: [],
      },
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
        if (payload.component) {
          this.state[payload.component].metadata = payload.metadata;
          this.state[payload.component].date = payload.date;
        } else {
          this.state.metadata = payload.metadata;
          if (!this.state.report.metadata) {
            this.state.report.metadata = payload.metadata;
          }
        }
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
      case ActionType.TASKS.TAGS:
        this.state.tags = _.sortBy(payload.tags, 'tag');
        this.emitChange();
        break;
      case ActionType.DETAILS_PAGE.ENTRIES:
        this.state.tag_details.entries = payload.entries;
        this.emitChange();
        break;
      default:
        console.log('invalid action', payload);
    }
  }
}

const store = new Store();
dispatcher.register(store.handleDispatch.bind(store));

export default store;
