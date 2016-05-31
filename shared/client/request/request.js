function serialize(obj) {
  const str = [];
  for (const p in obj) {
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
  }
  return str.join('&');
}

export default function makeRequest(type, url, req, config) {
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
      headers.append('Content-Type', 'application/json');
      data.body = JSON.stringify(req.data);
    }
  }
  return fetch(fullurl, data);
}
