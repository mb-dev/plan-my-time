import lib.mongo as mongo

tags_table = mongo.db['tags']

def get_all_tags(user_id):
    assert user_id is not None
    tags = list(tags_table.find({"user_id": user_id}))
    for tag in tags:
        del tag['_id']
        del tag['user_id']
    return tags
