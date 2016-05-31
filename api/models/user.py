import pymongo
from bson.objectid import ObjectId
import lib.mongo as mongo

users = mongo.db['users']
users.ensure_index([('email', pymongo.ASCENDING)], unique=True, dropDups=True)
users.ensure_index([('dropbox_user_id', pymongo.ASCENDING)], unique=True, dropDups=True)

def create_or_find_user(info):
    user = users.find_one({"email": info["email"]})
    if user:
        return user["_id"]
    return users.insert_one(info).inserted_id

def find_user_by_id(id):
    return users.find_one({"_id": ObjectId(id)})

def find_user_by_dropbox_id(id):
    return users.find_one({"dropbox_user_id": id})

def find_user_by_api_key(key):
    return users.find_one({"api_key": key})

def save_hook_cursor(user_id, cursor):
    return users.update_one({"_id": user_id}, {"$set": {"hook_cursor": cursor}})

def save_settings(user_id, settings):
    return users.update_one({"_id": user_id}, {"$set": {"settings": settings}})
