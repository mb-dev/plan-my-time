import apiClient from '../../../shared/client/api_client/api_client';
import storage from '../libraries/storage/storage';
import dispatcher from '../dispatcher/dispatcher';
import ActionType from '../stores/action_types';
import config from '../config/config';

async function getConfig() {
  const token = await storage.getBearerToken();
  console.log('config is:', config.apiServer);
  return {apiServer: config.apiServer, token};
}

class Actions {
  async setApiKey(key) {
    const config = await getConfig();
    storage.setApiKey(config, key);
    const response = await apiClient.authByKey(config, key);
    if (response.ok) {
      await storage.setApiKey(key);
      const data = await response.json();
      await storage.setBearerToken(data.token);
      await this.getUserInfo();
    } else {
      dispatcher.dispatch({ actionType: ActionType.AUTH.KEY_NOT_FOUND});
      throw new Error('key not found');
    }
  }
  async getUserInfo() {
    const config = await getConfig();
    if (!config.token) { return; }
    const response = await apiClient.getUserInfo(config);
    const data = await response.json();
    dispatcher.dispatch({ actionType: ActionType.USER.INFO, info: data});
  }
  async getEntries() {
    const config = await getConfig();
    if (!config.token) { return; }
    const response = await apiClient.getEntries(config);
    const data = await response.json();
    dispatcher.dispatch({actionType: ActionType.ENTRIES.LIST, entries: data});
  }
}

const actions = new Actions;
export default actions;
