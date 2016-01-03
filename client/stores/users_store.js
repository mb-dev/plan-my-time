import {EventEmitter} from 'events'
import apiClient from '../libraries/api_client/api_client'
import dispatcher from '../dispatcher/dispatcher'
import ActionType from './action_types'

var CHANGE_EVENT = 'change';

class UserStore extends EventEmitter {
  constructor() {
    super();
    this.currentUser = null;
  }
  getCurrentUser() {
    return this.currentUser;
  }
  loadCurrentUser() {
    if (this.currentUser) {
      return;
    }

    // apiClient.getCurrentUser((data) => {
    //   this.currentUser = data;
    //   this.emitChange();
    // });
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
      case ActionType.USER.LOGOUT:
        this.currentUser = null;
        this.emitChange();
        break
    }
  }

}

var store = new UserStore();
dispatcher.register(store.handleDispatch.bind(store));

export default store;
