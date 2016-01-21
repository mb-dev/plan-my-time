import $       from 'jquery'
import config  from '../../config/config'
import storage from '../storage/storage'

export default function makeRequest(type, url, req, addToken, success) {
  if (addToken) {
    let bearerToken = storage.getBearerToken();
    if (!bearerToken) {
      return null;
    }
    req.beforeSend = function(xhr) {
      xhr.setRequestHeader("Authorization", bearerToken);
    };
  }
  // query = '';
  // if (req.query) {
  //   query += '?' + Object.keys(req.query).map((key) => { return key + '=' + req.query[key]; }).join('&');
  // }

  req.url = config.apiServer + url;// + query;
  req.type = type;
  req.success = success;
  return $.ajax(req);
}
