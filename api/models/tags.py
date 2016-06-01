import lib.mongo as mongo
import lib.tag_helpers as tag_helpers

tags_table = mongo.db['tags']

def get_all_tags(user_id):
    assert user_id is not None
    tags = list(tags_table.find({"user_id": user_id}))
    for tag in tags:
        del tag['_id']
        del tag['user_id']
    return tags

def update_tag(user_id, tag, settings):
    tag_with_type = tag_helpers.to_tag_with_type(tag)
    return tags_table.update_one({
        "user_id": user_id,
        "tag": tag_with_type["tag"],
        "type": tag_with_type["type"],
    }, {
        "$set": settings,
    })
