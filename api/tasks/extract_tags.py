import os
import sys
import shutil

script_path = __file__
if os.path.islink(__file__):
  script_path = os.path.realpath(script_path)

sys.path.insert(0, os.path.join(os.path.dirname(script_path), "../"))

from bson.code import Code
from bson.son  import SON
import lib.mongo as mongo

mapper = Code("""
              function() {
                this.metadata.tags.forEach(function(tag) {
                  emit({type: 'tag', value: tag}, 1);
                });
              }
              """)

reducer = Code("""
               function(key, values) {
                 return 1;
               }
               """)

finalizer = Code("""
                 function(key, reducedValue) {
                    reducedValue._id = ObjectId();
                 }
                 """)


mongo.db.entries.map_reduce(mapper, reducer, out=SON([("replace", "tags"), ("finalize", finalizer)]))
