import pymongo
import datetime
from bson.objectid import ObjectId
import lib.mongo as mongo
import lib.date_helpers as date_helpers

entries = mongo.db['entries']
entries.ensure_index([('user_id', pymongo.ASCENDING), ('name', pymongo.ASCENDING)], unique=True, dropDups=True)


# user_id ObjectId(user)
# name "2015-01-01"
# date datetime.datetime(2015, 1, 1)
# metadata {}
def create_or_update_entry(user_id, name, date, metadata, file_metadata):
    assert user_id is not None
    assert len(name) > 0
    assert date is not None
    assert metadata is not None

    entry = entries.find_one({"user_id": ObjectId(user_id), "name": name})
    if entry:
        entry["metadata"] = metadata
        entry["file_metadata"] = file_metadata
        entry["updatedAt"] = datetime.datetime.utcnow()
        entries.replace_one({"_id": entry["_id"]}, entry)
        return entry["_id"]
    entry = {
        "user_id": ObjectId(user_id),
        "name": name,
        "date": date,
        "metadata": metadata,
        "updatedAt": datetime.datetime.utcnow(),
        "file_metadata": file_metadata
    }
    return entries.insert_one(entry).inserted_id


def find_for_user_and_month(user_id, date):
    from_date = date_helpers.beginning_of_the_month(date)
    end_date = date_helpers.end_of_month(date)
    return list(entries.find({"user_id": user_id, "date": {"$gte": from_date, "$lte": end_date}}))


def find_for_user_and_date(user_id, date):
    return entries.find_one({"user_id": user_id, "date": date})
