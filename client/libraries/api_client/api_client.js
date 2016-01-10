import $       from 'jquery'
import config  from '../../config/config'
import request from '../request/request'

class ApiClient {
  // auth
  getDropboxAuthUrl(success) {
    $.get(config.apiServer + '/authorize/url', success);
  }
  finalizeDropboxAuth(state, code, csrf, success) {
    $.post(config.apiServer + '/authorize/finalize', {csrf_token: csrf, state: state, code: code}, success);
  }
  // tasks
  getTodayTasks(success) {
    request('GET', '/tasks/today', {}, true, success);
  }
  getMetadata(success) {
    request('GET', '/tasks/metadata', {}, true, success);
  }
  updateTodayTasks(text, success) {
    let req = {
      data: {text: text}
    };
    request('POST', '/tasks/today', req, true, success);
  }
}

var apiClient = new ApiClient();

export default apiClient;
