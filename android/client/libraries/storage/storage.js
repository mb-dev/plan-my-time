import { AsyncStorage } from 'react-native';

class Storage {
  async getApiKey() {
    return await AsyncStorage.getItem('api-key');
  }
  async setApiKey(key) {
    await AsyncStorage.setItem('api-key', key);
  }
  async setBearerToken(token) {
    await AsyncStorage.setItem('bearer-token', token);
  }
  async getBearerToken() {
    return await AsyncStorage.getItem('bearer-token');
  }
}

const storage = new Storage();
export default storage;
