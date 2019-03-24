import subprocess
import time
import pymongo
from pymongo import MongoClient
from common import log

client = MongoClient()
db = client.serverData
db.cpu.create_index([("timestamp", pymongo.DESCENDING)])


def cpu_info_generator():
    cmd = ['/usr/bin/iostat 3']
    pipe = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE)
    info_generator = (line.decode('utf-8') for line in pipe.stdout)
    return info_generator


def save_cpu_info(info_generator):
    while True:
        o = await next(info_generator())
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
        yield


def find_all_docments():
    cursor = db.cpu.find()
    for document in cursor:
        log(document)

#
# def main():
#     db.cpu.delete_many({})
#     db.ram.delete_many({})
#     db.disk.delete_many({})
#     cpu_info = cpu_info_output()
#     save_cpu_info(cpu_info)
#     # find_all_docments()
#
#
# if __name__ == '__main__':
#     main()
