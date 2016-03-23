import $          from 'jquery';
import config     from '../../config/config';
import request    from '../request/request';
import * as formatters from '../formatters/formatters';

class ApiClient {
  // auth
  getDropboxAuthUrl() {
    return request('GET', '/authorize/url');
  }
  finalizeDropboxAuth(state, code, csrf) {
    return request('POST', '/authorize/finalize', {data: {csrf_token: csrf, state: state, code: code}});
  }
  getUserInfo() {
    return request('GET', '/authorize/info', {}, true);
  }
  // journals
  getJournal(date) {
    let dateStr = formatters.getYearMonthDate(date);
    return request('GET', '/journal', {data: {date: dateStr}}, true);
  }
  getMetadata(date) {
    let dateStr = formatters.getYearMonthDate(date);
    return request('GET', '/journal/metadata', {data: {date: dateStr}}, true);
  }
  updateJournal(date, text, success) {
    let dateStr = formatters.getYearMonthDate(date);
    let req = {
      data: {
        text: text,
        date: dateStr
      }
    };
    return request('POST', '/journal', req, true);
  }
  checkForUpdate(date, lastModified) {
    let params = {data: {
      last_modified: formatters.getYearMonthDateTime(lastModified),
      date: formatters.getYearMonthDate(date)
    }}
    return request('GET', '/journal/poll', params, true);
  }
}

var apiClient = new ApiClient();

export default apiClient;
