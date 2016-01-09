from app import app
from lib.dropbox import DropboxApi
import models.user as user
from flask import jsonify, request

@app.route('/authorize/url', methods = ['GET'])
def authorize():
  session = {}
  dropbox = DropboxApi()
  redirect_url = dropbox.dropbox_auth_start(app.config, session)
  return jsonify(url=redirect_url, csrf_token=session["dropbox-auth-csrf-token"].decode("utf-8"))

@app.route('/authorize/finalize', methods = ['POST'])
def finalize():
  session = {'dropbox-auth-csrf-token': request.form['csrf_token']}
  query = {'state': request.form['csrf_token'], 'code': request.form['code']}
  dropbox = DropboxApi()
  access_token, user_id, url_state = dropbox.dropbox_auth_finish(app.config, session, query)
  user_info = dropbox.get_user_info(access_token)
  if (user_info["verified"] == False):
    raise errors.AppException(errors.DROPBOX_EMAIL_NOT_VERIFIED)
  user_id = user.create_or_find_user({"dropbox_access_token": access_token, "dropbox_user_id": user_id, **user_info})
  encoded = jwt.encode({"user_id": str(user_id)}, app.config["TOKEN_SECRET"], algorithm='HS256')
  return jsonify(token=encoded.decode('utf-8'))
