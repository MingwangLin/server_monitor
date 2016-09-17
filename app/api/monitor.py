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
@api.route('/dashboard/data', methods=['GET'])
def charts_data():
    args = request.args
    offset = args.get('offset', '')
    offset = int(offset)
    cursor = db.cpu.find().sort("timestamp", pymongo.DESCENDING)
    cpu_load = []
    cpu_load_time_start = ''
    i = 0
    for document in cursor:
        if i < offset:
            cpu_load_data = document.get('cpu_load')
            cpu_load.insert(0, cpu_load_data)
            cpu_load_time_start = document.get('timestamp')  # 图表头时间点
            i += 1
        else:
            break
    data = {
        'cpu_load': cpu_load,
        'cpu_load_time_start': cpu_load_time_start,
        'success': True,
    }
    log('cpu_load_time_start', cpu_load_time_start)
    return jsonify(data)

# # 实时更新 dashboard 数据
# @api.route('/dashboard/data/update', methods=['GET'])
# def new_data_per_second():
#     cursor = db.cpu.find().sort("timestamp", pymongo.DESCENDING)
#     cpu_load = cursor[0].get('cpu_load')
#     data = {
#         'cpu_load': cpu_load,
#         'success': True,
#     }
#     log('data', data)
#     return jsonify(data)
