import config from '../../config/config'
import storage from '../storage/storage'

import $ from 'jquery'

class TimeApiClient {
  getDropboxAuthUrl(success) {
    $.get(config.apiServer + '/authorize/url', success);
  }
  finalizeDropboxAuth(state, code, csrf, success) {
    $.post(config.apiServer + '/authorize/finalize', {csrf_token: csrf, state: state, code: code}, success);
  }
  getTodayTasks(success) {
    let req = this._addBearerToken({
      url: config.apiServer + '/tasks/today',
      success: success
    });
    $.ajax(req, success);
  }



  _addBearerToken(params) {
    let bearerToken = storage.getBearerToken();
    if (!bearerToken) {
      return null;
    }
    params.beforeSend = function(xhr) {
      xhr.setRequestHeader("Authorization", bearerToken);
    };
    return params;
  }
}

var timeApiClient = new TimeApiClient();

export default timeApiClient;
