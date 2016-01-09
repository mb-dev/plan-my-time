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
  req.url = config.apiServer + url;
  req.type = type;
  req.success = success;
  return $.ajax(req);
}
