import pymongo
from flask import jsonify
from . import api
from .treelog import log
from flask import request
from flask import render_template
from pymongo import MongoClient

client = MongoClient()
db = client.serverData


@api.route('/')
def homepage_view():
    return render_template('main.html')


# 请求首页数据， 显示dashboard
@api.route('dashboard/data', methods=['GET'])
def charts_data():
    args = request.args
    limit = args.get('limit', '')
    log('limit', limit)
    limit = int(limit)
    cursor = db.cpu.find().sort("timestamp", pymongo.DESCENDING)
    cpu_load = []  # 列表中的元素为CPU每秒负载率
    cpu_load_time = []  # 列表中的元素为CPU每秒负载率对应的时间点
    cpu_load_couples = []  # 列表中的元素为子列表，每个子列表有2个元素：CPU每秒负载率以及其对应的时间点
    i = 0
    for document in cursor:
        if i < limit:
            cpu_load_data = document.get('cpu_load')  # CPU每秒负载率
            timestamp = document.get('timestamp') # CPU每秒负载率对应的时间点
            cpu_load.insert(0, cpu_load_data)
            cpu_load_time.insert(0, timestamp)
            cpu_load_couples.insert(0, [timestamp, cpu_load_data])
            i += 1
        else:
            break
    data = {
        'cpu_load': cpu_load,
        'cpu_load_time': cpu_load_time,
        'cpu_load_couples': cpu_load_couples,
        'success': True,
    }
    return jsonify(data)

