from app import app
from lib.dropbox import DropboxApi
from lib import auth
from lib import errors
import models.user
from flask import jsonify, request, g
import jwt
import re

@app.route('/api/authorize/url', methods=['GET'])
def authorize():
    session = {}
    dropbox = DropboxApi()
    redirect_url = dropbox.dropbox_auth_start(app.config, session)
    return jsonify(url=redirect_url, csrf_token=session["dropbox-auth-csrf-token"].decode("utf-8"))

@app.route('/api/authorize/finalize', methods=['POST'])
def finalize():
    session = {'dropbox-auth-csrf-token': request.json['csrf_token']}
    query = {'state': request.json['csrf_token'], 'code': request.json['code']}
    dropbox = DropboxApi()
    access_token, user_id, _ = dropbox.dropbox_auth_finish(app.config, session, query)
    user_info = dropbox.get_user_info(access_token)
    if user_info["verified"] is False:
        raise errors.AppException(errors.DROPBOX_EMAIL_NOT_VERIFIED)
    user_id = models.user.create_or_find_user({"dropbox_access_token": access_token, "dropbox_user_id": user_id, **user_info})
    encoded = jwt.encode({"user_id": str(user_id)}, app.config["TOKEN_SECRET"], algorithm='HS256')
    return jsonify(token=encoded.decode('utf-8'))

@app.route('/api/authorize/key', methods=['POST'])
def authByKey():
    key = request.json['key']
    if re.match("^[A-Za-z-]+$", key) is None or len(key) > 40:
        raise errors.AppException(errors.KEY_NOT_FOUND)
    user_info = models.user.find_user_by_api_key(key)
    if user_info is None:
        raise errors.AppException(errors.KEY_NOT_FOUND)
    encoded = jwt.encode({"user_id": str(user_info["_id"])}, app.config["TOKEN_SECRET"], algorithm='HS256')
    return jsonify(token=encoded.decode('utf-8'))

@app.route('/api/authorize/info', methods=['GET'])
@auth.auth_required
def get_user_info():
    return jsonify({
        "name": g.user["first_name"] + " " + g.user["last_name"],
        "email": g.user["email"],
        "settings": g.user.get("settings"),
    })

@app.route('/api/user/settings', methods=['POST'])
@auth.auth_required
def save_user_settings():
    settings = request.json
    models.user.save_settings(g.user["_id"], settings)
    return jsonify({})
