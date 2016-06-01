TYPE_SYMBOL_TO_WORD = {
    "$": "location",
    "@": "person",
    "#": "tag",
}

TYPE_WORD_TO_SYMBOL = {
    "location": "$",
    "person": "@",
    "tag": "#",
}

def to_tag_with_type(tag):
    return {"type": TYPE_SYMBOL_TO_WORD[tag[0]], "tag": tag[1:]}

def to_tag(tag_with_type):
    return TYPE_WORD_TO_SYMBOL[tag_with_type["type"]] + tag_with_type["tag"]
