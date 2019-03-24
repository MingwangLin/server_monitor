import subprocess
import time
import pymongo
from pymongo import MongoClient
from common import log


client = MongoClient()
db = client.serverData
db.disk.create_index([("timestamp", pymongo.DESCENDING)])

def ram_info_generator():
    cmd = ['/usr/bin/sar -r 3']
    pipe = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE)
    info_generator = (line.decode('utf-8') for line in pipe.stdout)
    return next(info_generator)


async def save_ram_info(info_generator):
    while True:
        o = await info_generator
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
        yield

# def main():
#     # db.ram.delete_many({})
#     ram_info = ram_info_output()
#     save_ram_info(ram_info)
#
#
# if __name__ == '__main__':
#     main()
