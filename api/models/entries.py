import pymongo
import datetime
from bson.objectid import ObjectId
import lib.mongo as mongo

entries = mongo.db['entries']
entries.ensure_index([('user_id',pymongo.ASCENDING), ('name',pymongo.ASCENDING)], unique=True, dropDups=True)

def beginning_of_the_month(month, year):
  return datetime.datetime(year, month, 1)

def end_of_month(month, year):
  return datetime.datetime(year, month, 28)

# user_id ObjectId(user)
# name "2015-01-01"
# date datetime.datetime(2015, 1, 1)
# metadata {}
def create_or_update_entry(user_id, name, date, metadata):
  assert user_id is not None
  assert len(name) > 0
  assert date is not None
  assert metadata is not None

  entry = entries.find_one({"user_id": ObjectId(user_id), "name": name})
  if entry:
    entry["metadata"] = metadata
    entry["updatedAt"] = datetime.datetime.utcnow()
    entries.replace_one({"_id": entry["_id"]}, entry)
    return entry["_id"]
  entry = {"user_id": ObjectId(user_id), "name": name, "date": date, "metadata": metadata, "updatedAt": datetime.datetime.utcnow()}
  return entries.insert_one(entry).inserted_id

def find_for_user_and_month(user_id, month, year):
  # from_date = beginning_of_the_month(month, year)
  # end_date = end_of_month(month, year)
  # "date": {"$between": [from_date, end_date]}
  return list(entries.find({"user_id": user_id}))
