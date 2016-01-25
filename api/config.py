import os

PREFIX = 'TIME_SERVICE_'

class ConfigClass(object):
  # Dropbox settings
  DROPBOX_APP_KEY    = os.getenv(PREFIX + 'DROPBOX_APP_KEY')
  DROPBOX_APP_SECRET = os.getenv(PREFIX + 'DROPBOX_APP_SECRET')
  DROPBOX_REDIRECT   = os.getenv(PREFIX + 'DROPBOX_REDIRECT')
  DROPBOX_USE_FAKE   = os.getenv(PREFIX + 'DROPBOX_USE_FAKE') == 'true' or False
  APP_URL            = os.getenv(PREFIX + 'APP_URL')
  APP_DEBUG          = os.getenv(PREFIX + 'APP_DEBUG') == 'true'        or False
  PORT               = os.getenv(PREFIX + 'PORT')                       or 5000
  TOKEN_SECRET       = os.getenv(PREFIX + 'TOKEN_SECRET')
