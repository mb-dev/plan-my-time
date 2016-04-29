import {AsyncStorage} from 'react-native';

class Storage {
  async getSettings() {
    return {
      apiKey: await AsyncStorage.getItem('apiKey'),
      developMode: (await AsyncStorage.getItem('developMode')) === 'true',
    };
  }
  async setSettings(settings) {
    await AsyncStorage.setItem('apiKey', settings.apiKey);
    await AsyncStorage.setItem('developMode', settings.developMode.toString());
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
