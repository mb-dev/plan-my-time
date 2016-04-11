import os
import sys
script_path = __file__
if os.path.islink(__file__):
    script_path = os.path.realpath(script_path)
sys.path.insert(0, os.path.join(os.path.dirname(script_path), "../"))

import lib.mongo as mongo
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
        entry_mapper(results, "location", "$" + tag, entry)
    for person in entry["metadata"]["people"]:
        entry_mapper(results, "person", "@" + tag, entry)

def run():
    app.logger.info("starting extract_tags task")
    mongo.db.tags.delete_many({})
    for user in mongo.db.users.find():
        results = {}
        for entry in mongo.db.entries.find({"user_id": user["_id"]}):
            mapper(results, entry)

        tags = [{"user_id": user["_id"], **info} for tag, info in results.items()]
        if len(tags) > 0:
            mongo.db.tags.insert_many(tags)
    app.logger.info("finished extract_tags task")

if __name__ == "__main__":
    run()
