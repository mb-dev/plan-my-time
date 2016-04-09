import pymongo
import datetime
from bson.objectid import ObjectId
import lib.mongo as mongo
import lib.date_helpers as date_helpers

tags = mongo.db['tags']

def get_all_tags(user_id):
    assert user_id is not None
    list(tags.find({"user_id": user_id}))
