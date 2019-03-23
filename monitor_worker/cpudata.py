import subprocess
import time
import pymongo
from pymongo import MongoClient

client = MongoClient()
db = client.serverData
db.cpu.create_index([("timestamp", pymongo.DESCENDING)])


def log(*args):
    t = time.time()
    tt = time.strftime(r'%Y/%m/%d %H:%M:%S', time.localtime(time.time()))
    print(tt, *args)


def cpu_info_output():
    cmd = ['/usr/bin/iostat 3']
    pipe = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE)
    output = (line.decode('utf-8') for line in pipe.stdout)
    return output


def save_cpu_info(output):
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


def find_all_docments():
    cursor = db.cpu.find()
    for document in cursor:
        log(document)


def main():
    db.cpu.delete_many({})
    db.ram.delete_many({})
    db.disk.delete_many({})
    cpu_info = cpu_info_output()
    save_cpu_info(cpu_info)
    # find_all_docments()


if __name__ == '__main__':
    main()
