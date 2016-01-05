from flask import Flask, request, jsonify
from flask.ext.cors import CORS
from config import ConfigClass
from lib.dropboxHandler import DropboxHandler
from models.user import create_or_find_user, find_user_by_id
import errors
import jwt
import time

def create_app():
  app = Flask(__name__)
  app.config.from_object(__name__+'.ConfigClass')
  return app

app = create_app()
CORS(app)

@app.route('/authorize/url', methods = ['GET'])
def authorize():
  session = {}
  dropbox = DropboxHandler()
  redirect_url = dropbox.dropbox_auth_start(app.config, session)
  print(session["dropbox-auth-csrf-token"])
  return jsonify(url=redirect_url, csrf_token=session["dropbox-auth-csrf-token"].decode("utf-8"))


@app.route('/authorize/finalize', methods = ['POST'])
def finalize():
  session = {'dropbox-auth-csrf-token': request.form['csrf_token']}
  query = {'state': request.form['csrf_token'], 'code': request.form['code']}
  dropbox = DropboxHandler()
  access_token, user_id, url_state = dropbox.dropbox_auth_finish(app.config, session, query)
  user_info = dropbox.get_user_info(access_token)
  if (user_info["verified"] == False):
    raise errors.AppException(errors.DROPBOX_EMAIL_NOT_VERIFIED)
  user_id = create_or_find_user({"dropbox_access_token": access_token, "dropbox_user_id": user_id, **user_info})
  encoded = jwt.encode({"user_id": str(user_id)}, app.config["TOKEN_SECRET"], algorithm='HS256')
  return jsonify(token=encoded.decode('utf-8'))

@app.route('/tasks/today', methods= ['GET'])
def todayTasks():
  bearer = jwt.decode(request.headers['Authorization'].encode('utf-8'), app.config["TOKEN_SECRET"], algorithm='HS256')
  user = find_user_by_id(bearer["user_id"])
  dropbox = DropboxHandler()
  fileName = time.strftime("%Y-%m-%d") + ".md"
  content = dropbox.get_file_or_create(user["dropbox_access_token"], "/" + fileName)
  return jsonify(content=content)

@app.errorhandler(errors.AppException)
def handle_invalid_request(error):
  response = jsonify(message=error.msg)
  response.status_code = error.httpCode
  return response

if __name__ == '__main__':
  app.run(debug = True)
