import os
import sys
script_path = __file__
if os.path.islink(__file__):
    script_path = os.path.realpath(script_path)
sys.path.insert(0, os.path.join(os.path.dirname(script_path), "../"))

from bson.code import Code
from bson.son  import SON
import lib.mongo as mongo

def mapper(results, entry):
    for tag in entry["metadata"]["tags"]:
        results[tag] = 'tag'
    for location in entry["metadata"]["locations"]:
        results[location] = 'location'
    for person in entry["metadata"]["people"]:
        results[person] = 'person'


def run():
    mongo.db.tags.delete_many({})
    for user in mongo.db.users.find():
        results = {}
        for entry in mongo.db.entries.find({"user_id": user["_id"]}):
            mapper(results, entry)

        tags = [{"user_id": user["_id"], "tag": tag, "type": type} for tag, type in results.items()]
        if len(tags) > 0:
            mongo.db.tags.insert_many(tags)

if __name__ == "__main__":
    run()
