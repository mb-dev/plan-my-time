const serialize = function(obj) {
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

export default function makeRequest(type, url, req, config, success) {
  const headers = new Headers();
  if (config.token) {
    headers.append('Authorization', config.token);
  }
  const data = {
    method: type,
    headers: headers,
  };
  let fullurl = config.apiServer + url;
  if (req && req.data) {
    if (type === 'GET') {
      fullurl += '?' + serialize(req.data);
    } else {
      data.body = new FormData();
      for ( var key in req.data ) {
          data.body.append(key, req.data[key]);
      }
    }
  }
  return fetch(fullurl, data);
}
