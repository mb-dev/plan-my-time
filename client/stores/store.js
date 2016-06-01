import {EventEmitter} from 'events';
import _ from 'lodash';
import dispatcher from '../dispatcher/dispatcher';
import ActionType from './action_types';
import storage    from '../libraries/storage/storage';
const CHANGE_EVENT = 'change';

const defaultUserSettings = {
  calendarTagsList: ['project-math-comp-sci', 'social', 'social-activity', 'date'],
};

class Store extends EventEmitter {
  constructor() {
    super();
    this.state = {
      currentUser: null,
      userSettings: {
        calendarTagsList: [],
      },
      hasToken: !!storage.getBearerToken(),
      date: new Date(),
      text: '',
      savedText: '',
      lastUpdated: null,
      serverError: null,
      metadata: null,
      tags: [],
      home: {
        modified: false,
        goals: [],
      },
      report: {
        metadata: [],
        date: new Date(),
      },
      tagDetails: {
        entries: [],
      },
      modal: {
        displayedModal: null,
        params: null,
      },
      goalsModal: {
        content: '',
        saving: false,
        serverError: false,
      },
      request: {
        state: null,
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
        this.state.date = payload.newDate;
        this.state.lastUpdated = new Date(payload.lastUpdated);
        this.state.text = this.state.savedText = payload.newText;
        this.emitChange();
        break;
      case ActionType.TASKS.TEXT_UPDATE_SUCCESS:
        this.state.serverError = null;
        this.state.lastUpdated = new Date(payload.lastUpdated);
        this.state.savedText = payload.text;
        this.state.home.modified = this.state.savedText !== this.state.text;
        this.state.home.updating = false;
        this.emitChange();
        break;
      case ActionType.TASKS.TEXT_UPDATING:
        this.state.home.updating = true;
        this.emitChange();
        break;
      case ActionType.TASKS.TEXT_UPDATED:
        this.state.text = payload.newText;
        if (!this.state.modified) {
          this.state.home.modified = this.state.savedText !== this.state.text;
          setTimeout(() => this.emitChange());
        }
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
      case ActionType.TASKS.GET_REPORT_METADATA:
        this.state.report.metadata = payload.metadata;
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
        this.state.home.updating = false;
        this.emitChange();
        break;
      case ActionType.USER.INFO:
        this.state.currentUser = payload.info;
        this.state.userSettings = this.state.currentUser.settings || defaultUserSettings;
        this.state.hasToken = true;
        if (this.state.request.state === 'pending') {
          this.state.request.state = 'ok';
        }
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
        this.state.tagDetails.entries = payload.entries;
        this.emitChange();
        break;
      case ActionType.OPEN_MODAL:
        this.state.modal.displayedModal = payload.name;
        this.state.modal.params = payload.params;
        this.emitChange();
        break;
      case ActionType.CLOSE_MODAL:
        this.state.modal.displayedModal = null;
        this.emitChange();
        break;
      case ActionType.GOALS.GOALS_RECEIVED:
        this.state.home.goals = payload.goals;
        this.emitChange();
        break;
      case ActionType.GOALS.GOAL_FILE_RECEIVED:
        this.state.goalsModal.content = payload.content;
        this.emitChange();
        break;
      case ActionType.GOALS.GOALS_UPDATING:
        this.state.goalsModal.saving = true;
        this.state.goalsModal.serverError = false;
        this.emitChange();
        break;
      case ActionType.GOALS.SAVE_GOALS_SUCCESS:
        this.state.goalsModal.saving = false;
        this.state.goalsModal.serverError = false;
        this.emitChange();
        break;
      case ActionType.GOALS.SERVER_ERROR:
        this.state.goalsModal.saving = false;
        this.state.goalsModal.serverError = true;
        this.emitChange();
        break;
      case ActionType.REQUEST.REQUEST_STATE:
        this.state.request.state = payload.state;
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
