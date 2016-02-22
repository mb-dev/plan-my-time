from flask                import jsonify, request, g
from app                  import app
from hashlib import sha256
import hmac
import threading
from models import user
from lib.dropbox          import DropboxApi

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
    threading.Thread(target=process_user, args=(account,)).start()
  return ''


def process_user(dropbox_user_id):
  '''Call /files/list_folder for the given user ID and process any changes.'''

  # OAuth token for the user
  usr = user.find_user_by_dropbox_id(dropbox_user_id) 
  cursor = None

  dropbox = DropboxApi()
  results = dropbox.get_files_in_folder(usr.dropbox_access_token)

