import apiClient from '../libraries/api_client/api_client'
import storage from '../libraries/storage/storage'

export default {
  authorizeWithDropbox: function() {
    apiClient.getDropboxAuthUrl(function(data) {
      storage.setDropboxCsrf(data.csrf_token);
      window.location.href = data.url;
    });
  }
}
