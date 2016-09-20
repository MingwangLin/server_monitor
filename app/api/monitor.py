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


@api.route('/dashboard/cpu/data', methods=['GET'])
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
            timestamp = document.get('timestamp')  # CPU每秒负载率对应的时间点
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

@api.route('/dashboard/ram/data', methods=['GET'])
def charts_data():
    args = request.args
    limit = args.get('limit', '')
    log('limit', limit)
    limit = int(limit)
    cursor = db.ram.find().sort("timestamp", pymongo.DESCENDING)
    ram_load = []  # 列表中的元素为RAM每秒负载率
    ram_load_time = []  # 列表中的元素为RAM每秒负载率对应的时间点
    ram_load_couples = []  # 列表中的元素为子列表，每个子列表有2个元素：RAM每秒负载率以及其对应的时间点
    i = 0
    for document in cursor:
        if i < limit:
            ram_load_data = document.get('ram_load')  # RAM每秒负载率
            timestamp = document.get('timestamp')  # CPU每秒负载率对应的时间点
            ram_load.insert(0, ram_load_data)
            ram_load_time.insert(0, timestamp)
            ram_load_couples.insert(0, [timestamp, ram_load_data])
            i += 1
        else:
            break
    data = {
        'ram_load': ram_load,
        'ram_load_time': ram_load_time,
        'ram_load_couples': ram_load_couples,
        'success': True,
    }
    return jsonify(data)
