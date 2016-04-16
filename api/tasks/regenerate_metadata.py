import os
import sys
script_path = __file__
if os.path.islink(__file__):
    script_path = os.path.realpath(script_path)
sys.path.insert(0, os.path.join(os.path.dirname(script_path), "../"))

import lib.mongo as mongo
from app import app
from lib.dropbox          import DropboxApi
import lib.date_helpers   as     date_helpers
from parsers.tasks_parser import TasksParser
import models.entries
import models.user

def dict_without(d, key):
    new_d = d.copy()
    new_d.pop(key)
    return new_d

dropbox = DropboxApi()
for user in mongo.db.users.find():
    if user["dropbox_access_token"] == "fakeId":
        continue

    app.logger.info("Processing update for user {0}".format(user["email"]))

    mongo.db.entries.delete_many({})
    results, cursor = dropbox.get_files_in_folder(user["dropbox_access_token"])
    for result in results:
        app.logger.info("processing file {0}, with name: {1}".format(result["path_lower"], result["name"]))
        response = dropbox.get_file_content(user["dropbox_access_token"], result["path_lower"])
        content = response["content"]
        date_str = result["name"][:-3]
        filename = result["name"]
        try:
            date = date_helpers.parse_date_str(date_str)
        except ValueError as e:
            continue
        entry_metadata = TasksParser(date_str, content).to_dict()
        models.entries.create_or_update_entry(user["_id"], filename, date, entry_metadata, dict_without(response, "content"))

    app.logger.info("Finished processing update for user {0}".format(user["email"]))
