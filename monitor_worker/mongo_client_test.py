from pymongo import MongoClient
import datetime

client = MongoClient()
db = client.test_database
collection = db.test_collection
print('1')

post = {"author": "Mike",
        "text": "My first blog post!",
        "tags": ["mongodb", "python", "pymongo"],
        "date": datetime.datetime.utcnow()}

posts = db.posts
print('posts', posts)

post_id = posts.insert_one(post).inserted_id
print('post_id', post_id)