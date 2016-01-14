import pymongo
from pymongo import MongoClient
from bson.objectid import ObjectId

client = MongoClient('localhost', 27017)
db = client['plan-my-time']
users = db['users']

users.ensure_index([('email',pymongo.ASCENDING)], unique=True, dropDups=True)

def create_or_find_user(info):
  user = users.find_one({"email": info["email"]})
  if user:
    return user["_id"]
  return users.insert_one(info).inserted_id

def find_user_by_id(id):
  return users.find_one({"_id": ObjectId(id)})
