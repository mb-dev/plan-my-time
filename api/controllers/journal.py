import time
import datetime
import models.entries
import models.tags
import lib.date_helpers   as     date_helpers
from app                  import app
from flask                import jsonify, request, g, make_response
from lib                  import auth
from parsers.tasks_parser import TasksParser
from lib.dropbox          import DropboxApi

def to_date_str(filename):
    return filename[:-3]

def today():
    return datetime.datetime.today().replace(hour=0, minute=0, second=0)

@app.route('/api/journal', methods=['GET'])
@auth.auth_required
def getJournal():
    date_str = request.args.get('date')
    if not date_str:
        return "missing date", 400
    dropbox = DropboxApi()
    filename = date_str + ".md"
    content_and_metadata = dropbox.get_file_or_create(g.user["dropbox_access_token"], "/journal/" + filename)
    return jsonify(content_and_metadata)

@app.route('/api/journal/metadata', methods=['GET'])
@auth.auth_required
def getMetadata():
    date_str = request.args.get('date')
    if not date_str:
        return "missing date", 400
    date = date_helpers.parse_date_str(date_str)
    entries = models.entries.find_for_user_and_month(g.user["_id"], date)
    entry_metadata_arr = [entry["metadata"] for entry in entries]
    summary = TasksParser.summerize(entry_metadata_arr, date)
    return jsonify(metadata=entry_metadata_arr, summary=summary)

@app.route('/api/journal/tags', methods=['GET'])
@auth.auth_required
def getTags():
    date_str = request.args.get('date')
    tags = []
    if date_str is not None:
        date = date_helpers.parse_date_str(date_str)
        entry = models.entries.find_one_for_user_and_date(g.user["_id"], date)
        if entry is not None:
            summary = TasksParser.summerize([entry['metadata']], date)
            tags.extend([{"type": "tag", "tag": tag} for tag in summary["tags"]])
            tags.extend([{"type": "person", "tag": tag} for tag in summary["people"]])
            tags.extend([{"type": "location", "tag": tag} for tag in summary["locations"]])
    else:
        tags = models.tags.get_all_tags(g.user["_id"])
    return jsonify(tags=tags)

@app.route('/api/journal/tag/<tag_id>', methods=['POST'])
@auth.auth_required
def updateTag(tag_id):
    tag_settings = request.json
    models.tags.update_tag(g.user["_id"], tag_id, tag_settings)
    return jsonify({})

@app.route('/api/journal/poll', methods=['GET'])
@auth.auth_required
def pollChanges():
    last_modified = request.args.get('last_modified')
    date_str = request.args.get('date')
    date = date_helpers.parse_date_str(date_str)
    not_modified = 304

    metadata = models.entries.find_for_user_and_date(g.user["_id"], date)
    if metadata["file_metadata"]["last_modified"] <= last_modified:
        return make_response("", not_modified)

    return make_response("", 200)

@app.route('/api/journal', methods=['POST'])
@auth.auth_required
def updateJournal():
    date_str = request.json['date']
    content = request.json['text']

    # update dropbox
    dropbox = DropboxApi()
    filename = date_str + ".md"
    file_metadata = dropbox.update_file(g.user["dropbox_access_token"], "/journal/" + filename, content)

    # update metadata
    date = date_helpers.parse_date_str(date_str)
    entry_metadata = {}
    if len(content) > 0:
        entry_metadata = TasksParser(date_str, content).to_dict()
        models.entries.create_or_update_entry(g.user["_id"], filename, date, entry_metadata, file_metadata)
        return jsonify({"success": True, **file_metadata})
