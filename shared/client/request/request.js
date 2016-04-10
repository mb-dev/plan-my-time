import $       from 'jquery'

export default function makeRequest(type, url, req, config, success) {
  let headers = new Headers();
  if (config.token) {
    headers.append('Authorization', config.token);
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
