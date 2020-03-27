import pymongo
from pymongo import MongoClient
from server_monitor import init_app
init_app().run()
from flask import current_app as app

client = MongoClient(host=app.config.get('MONGO_HOST'))
db = client.serverData
db.cpu.create_index([("timestamp", pymongo.DESCENDING)])