import models.entries
import lib.date_helpers   as     date_helpers
from app                  import app
from flask                import jsonify, request, g
from lib                  import auth

@app.route('/api/entries/:date', methods=['GET'])
@auth.auth_required
def getEntriesForDate():
    date_str = request.args.get('date')
    if not date_str:
        return "missing date", 400
    date = date_helpers.parse_date_str(date_str)
    metadata = models.entries.find_for_user_and_date(g.user["_id"], date)
    if metadata is None:
        # for now it needs to exist
        return "not found", 404
    return jsonify(entries=metadata["metadata"]["tasks"])

@app.route('/api/entries', methods=['GET'])
@auth.auth_required
def getEntries():
    query = {}
    tag = request.args.get('tag')
    date = request.args.get('date')
    if tag:
        query["tag"] = tag
    if date:
        query["date"] = tag
    if len(query) == 0:
        return "missing query parameters", 400
    entries = models.entries.find_for_user(g.user["_id"], query)
    return jsonify(entries=entries)
