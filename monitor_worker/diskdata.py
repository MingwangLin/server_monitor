import subprocess
import time
import pymongo
from pymongo import MongoClient
from repo import db



async def save_disk_info():
    cmd = ['/usr/bin/iostat -d']
    pipe = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE)
    for line in pipe.stdout:
        o = line.decode('utf-8')
        if len(o) > 0 and o[0] not in ('L', 'D'):  # 通过字符串首字母滤掉不包含CPU信息的行
            o = o.split()
            if len(o) > 0:
                disk_read_index = 2
                disk_wrtn_index = 3
                disk_read = o[disk_read_index]
                disk_wrtn = o[disk_wrtn_index]
                disk_read = float(disk_read)
                disk_wrtn = float(disk_wrtn)
                timestamp = int(time.time() * 1000)
                db.disk.insert_one(
                    {
                        "disk_read": disk_read,
                        "disk_wrtn": disk_wrtn,
                        "timestamp": timestamp,
                    }
                )
    return
