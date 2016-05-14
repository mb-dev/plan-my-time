import apiClient from '../../../shared/client/api_client/api_client';
import storage from '../libraries/storage/storage';
import dispatcher from '../dispatcher/dispatcher';
import ActionType from '../stores/action_types';
import configStore from '../config/config';

async function getConfig() {
  const token = await storage.getBearerToken();
  const settings = await storage.getSettings();
  let apiServer = configStore.production.apiServer;
  if (settings.developMode) {
    apiServer = configStore.develop.apiServer;
  }
  return {apiServer: apiServer, token};
}

class Actions {
  async setApiKey(key) {
    const config = await getConfig();
    const response = await apiClient.authByKey(config, key);
    if (response.ok) {
      const data = await response.json();
      await storage.setBearerToken(data.token);
      await this.getUserInfo();
    } else {
      dispatcher.dispatch({actionType: ActionType.AUTH.KEY_NOT_FOUND});
      throw new Error('key not found');
    }
  }
  async getUserInfo() {
    const config = await getConfig();
    if (!config.token) { return; }
    const response = await apiClient.getUserInfo(config);
    const data = await response.json();
    dispatcher.dispatch({actionType: ActionType.USER.INFO, info: data});
  }
  async getTags(query) {
    const config = await getConfig();
    if (!config.token) { return; }
    const response = await apiClient.getTags(config, query);
    const data = await response.json();
    dispatcher.dispatch({actionType: ActionType.MANAGE.TAGS, tags: data.tags});
  }
  async getEntries(date) {
    const config = await getConfig();
    if (!config.token) { return; }
    const response = await apiClient.getEntries(config, {date: date});
    const data = await response.json();
    let entries = [];
    if (data.entries.length > 0) {
      entries = data.entries[0].tasks;
    }
    dispatcher.dispatch({actionType: ActionType.ENTRIES.LIST, entries: entries});
  }
  async addEntry(date, line, isAfterMidnight) {
    const config = await getConfig();
    if (!config.token) { return; }
    const response = await apiClient.addEntry(config, date, line, isAfterMidnight);
    const data = await response.json();
    let entries = [];
    if (data.entries.length > 0) {
      entries = data.entries[0].tasks;
    }
    dispatcher.dispatch({actionType: ActionType.ENTRIES.LIST, entries: entries});
  }
  async editEntry(date, prevLine, newLine, isAfterMidnight) {
    const config = await getConfig();
    if (!config.token) { return; }
    const response = await apiClient.editEntry(config, date, prevLine, newLine, isAfterMidnight);
    const data = await response.json();
    let entries = [];
    if (data.entries.length > 0) {
      entries = data.entries[0].tasks;
    }
    dispatcher.dispatch({actionType: ActionType.ENTRIES.LIST, entries: entries});
  }
}

const actions = new Actions;
export default actions;
