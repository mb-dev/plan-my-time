from lib import errors
from app import app

@app.errorhandler(errors.AppException)
def handle_invalid_request(error):
  response = jsonify(message=error.msg)
  response.status_code = error.httpCode
  return response
