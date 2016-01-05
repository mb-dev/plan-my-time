import apiClient from '../libraries/api_client/api_client'
import storage from '../libraries/storage/storage'
import dispatcher from '../dispatcher/dispatcher'
import ActionType from '../stores/action_types'
import { browserHistory } from 'react-router'

export default {
  authorizeWithDropbox: function() {
    apiClient.getDropboxAuthUrl(function(data) {
      storage.setDropboxCsrf(data.csrf_token);
      window.location.href = data.url;
    });
  },
  finalizeDropboxAuth: function(state, code) {
    apiClient.finalizeDropboxAuth(state, code, storage.getDropboxCsrf(), function(data) {
      storage.setBearerToken(data.token);
      browserHistory.push('/');
    });
  },
  getTodayTasks: function() {
    if (!storage.getBearerToken()) {
      return;
    }
    apiClient.getTodayTasks(function(data) {
      dispatcher.dispatch({actionType: ActionType.TASKS.TEXT_CHANGED_FROM_SERVER, newText: data.content});
    });
  }
}
