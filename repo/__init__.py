import os
import pymongo
from pymongo import MongoClient
from flask import Flask

app = Flask(__name__)
config = os.environ['FLASK_SETTINGS_MODULE']
app.config.from_object(config)


with app.app_context():
    client = MongoClient(host=app.config.get('MONGO_HOST'))
    db = client.serverData
    db.cpu.create_index([("timestamp", pymongo.DESCENDING)])


