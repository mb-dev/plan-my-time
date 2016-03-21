import $       from 'jquery'
import config  from '../../config/config'
import storage from '../storage/storage'

export default function makeRequest(type, url, req, addToken, success) {
  let headers = new Headers();
  if (addToken) {
    let bearerToken = storage.getBearerToken();
    if (!bearerToken) {
      return null;
    }
    headers.append('Authorization', bearerToken);
  }
  // query = '';
  // if (req.query) {
  //   query += '?' + Object.keys(req.query).map((key) => { return key + '=' + req.query[key]; }).join('&');
  // }

  let data = {
    method: type,
    headers: headers,
  };
  let fullurl = config.apiServer + url;
  if (req && req.data) {
    if (type == 'GET') {
      fullurl += '?' + $.param(req.data);
    } else {
      data.body = new FormData();
      for ( var key in req.data ) {
          data.body.append(key, req.data[key]);
      }
    }
  }
  return fetch(fullurl, data);
}
