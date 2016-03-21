from lib import errors
from app import app
from flask                import jsonify, request, g, make_response

@app.errorhandler(errors.AppException)
def handle_invalid_request(error):
  response = jsonify(message=error.msg)
  response.status_code = error.httpCode
  return response

@app.errorhandler(ValueError)
def handle_value_error(error):
  response = jsonify(message=str(error))
  response.status_code = 400
  return response
