import time
import datetime
import models.entries
import lib.date_helpers   as     date_helpers
from app                  import app
from flask                import jsonify, request, g, make_response
from lib                  import auth
from parsers.tasks_parser import TasksParser
from lib.dropbox          import DropboxApi

@app.route('/api/entries', methods=['GET'])
@auth.auth_required
def getEntries():
    date_str = request.args.get('date')
    if not date_str:
        return "missing date", 400
    date = date_helpers.parse_date_str(date_str)
    metadata = models.entries.find_for_user_and_date(g.user["_id"], date)
    if metadata is None:
        # for now it needs to exist
        return "not found", 404
    return jsonify(entries=metadata["metadata"]["tasks"])
