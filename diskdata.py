import subprocess
import time
from pymongo import MongoClient

client = MongoClient()
db = client.serverData


def log(*args):
    t = time.time()
    tt = time.strftime(r'%Y/%m/%d %H:%M:%S', time.localtime(time.time()))
    print(tt, *args)


def disk_info_output():
    cmd = ['iostat -d 3']
    pipe = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE)
    output = (line.decode('utf-8') for line in pipe.stdout)
    return output


def save_disk_info(output):
    for o in output:
        # o = o.split()
        # # log(o)
        # disk_idle_index = -1
        # disk_idle = o[disk_idle_index]
        if len(o) > 0 and o[0] not in ('L', 'D', 'v'):  # 通过字符串首字母滤掉不包含CPU信息的行
            # disk_idle_index = -4
            # disk_idle = o[disk_idle_index]
            # if disk_idle != 'disk3' and disk_idle != 'id':
            o = o.split()
            log(o)
            if len(o) > 0:
                disk_read_index = 2
                disk_wrtn_index = 3
                disk_read = o[disk_read_index]
                disk_wrtn = o[disk_wrtn_index]
                timestamp = int(time.time() * 1000)
                db.disk.insert_one(
                    {
                        "disk_read": disk_read,
                        "disk_wrtn": disk_wrtn,
                        "timestamp": timestamp,
                    }
                )


def main():
    # db.disk.delete_many({})
    disk_info = disk_info_output()
    save_disk_info(disk_info)


if __name__ == '__main__':
    main()
