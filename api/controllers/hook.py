from flask                import jsonify, request, g, abort
from app                  import app
from hashlib import sha256
import hmac
import threading
import json
import models.entries
import models.user
from lib.dropbox          import DropboxApi
from parsers.tasks_parser import TasksParser
import lib.date_helpers   as     date_helpers

def dict_without(d, key):
    new_d = d.copy()
    new_d.pop(key)
    return new_d

@app.route('/api/dropbox/hook', methods= ['GET'])
def webhook():
  return request.args.get('challenge')

@app.route('/api/dropbox/hook', methods= ['POST'])
def webook():
  '''Receive a list of changed user IDs from Dropbox and process each.'''

  # Make sure this is a valid request from Dropbox
  signature = request.headers.get('X-Dropbox-Signature')
  if not hmac.compare_digest(signature, hmac.new(app.config['DROPBOX_APP_SECRET'].encode(), request.data, sha256).hexdigest()):
    abort(403)

  for account in json.loads(request.data.decode("utf-8"))['delta']['users']:
    # We need to respond quickly to the webhook request, so we do the
    # actual work in a separate thread. For more robustness, it's a
    # good idea to add the work to a reliable queue and process the queue
    # in a worker process.
    app.logger.info("starting a thread to process the message: {0}".format(account))
    threading.Thread(target=process_user, args=(account,)).start()
  return ''


def process_user(dropbox_user_id):
  # OAuth token for the user

  user = models.user.find_user_by_dropbox_id(str(dropbox_user_id))
  if not user:
    app.logger.error("User {0} was not found".format(dropbox_user_id))
    return

  cursor = None
  if "hook_cursor" in user:
    cursor = user["hook_cursor"]

  app.logger.info("Processing update for user {0}".format(user["email"]))

  dropbox = DropboxApi()
  results, cursor = dropbox.get_files_in_folder(user["dropbox_access_token"], cursor)
  for result in results:
    app.logger.info("processing changed file {0}, with name: {1}".format(result["path_lower"], result["name"]))
    response = dropbox.get_file_content(user["dropbox_access_token"], result["path_lower"])
    content = response["content"]
    date_str = result["name"][:-3]
    filename = result["name"]
    date = date_helpers.parse_date_str(date_str)
    entry_metadata = TasksParser(date_str, content).to_dict()
    models.entries.create_or_update_entry(user["_id"], filename, date, entry_metadata, dict_without(response, "content"))

  app.logger.info("Finished processing update for user {0}".format(user["email"]))
  models.user.save_hook_cursor(user["_id"], cursor)
