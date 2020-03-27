import subprocess
import time
import pymongo
from pymongo import MongoClient
from monitor_worker.mongo_client import db


async def save_ram_info():
    cmd = ['/usr/bin/sar -r 0']
    pipe = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE)
    for line in pipe.stdout:
        o = line.decode('utf-8')
        o = o.split()
        if len(o) > 0:
            ram_load_index = 4
            ram_load = o[ram_load_index]
            if ram_load not in ('%memused', '_x86_64_'):  # 滤掉不包含RAM信息的行
                timestamp = int(time.time() * 1000)
                ram_load = float(ram_load)
                db.ram.insert_one(
                    {
                        "ram_load": ram_load,
                        "timestamp": timestamp,
                    }
                )
