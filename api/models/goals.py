""" Updating the MongoDB for goals """
import datetime
import pymongo
from bson.objectid import ObjectId
import lib.mongo as mongo

GOALS = mongo.db['goals']
GOALS.ensure_index([('user_id', pymongo.ASCENDING)], dropDups=True)

# user_id ObjectId(user)
# start_date, end_date - inclusive
def create_or_update_entry(user_id: str, start_date: datetime.datetime, end_date: datetime.datetime,
                           metadata: dict, file_metadata: list) -> ObjectId:
    """ Creates or updates a goal """
    assert user_id is not None
    assert start_date is not None
    assert end_date is not None
    assert metadata is not None

    goal = GOALS.find_one({"user_id": ObjectId(user_id), "start_date": start_date, "end_date": end_date})
    if goal:
        goal["metadata"] = metadata
        goal["file_metadata"] = file_metadata
        goal["updatedAt"] = datetime.datetime.utcnow()
        GOALS.replace_one({"_id": goal["_id"]}, goal)
        return goal["_id"]
    goal = {
        "user_id": ObjectId(user_id),
        "start_date": start_date,
        "end_date": end_date,
        "metadata": metadata,
        "updatedAt": datetime.datetime.utcnow(),
        "file_metadata": file_metadata
    }
    return GOALS.insert_one(goal).inserted_id

def get_goals(user_id: str, date: datetime.datetime) -> dict:
    """ Get goals list that are active during the given date """
    return GOALS.find_one({"user_id": user_id, "start_date": {"$lte": date}, "end_date": {"$gte": date}})
