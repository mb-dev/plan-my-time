import apiClient from '../../shared/client/api_client/api_client';
import storage from '../libraries/storage/storage';
import config from '../config/config';
import dispatcher from '../dispatcher/dispatcher';
import ActionType from '../stores/action_types';
import { browserHistory } from 'react-router';

function getConfig() {
  return { apiServer: config.apiServer, token: storage.getBearerToken() }
}

class Actions {
  // auth
  authorizeWithDropbox() {
    apiClient.getDropboxAuthUrl().then(response => (
      response.json()
    )).then((data) => {
      storage.setDropboxCsrf(data.csrf_token);
      window.location.href = data.url;
    });
  }
  finalizeDropboxAuth(state, code) {
    apiClient.finalizeDropboxAuth(state, code, storage.getDropboxCsrf()).then((response) => {
      return response.json();
    }).then((data) => {
      storage.setBearerToken(data.token);
      this.getUserInfo().then(function() {
        browserHistory.push('/');
      });
    });
  }
  logout() {
    dispatcher.dispatch({actionType: ActionType.USER.LOGOUT});
    browserHistory.push('/');
  }
  getUserInfo() {
    let config = getConfig();
    if (!config.token) { return; }
    return apiClient.getUserInfo(config).then((response) => {
      return response.json();
    }).then((data) => {
      dispatcher.dispatch({actionType: ActionType.USER.INFO, info: data});
    });
  }
  // journal
  getJournal(date) {
    let config = getConfig();
    if (!config.token) { return; }
    apiClient.getJournal(config, date).then((response) => {
      return response.json();
    }).then((data) => {
      dispatcher.dispatch({actionType: ActionType.TASKS.TEXT_CHANGED_FROM_SERVER, newText: data.content, lastUpdated: data.last_modified, newDate: date});
    });
  }
  getMetadata(date, component) {
    let config = getConfig();
    if (!config.token) { return; }
    apiClient.getMetadata(config, date).then((response) => {
      return response.json();
    }).then((data) => {
      dispatcher.dispatch({actionType: ActionType.TASKS.GET_METADATA, metadata: data, date: date, component: component});
    });
  }
  updateJournal(date, text) {
    let config = getConfig();
    if (!config.token) { return; }
    apiClient.updateJournal(config, date, text).then((response) => {
      if (!response.ok) {
        response.json().then((err) => {
           dispatcher.dispatch({actionType: ActionType.TASKS.SERVER_ERROR, message: err.message});
        });
        return;
      }
      return response.json().then((data) => {
        dispatcher.dispatch({actionType: ActionType.TASKS.TEXT_UPDATE_SUCCESS, newText: text, lastUpdated: data.last_modified});
        this.getMetadata(date);
      });
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
  checkForUpdate(date, lastUpdated) {
    let config = getConfig();
    if (!config.token) { return; }
    apiClient.checkForUpdate(config, date, lastUpdated).then((response) => {
      if (response.status === 200) {
        this.getJournal(date);
        this.getMetadata(date);
      }
    });
  }
  // report page
  changeReportDate(date) {
    dispatcher.dispatch({actionType: ActionType.REPORT.CHANGE_DATE, date: date});
  }
}

const actions = new Actions;
export default actions;
