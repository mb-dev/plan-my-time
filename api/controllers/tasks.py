import time
from app import app
from lib import auth
from lib.dropbox import DropboxApi
from flask import jsonify, request, g

@app.route('/tasks/today', methods= ['GET'])
@auth.auth_required
def todayTasks():
  dropbox = DropboxApi()
  fileName = time.strftime("%Y-%m-%d") + ".md"
  content_and_metadata = dropbox.get_file_or_create(g.user["dropbox_access_token"], "/" + fileName)
  return jsonify(content_and_metadata)

@app.route('/tasks/today', methods= ['POST'])
@auth.auth_required
def updateTodayTasks():
  dropbox = DropboxApi()
  filename = time.strftime("%Y-%m-%d") + ".md"
  metadata = dropbox.update_file(g.user["dropbox_access_token"], "/" + filename, request.form['text'])
  return jsonify({"success": True, **metadata})
