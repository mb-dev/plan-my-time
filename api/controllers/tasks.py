import time
from app                  import app
from flask                import jsonify, request, g
from lib                  import auth
from lib.dropbox          import DropboxApi
from parsers.tasks_parser import TasksParser

def to_date_str(filename):
  return filename[:-3]

@app.route('/tasks/today', methods= ['GET'])
@auth.auth_required
def todayTasks():
  dropbox = DropboxApi()
  fileName = time.strftime("%Y-%m-%d") + ".md"
  content_and_metadata = dropbox.get_file_or_create(g.user["dropbox_access_token"], "/" + fileName)
  return jsonify(content_and_metadata)

@app.route('/tasks/metadata', methods= ['GET'])
@auth.auth_required
def getMetadata():
  dropbox = DropboxApi()
  files = dropbox.get_files_in_folder(g.user["dropbox_access_token"])
  files = [dropbox.get_file_content(g.user["dropbox_access_token"], '/' + metadata["name"]) for metadata in files]
  files = [TasksParser(to_date_str(metadata["name"]), metadata["content"]).to_dict() for metadata in files]
  return jsonify(metadata=files)

@app.route('/tasks/today', methods= ['POST'])
@auth.auth_required
def updateTodayTasks():
  dropbox = DropboxApi()
  filename = time.strftime("%Y-%m-%d") + ".md"
  metadata = dropbox.update_file(g.user["dropbox_access_token"], "/" + filename, request.form['text'])
  return jsonify({"success": True, **metadata})
