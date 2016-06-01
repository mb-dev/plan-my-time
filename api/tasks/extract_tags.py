import os
import sys
script_path = __file__
if os.path.islink(__file__):
    script_path = os.path.realpath(script_path)
sys.path.insert(0, os.path.join(os.path.dirname(script_path), "../"))

import lib.mongo as mongo
import lib.tag_helpers as tag_helpers
import models.tags
from app import app

def entry_mapper(results, type, item, entry):
    entry_date = entry["metadata"]["date"]
    if item not in results:
        results[item] = {"type": type, "tag": item[1:], "count": 1, "last_date": entry_date}
    else:
        if results[item]["last_date"] < entry_date:
            results[item]["last_date"] = entry_date
        results[item]["count"] += 1

def mapper(results, entry):
    for tag in entry["metadata"]["tags"]:
        entry_mapper(results, "tag", "#" + tag, entry)
    for location in entry["metadata"]["locations"]:
        entry_mapper(results, "location", "$" + location, entry)
    for person in entry["metadata"]["people"]:
        entry_mapper(results, "person", "@" + person, entry)

def run():
    app.logger.info("starting extract_tags task")
    for user in mongo.db.users.find():
        existing_tags = list(mongo.db.tags.find({"user_id": user["_id"]}))
        existing_tags_dict = {}
        for tag in existing_tags:
            existing_tags_dict[tag_helpers.to_tag(tag)] = tag["_id"]
        results = {}
        for entry in mongo.db.entries.find({"user_id": user["_id"]}):
            mapper(results, entry)

        updated_tags_dict = {}
        for tag, info in results.items():
            updated_tags_dict[tag] = True
            if tag in existing_tags_dict:
                models.tags.update_tag(user["_id"], tag, info)
            else:
                mongo.db.tags.insert_one({"user_id": user["_id"], **info})

        # delete all tags that are not existing anymore
        for key, tag_id in existing_tags_dict.items():
            if key not in updated_tags_dict:
                mongo.db.tags.delete_one({"_id": tag_id})
    app.logger.info("finished extract_tags task")

if __name__ == "__main__":
    run()
