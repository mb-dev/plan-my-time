import datetime
from app import app
import lib.date_helpers as date_helpers

def template(path):
  return path + "\n\n- 7:00am #wakeup\n- 8:30am #breakfast\n- 9am #persona-project"

def get_metadata(path):
  return {"name": path, "last_modified": date_helpers.to_datetime_str(datetime.datetime.utcnow()), "rev": 1}

files = {}

class DropboxApi(object):
  def dropbox_auth_start(self, get_file_content, web_app_session):
    web_app_session["dropbox-auth-csrf-token"] = 'csrf-token'.encode('utf-8')
    return app.config["APP_URL"] + "/auth/dropbox/callback?state=123&code=456"

  def dropbox_auth_finish(self, get_file_content, session, query):
    return "fakeId", None, None

  def get_user_info(self, access_token):
    return {
      "email": "testing@testing.com",
      "verified": True,
      "first_name": "Testing",
      "last_name": "Testing",
      "country": "US"
    }

  def get_file_content(self, access_token, path):
    if (path not in files):
      files[path] = template(path)
    return files[path]

  def get_file_or_create(self, access_token, path):
    return {"content": self.get_file_content(access_token, path), **get_metadata(path)}

  def update_file(self, access_token, path, text):
    files[path] = text
    return get_metadata(path)

  def get_files_in_folder(self, access_token, cursor):
    return [get_metadata(path) for path in files]
