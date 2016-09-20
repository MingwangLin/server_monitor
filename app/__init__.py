# -*- coding: utf-8 -*-
from flask import Flask
import subprocess
import time
from pymongo import MongoClient

client = MongoClient()
db = client.serverData


def log(*args):
    t = time.time()
    tt = time.strftime(r'%Y/%m/%d %H:%M:%S', time.localtime(time.time()))
    print(tt, *args)


def server_info_output():
    cmd = ['iostat 1']
    pipe = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE)
    output = (line.decode('utf-8') for line in pipe.stdout)
    return output


def save_to_db(output):
    for o in output:
        # o = o.split()
        # # log(o)
        # cpu_idle_index = -1
        # cpu_idle = o[cpu_idle_index]
        if len(o) > 0 and o[0] not in ('L', 'a', 'D', 'v'):  # 通过字符串首字母滤掉不包含CPU信息的行
            # cpu_idle_index = -4
            # cpu_idle = o[cpu_idle_index]
            # if cpu_idle != 'disk3' and cpu_idle != 'id':
            o = o.split()
            if len(o) > 0:
                cpu_idle_index = -1
                cpu_idle = o[cpu_idle_index]
                total = 100
                timestamp = int(time.time() * 1000)
                cpu_load = total - float(cpu_idle)
                cpu_load = round(cpu_load, 2)
                db.cpu.insert_one(
                    {
                        "cpu_load": cpu_load,
                        "timestamp": timestamp,
                    }
                )


# 把 flask 的初始化放到函数中
# 由外部启动函数来调用

def init_app():
    # 初始化并配置 flask
    app = Flask(__name__)
    app.secret_key = 'TODO fixme'
    from .api import api as api
    # 注册蓝图
    app.register_blueprint(api)
    # 服务器信息写入数据库
    output = server_info_output()
    save_to_db(output)
    # 把 app 引用返回
    return app
