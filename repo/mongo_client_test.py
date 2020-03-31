import os
import datetime
from pymongo import MongoClient
from flask import Flask

os.environ['FLASK_SETTINGS_MODULE'] = 'server_monitor.settings'

app = Flask(__name__)
config = os.environ['FLASK_SETTINGS_MODULE']
app.config.from_object(config)

with app.app_context():
    client = MongoClient(host=app.config.get('MONGO_HOST'))
    print('host', app.config.get('MONGO_HOST'))
    db = client.serverData
    collection = db.test_collection
    print('1')

    post = {"author": "Mike",
            "text": "My first blog post!",
            "tags": ["mongodb", "python", "pymongo"],
            "date": datetime.datetime.utcnow()
            }

    posts = db.posts
    print('posts', posts)
    post_id = posts.insert_one(post).inserted_id
    print('post_id', post_id)
