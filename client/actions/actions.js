import apiClient from '../libraries/api_client/api_client';
import storage from '../libraries/storage/storage';
import dispatcher from '../dispatcher/dispatcher';
import ActionType from '../stores/action_types';
import { browserHistory } from 'react-router';

class Actions {
  // auth
  authorizeWithDropbox() {
    apiClient.getDropboxAuthUrl(function(data) {
      storage.setDropboxCsrf(data.csrf_token);
      window.location.href = data.url;
    });
  }
  finalizeDropboxAuth(state, code) {
    apiClient.finalizeDropboxAuth(state, code, storage.getDropboxCsrf(), function(data) {
      storage.setBearerToken(data.token);
      browserHistory.push('/');
    });
  }
  // journal
  getJournal(date) {
    if (!storage.getBearerToken()) { return; }
    apiClient.getJournal(date, function(data) {
      dispatcher.dispatch({actionType: ActionType.TASKS.TEXT_CHANGED_FROM_SERVER, newText: data.content, lastUpdated: data.last_modified, newDate: date});
    });
  }
  getMetadata(date) {
    if (!storage.getBearerToken()) { return; }
    apiClient.getMetadata(date, function(data) {
      dispatcher.dispatch({actionType: ActionType.TASKS.GET_METADATA, metadata: data});
    });
  }
  updateJournal(date, text) {
    apiClient.updateJournal(date, text, (data) => {
      dispatcher.dispatch({actionType: ActionType.TASKS.TEXT_UPDATE_SUCCESS, newText: text, lastUpdated: data.last_modified});
      this.getMetadata(date);
    });
  }
  updateCurrentTask(task) {
    dispatcher.dispatch({actionType: ActionType.TASKS.CURRENT_TASK_CHANGED, newTask: task});
  }
  updateNextTask(task) {
    dispatcher.dispatch({actionType: ActionType.TASKS.NEXT_TASK_CHANGED, newTask: task});
  }
  updateCurrentPercent(percent) {
    dispatcher.dispatch({actionType: ActionType.TASKS.CURRENT_PERCENT_CHANGED, newPercent: percent});
  }
  switchDate(date) {
    this.getJournal(date);
  }
  checkForUpdate() {
    apiClient.checkForUpdate(store.state.date, store.state.lastUpdated).then(function(data) {
      if (data.updated && data.content) {
        dispatcher.dispatch({actionType: ActionType.TASKS.TEXT_CHANGED_FROM_SERVER, newText: data.content, lastUpdated: data.last_modified, newDate: date});
        dispatcher.dispatch({actionType: ActionType.TASKS.GET_METADATA, metadata: data.metadata});
      }
    });
    $.ajax({
      url: 'poll_changes'
    }, function(data) {
      store.state.lastUpdated
    });
  }
}

var actions = new Actions;
export default actions;
