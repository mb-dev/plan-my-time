from flask import Flask
from flask import jsonify
from flask.ext.cors import CORS
from config import ConfigClass
from lib.dropboxHandler import DropboxHandler
import errors

def create_app():
  app = Flask(__name__)
  app.config.from_object(__name__+'.ConfigClass')
  return app

app = create_app()
CORS(app)

@app.route('/authorize/url')
def authorize():
  session = {}
  dropbox = DropboxHandler()
  redirect_url = dropbox.dropbox_auth_start(app.config, session)
  return jsonify(url=redirect_url, csrf_token=session["dropbox-auth-csrf-token"].decode("utf-8"))

@app.errorhandler(errors.AppException)
def handle_invalid_request(error):
  response = {"msg": error.msg}
  response.status_code = error.httpCode
  return response

if __name__ == '__main__':
  app.run(debug = True)
