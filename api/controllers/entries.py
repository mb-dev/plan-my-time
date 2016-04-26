import models.entries
import lib.date_helpers   as     date_helpers
from app                  import app
from flask                import jsonify, request, g
from lib                  import auth
from parsers.tasks_parser import TasksParser
from lib.dropbox          import DropboxApi

@app.route('/api/entries', methods=['GET'])
@auth.auth_required
def getEntries():
    query = {}
    tag = request.args.get('tag')
    date_str = request.args.get('date')
    if tag:
        query["tag"] = tag
    if date_str:
        date = date_helpers.parse_date_str(date_str)
        query["date"] = date
    if len(query) == 0:
        return "missing query parameters", 400
    entries = models.entries.find_for_user(g.user["_id"], query)
    return jsonify(entries=entries)

def perform_update(date_str, date, action, params):
    metadata = models.entries.find_one_for_user_and_date(g.user["_id"], date)
    parser = TasksParser(date_str, "")
    parser.from_dict(metadata["metadata"])
    if action == 'add_line':
        parser.add_line(params["line"])
    elif action == 'edit_line':
        parser.edit_line(params["prev_line"], params["new_line"])
    content = parser.to_tasks_file()
    entry_metadata = parser.to_dict()

    # update dropbox
    dropbox = DropboxApi()
    filename = date_str + ".md"
    file_metadata = dropbox.update_file(g.user["dropbox_access_token"], "/" + filename, content)
    return models.entries.create_or_update_entry(g.user["_id"], filename, date, entry_metadata, file_metadata)

@app.route('/api/entries', methods=['POST'])
@auth.auth_required
def addEntry():
    line = request.form['line']
    print(line)
    date_str = request.form['date']
    date = date_helpers.parse_date_str(date_str)
    perform_update(date_str, date, 'add_line', {"line": line})
    entries = models.entries.find_for_user(g.user["_id"], {"date": date})
    return jsonify(entries=entries)

@app.route('/api/entries', methods=['PUT'])
@auth.auth_required
def editEntry():
    prev_line = request.form['prev_line']
    new_line = request.form['new_line']
    date_str = request.form['date']
    date = date_helpers.parse_date_str(date_str)
    perform_update(date_str, date, 'edit_line', {"prev_line": prev_line, "new_line": new_line})
    entries = models.entries.find_for_user(g.user["_id"], {"date": date})
    return jsonify(entries=entries)

@app.route('/api/entries/:id', methods=['DELETE'])
@auth.auth_required
def deleteEntry():
    pass
