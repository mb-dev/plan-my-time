import apiClient from '../../shared/client/api_client/api_client';
import storage from '../libraries/storage/storage';
import configStore from '../config/config';
import dispatcher from '../dispatcher/dispatcher';
import ActionType from '../stores/action_types';
import {browserHistory} from 'react-router';
import * as formatters from '../../shared/client/formatters/formatters';

function getConfig() {
  return {apiServer: configStore.apiServer, token: storage.getBearerToken()};
}

class Actions {
  // auth
  async authorizeWithDropbox() {
    const config = getConfig();
    const response = await apiClient.getDropboxAuthUrl(config);
    const data = await response.json();
    storage.setDropboxCsrf(data.csrf_token);
    window.location.href = data.url;
  }
  async finalizeDropboxAuth(state, code) {
    const config = getConfig();
    const csrf = storage.getDropboxCsrf();
    const response = await apiClient.finalizeDropboxAuth(config, csrf, state, code);
    const data = await response.json();
    storage.setBearerToken(data.token);
    await this.getUserInfo();
    browserHistory.push('/');
  }
  logout() {
    dispatcher.dispatch({actionType: ActionType.USER.LOGOUT});
    browserHistory.push('/');
  }
  async getUserInfo() {
    const config = getConfig();
    if (!config.token) { return; }
    const response = await apiClient.getUserInfo(config);
    const data = await response.json();
    dispatcher.dispatch({actionType: ActionType.USER.INFO, info: data});
  }
  async saveUserSettings(settings) {
    const config = getConfig();
    if (!config.token) { return; }
    dispatcher.dispatch({actionType: ActionType.REQUEST.REQUEST_STATE, state: 'pending'});
    await apiClient.saveUserSettings(config, settings);
    await this.getUserInfo();
  }
  // journal
  async getJournal(date) {
    const config = getConfig();
    if (!config.token) { return; }
    const response = await apiClient.getJournal(config, date);
    const data = await response.json();
    dispatcher.dispatch({actionType: ActionType.TASKS.TEXT_CHANGED_FROM_SERVER, newText: data.content, lastUpdated: data.last_modified, newDate: date});
  }
  async getMetadata(date, component) {
    const config = getConfig();
    if (!config.token) { return; }
    const response = await apiClient.getMetadata(config, date);
    const data = await response.json();
    dispatcher.dispatch({actionType: ActionType.TASKS.GET_METADATA, metadata: data, date: date, component: component});
  }
  async updateJournal(date, text) {
    const config = getConfig();
    if (!config.token) { return; }
    dispatcher.dispatch({actionType: ActionType.TASKS.TEXT_UPDATING});
    const response = await apiClient.updateJournal(config, date, text);
    const data = await response.json();
    if (response.ok) {
      dispatcher.dispatch({actionType: ActionType.TASKS.TEXT_UPDATE_SUCCESS, text: text, lastUpdated: data.last_modified});
      this.getMetadata(date);
    } else {
      dispatcher.dispatch({actionType: ActionType.TASKS.SERVER_ERROR, message: data.message});
    }
  }
  textUpdated(text) {
    dispatcher.dispatch({actionType: ActionType.TASKS.TEXT_UPDATED, newText: text});
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
    const config = getConfig();
    if (!config.token) { return; }
    apiClient.checkForUpdate(config, date, lastUpdated).then((response) => {
      if (response.status === 200) {
        this.getJournal(date);
        this.getMetadata(date);
      }
    });
  }
  async getReportMetadata(year, quarter) {
    const config = getConfig();
    if (!config.token) { return; }
    const dates = formatters.getQuarterDates(year, quarter);
    const metadata = await Promise.all(dates.map(async (date) => {
      const response = await apiClient.getMetadata(config, date);
      return await response.json();
    }));
    dispatcher.dispatch({actionType: ActionType.TASKS.GET_REPORT_METADATA, metadata: metadata});
  }
  // Tags
  async getAllTags() {
    const config = getConfig();
    if (!config.token) { return; }
    const response = await apiClient.getTags(config);
    const data = await response.json();
    dispatcher.dispatch({actionType: ActionType.TASKS.TAGS, tags: data.tags});
  }
  async saveTag(tag, params) {
    const config = getConfig();
    if (!config.token) { return; }
    await apiClient.saveTag(config, tag, params);
  }
  // entries
  async getEntriesByTag(tag) {
    const config = getConfig();
    if (!config.token) { return; }
    const response = await apiClient.getEntries(config, {tag: tag});
    const data = await response.json();
    dispatcher.dispatch({actionType: ActionType.DETAILS_PAGE.ENTRIES, entries: data.entries});
  }
  // report page
  changeReportDate(date) {
    dispatcher.dispatch({actionType: ActionType.REPORT.CHANGE_DATE, date: date});
  }
  // goals
  openModal(name, params) {
    dispatcher.dispatch({actionType: ActionType.OPEN_MODAL, name, params: params});
  }
  closeModal(name) {
    dispatcher.dispatch({actionType: ActionType.CLOSE_MODAL, name});
  }
  async getGoals(date) {
    const config = getConfig();
    if (!config.token) { return; }
    const response = await apiClient.getGoals(config, date);
    const data = await response.json();
    dispatcher.dispatch({actionType: ActionType.GOALS.GOALS_RECEIVED, goals: data.goals});
  }
  async getGoalsFile(startDate, endDate) {
    const config = getConfig();
    if (!config.token) { return; }
    const response = await apiClient.getGoalsFile(config, startDate, endDate);
    const data = await response.json();
    dispatcher.dispatch({actionType: ActionType.GOALS.GOAL_FILE_RECEIVED, content: data.content});
  }
  async saveGoalsFile(startDate, endDate, content) {
    const config = getConfig();
    if (!config.token) { return; }
    dispatcher.dispatch({actionType: ActionType.GOALS.GOALS_UPDATING});
    const response = await apiClient.saveGoalsFile(config, startDate, endDate, content);
    const data = await response.json();
    if (response.ok) {
      dispatcher.dispatch({actionType: ActionType.GOALS.SAVE_GOALS_SUCCESS, lastUpdated: data.last_modified});
    } else {
      dispatcher.dispatch({actionType: ActionType.GOALS.SERVER_ERROR, message: data.message});
      throw new Error('Failed to save goals file');
    }
  }
}

const actions = new Actions;
export default actions;
