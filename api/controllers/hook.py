from flask                import jsonify, request, g
from app                  import app
from hashlib import sha256
import hmac
import threading
from models import user, entries
from lib.dropbox          import DropboxApi
from parsers.tasks_parser import TasksParser

@app.route('/api/dropbox/hook', methods= ['GET'])
def webhook():
  return request.args.get('challenge')

@app.route('/api/dropbox/hook', methods= ['POST'])
def webook():
  '''Receive a list of changed user IDs from Dropbox and process each.'''

  # Make sure this is a valid request from Dropbox
  signature = request.headers.get('X-Dropbox-Signature')
  if not hmac.compare_digest(signature, hmac.new(app.config['DROPBOX_APP_SECRET'], request.data, sha256).hexdigest()):
    abort(403)

  for account in json.loads(request.data)['list_folder']['accounts']:
    # We need to respond quickly to the webhook request, so we do the
    # actual work in a separate thread. For more robustness, it's a
    # good idea to add the work to a reliable queue and process the queue
    # in a worker process.
    app.logger.info("starting a thread to process the message: {0}".format(account))
    threading.Thread(target=process_user, args=(account,)).start()
  return ''


def process_user(dropbox_user_id):
  # OAuth token for the user
  usr = user.find_user_by_dropbox_id(dropbox_user_id)
  if not usr:
    app.logger.error("User {0] was not found".format(dropbox_user_id))
    return

  cursor = usr["hook_cursor"]

  app.logger.info("Processing update for user {0}".format(usr["email"]))

  dropbox = DropboxApi()
  results = dropbox.get_files_in_folder(usr["dropbox_access_token"], cursor)
  for result in results:
    app.logger.info("processing changed file {0}, with name: {1}".format(result["path_lower"], result["name"]))
    content = dropbox.get_file_content(usr["dropbox_access_token"], result["path_lower"])
    date_str = result["name"][0:-3]
    entry_metadata = TasksParser(date_str, content).to_dict()
    models.entries.create_or_update_entry(usr["_id"], result["name"], date_str, entry_metadata)

  app.logger.info("Finished processing update for user {0}".format(usr["email"]))
  user.save_hook_cursor(usr["_id"], token)
