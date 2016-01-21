import time
import datetime
import models.entries
from app                  import app
from flask                import jsonify, request, g
from lib                  import auth
from lib.dropbox_fake     import DropboxApi
from parsers.tasks_parser import TasksParser

def to_date_str(filename):
  return filename[:-3]

def today():
  return datetime.datetime.today().replace(hour=0, minute=0, second=0)

@app.route('/journal', methods= ['GET'])
@auth.auth_required
def getJournal():
  date = request.args.get('date')
  if not date:
    return "missing date", 400
  dropbox = DropboxApi()
  filename = date + ".md"
  content_and_metadata = dropbox.get_file_or_create(g.user["dropbox_access_token"], "/" + filename)
  return jsonify(content_and_metadata)

@app.route('/journal/metadata', methods= ['GET'])
@auth.auth_required
def getMetadata():
  date = request.args.get('date')
  if not date:
    return "missing date", 400
  year,month = [int(part) for part in date.split('-')]
  entries = models.entries.find_for_user_and_month(g.user["_id"], month, year)
  entry_metadata_arr = [entry["metadata"] for entry in entries]
  summary = TasksParser.summerize(entry_metadata_arr)
  return jsonify(metadata=entry_metadata_arr, summary=summary)

@app.route('/journal', methods= ['POST'])
@auth.auth_required
def updateJournal():
  date = request.form['date']
  content = request.form['text']

  # update dropbox
  dropbox = DropboxApi()
  filename = date + ".md"
  file_metadata = dropbox.update_file(g.user["dropbox_access_token"], "/" + filename, content)

  # update metadata
  entry_metadata = {}
  if len(content) > 0:
    entry_metadata = TasksParser(date, content).to_dict()
  models.entries.create_or_update_entry(g.user["_id"], filename, date, entry_metadata)
  return jsonify({"success": True, **file_metadata})
