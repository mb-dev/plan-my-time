import request    from '../request/request';
import * as formatters from '../formatters/formatters';

class ApiClient {
  // auth
  getDropboxAuthUrl(config) {
    return request('GET', '/authorize/url', {}, config);
  }
  finalizeDropboxAuth(config, csrf, state, code) {
    return request('POST', '/authorize/finalize', {data: {csrf_token: csrf, state: state, code: code}}, config);
  }
  getUserInfo(config) {
    return request('GET', '/authorize/info', {}, config);
  }
  authByKey(config, key) {
    return request('POST', '/authorize/key', {data: {key: key}}, config);
  }
  // journals
  getJournal(config, date) {
    const dateStr = formatters.getYearMonthDate(date);
    return request('GET', '/journal', {data: {date: dateStr}}, config);
  }
  getMetadata(config, date) {
    const dateStr = formatters.getYearMonthDate(date);
    return request('GET', '/journal/metadata', {data: {date: dateStr}}, config);
  }
  updateJournal(config, date, text) {
    const dateStr = formatters.getYearMonthDate(date);
    const req = {
      data: {
        text: text,
        date: dateStr,
      },
    };
    return request('POST', '/journal', req, config);
  }
  checkForUpdate(config, date, lastModified) {
    const params = {data: {
      last_modified: formatters.getYearMonthDateTime(lastModified),
      date: formatters.getYearMonthDate(date),
    }};
    return request('GET', '/journal/poll', params, config);
  }
  getTags(config) {
    return request('GET', '/journal/tags', {}, config);
  }
  // entries
  getEntries(config, query) {
    if (query.date) {
      query.date = formatters.getYearMonthDate(query.date);
    }
    return request('GET', '/entries', {data: query}, config);
  }
  addEntry(config, date, line) {
    const dateStr = formatters.getYearMonthDate(date);
    return request('POST', '/entries', {data: {date: dateStr, line: line}}, config);
  }
  editEntry(config, date, prevLine, newLine) {
    const dateStr = formatters.getYearMonthDate(date);
    return request('PUT', '/entries', {data: {date: dateStr, prev_line: prevLine, new_line: newLine}}, config);
  }
}

const apiClient = new ApiClient();
export default apiClient;
