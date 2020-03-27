import subprocess
import time
import pymongo
import asyncio
from pymongo import MongoClient
from monitor_worker.mongo_client import db


async def save_cpu_info():
    cmd = ['/usr/bin/iostat']
    pipe = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE)
    # o = o.split()
    # # log(o)
    # cpu_idle_index = -1
    # cpu_idle = o[cpu_idle_index]
    for line in pipe.stdout:
        o = line.decode('utf-8')
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
    return


def find_all_docments():
    cursor = db.cpu.find()
    for document in cursor:
        log(document)
