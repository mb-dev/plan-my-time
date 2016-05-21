""" controller for managing goals """
import models.goals

from app                  import app
from flask                import jsonify, request, g
from parsers.goals_parser import GoalsParser
from lib.dropbox          import DropboxApi
from lib import auth, date_helpers

@app.route('/api/goals', methods=['GET'])
@auth.auth_required
def get_goals():
    """ get list of goals """
    date_str = request.args.get('date')
    if not date_str:
        return "missing date", 400
    date = date_helpers.parse_date_str(date_str)
    goals = models.goals.get_goals(g.user["_id"], date)
    return jsonify(goals=goals)

@app.route('/api/goals', methods=['POST'])
@auth.auth_required
def update_goals():
    """ updates the goals file """
    start_date_str = request.form['start_date']
    end_date_str = request.form['end_date']
    start_date = date_helpers.parse_date_str(start_date_str)
    end_date = date_helpers.parse_date_str(end_date_str)

    content = request.form['text']

    # update Dropbox
    dropbox = DropboxApi()
    filename = start_date_str + "-" + end_date_str + ".md"
    file_metadata = dropbox.update_file(g.user["dropbox_access_token"], "/goals/" + filename, content)

    # update metadata
    goal_metadata = {}
    if len(content) > 0:
        goal_metadata = GoalsParser(content).to_dict()
        models.goals.create_or_update_entry(g.user["_id"], start_date, end_date, goal_metadata, file_metadata)
        return jsonify({"success": True, **file_metadata})
