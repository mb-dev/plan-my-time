import apiClient from '../libraries/api_client/api_client'
import storage from '../libraries/storage/storage'
import dispatcher from '../dispatcher/dispatcher'
import ActionType from '../stores/action_types'
import { browserHistory } from 'react-router'

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
  // tasks
  getTodayTasks() {
    if (!storage.getBearerToken()) { return; }
    apiClient.getTodayTasks(function(data) {
      dispatcher.dispatch({actionType: ActionType.TASKS.TEXT_CHANGED_FROM_SERVER, newText: data.content, lastUpdated: data.last_modified});
    });
  }
  getMetadata() {
    if (!storage.getBearerToken()) { return; }
    apiClient.getMetadata(function(data) {
      dispatcher.dispatch({actionType: ActionType.TASKS.GET_METADATA, metadata: data});
    });
  }
  updateTodayTasks(text) {
    apiClient.updateTodayTasks(text, function(data) {
      dispatcher.dispatch({actionType: ActionType.TASKS.TEXT_UPDATE_SUCCESS, newText: text, lastUpdated: data.last_modified});
    });
  }
}

var actions = new Actions;
export default actions;
