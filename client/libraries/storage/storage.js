import Cookies from 'cookies-js'

class Storage {
  getBearerToken() {
    return Cookies.get('token');
  }
  setBearerToken(token) {
    var sevenDays = 60 * 60 * 24 * 7;
    Cookies.set('token', token, { expires: sevenDays });
  }
  setDropboxCsrf(csrf) {
    Cookies.set('dropboxCsrf', csrf);
  }
  clearAll() {
    Cookies.expire('token');
  }
}

var storage = new Storage();

export default storage;
