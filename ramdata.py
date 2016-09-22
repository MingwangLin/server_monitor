import subprocess
import time
from pymongo import MongoClient

client = MongoClient()
db = client.serverData


def log(*args):
    t = time.time()
    tt = time.strftime(r'%Y/%m/%d %H:%M:%S', time.localtime(time.time()))
    print(tt, *args)


def ram_info_output():
    cmd = ['sar -r 3']
    pipe = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE)
    output = (line.decode('utf-8') for line in pipe.stdout)
    return output


def save_ram_info(output):
    for o in output:
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


def main():
    # db.ram.delete_many({})
    ram_info = ram_info_output()
    save_ram_info(ram_info)


if __name__ == '__main__':
    main()
