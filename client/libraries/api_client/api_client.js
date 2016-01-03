import config from '../../config/config'

import $ from 'jquery'

class TimeApiClient {
  getDropboxAuthUrl(success) {
    $.get(config.apiServer + '/authorize/url', success);
  }

}

var timeApiClient = new TimeApiClient();

export default timeApiClient;
