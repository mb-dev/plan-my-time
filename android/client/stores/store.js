import {EventEmitter} from 'events';
import dispatcher from '../dispatcher/dispatcher';
import ActionType from './action_types';
const CHANGE_EVENT = 'change';

class Store extends EventEmitter {
  constructor() {
    super();
    this.state = {
      currentUser: null,
      tags: {},
      entries: [],
      settings: {
        notFound: false,
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
      case ActionType.AUTH.KEY_NOT_FOUND:
        this.state.settings.notFound = true;
        this.emitChange();
        break;
      case ActionType.USER.INFO:
        this.state.currentUser = payload.info;
        this.emitChange();
        break;
      case ActionType.ENTRIES.LIST:
        this.state.entries = payload.entries;
        console.log('setting store', payload.entries);
        this.emitChange();
        break;
      default:
        console.log('got invalid action');
    }
  }
}

const store = new Store();
dispatcher.register(store.handleDispatch.bind(store));

export default store;
