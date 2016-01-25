from app                  import app

if app.config["DROPBOX_USE_FAKE"] is True:
  from lib.dropbox_fake          import DropboxApi
else:
  from lib.dropbox_real          import DropboxApi
