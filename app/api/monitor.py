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
def cpu_charts_data():
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
def ram_charts_data():
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
            timestamp = document.get('timestamp')  # RAM每秒负载率对应的时间点
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


@api.route('/dashboard/disk/data', methods=['GET'])
def disk_charts_data():
    args = request.args
    limit = args.get('limit', '')
    log('limit', limit)
    limit = int(limit)
    cursor = db.disk.find().sort("timestamp", pymongo.DESCENDING)
    disk_read = []  # 列表中的元素为DISK每秒读数据大小
    disk_wrtn = []  # 列表中的元素为DISK每秒写数据大小
    disk_io_time = []  # 列表中的元素为DISK每秒I/O对应的时间点
    disk_read_couples = []  # 列表中的元素为子列表，每个子列表有2个元素：DISK每秒读数据大小以及其对应的时间点
    disk_wrtn_couples = []  # 列表中的元素为子列表，每个子列表有2个元素：DISK每秒写数据大小以及其对应的时间点
    i = 0
    for document in cursor:
        if i < limit:
            disk_read_data = document.get('disk_read')  # DISK每秒I/O
            disk_wrtn_data = document.get('disk_wrtn')  # DISK每秒I/O
            timestamp = document.get('timestamp')  # 每秒I/O对应的时间点
            disk_read.insert(0, disk_read_data)
            disk_read.insert(0, disk_wrtn_data)
            disk_io_time.insert(0, timestamp)
            disk_read_couples.insert(0, [timestamp, disk_read_data])
            disk_wrtn_couples.insert(0, [timestamp, disk_wrtn_data])
            i += 1
        else:
            break
    data = {
        'disk_read': disk_read,
        'disk_wrtn': disk_wrtn,
        'disk_io_time': disk_io_time,
        'disk_read_couples': disk_read_couples,
        'disk_wrtn_couples': disk_wrtn_couples,
        'success': True,
    }
    return jsonify(data)
