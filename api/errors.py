
# Dropbox errors
DROPBOX_BAD_REQUEST         = {"code": 1, "msg": "Bad request while connecting to Dropbox",  "httpCode": 400};
DROPBOX_INVALID_STATE       = {"code": 2, "msg": "Bad state while authorizing with dropbox", "httpCode": 400};
DROPBOX_CSRF_ERROR          = {"code": 3, "msg": "CSRF error with dropbox",                  "httpCode": 401};
DROPBOX_NOT_APPROVED        = {"code": 4, "msg": "Dropbox returned Not Approved",            "httpCode": 403};
DROPBOX_PROVIDER_EXCEPTION  = {"code": 4, "msg": "Dropbox returned provider exception",      "httpCode": 403};

class AppException(Exception):
  def __init__(self, appException):
    Exception.__init__(self, appException["msg"])
    self.httpCode = appException["httpCode"]
