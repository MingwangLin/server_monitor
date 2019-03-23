import subprocess
import time
import pymongo
from pymongo import MongoClient
from common import log


client = MongoClient()
db = client.serverData
db.disk.create_index([("timestamp", pymongo.DESCENDING)])


def disk_info_output():
    cmd = ['/usr/bin/iostat -d 3']
    pipe = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE)
    output = (line.decode('utf-8') for line in pipe.stdout)
    return output


def save_disk_info(output):
    for o in output:
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

#
# def main():
#     # db.disk.delete_many({})
#     disk_info = disk_info_output()
#     save_disk_info(disk_info)
#
#
# if __name__ == '__main__':
#     main()
