import $          from 'jquery'
import config     from '../../config/config'
import request    from '../request/request'
import * as formatters from '../formatters/formatters'

class ApiClient {
  // auth
  getDropboxAuthUrl(success) {
    $.get(config.apiServer + '/authorize/url', success);
  }
  finalizeDropboxAuth(state, code, csrf, success) {
    $.post(config.apiServer + '/authorize/finalize', {csrf_token: csrf, state: state, code: code}, success);
  }
  // journals
  getJournal(date, success) {
    let dateStr = formatters.getYearMonthDate(date);
    request('GET', '/journal', {data: {date: dateStr}}, true, success);
  }
  getMetadata(date, success) {
    let dateStr = formatters.getYearMonthDate(date);
    request('GET', '/journal/metadata', {data: {date: dateStr}}, true, success);
  }
  updateJournal(date, text, success) {
    let dateStr = formatters.getYearMonthDate(date);
    let req = {
      data: {
        text: text,
        date: dateStr
      }
    };
    request('POST', '/journal', req, true, success);
  }
}

var apiClient = new ApiClient();

export default apiClient;
