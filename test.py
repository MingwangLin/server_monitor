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
        o = o.split()
        # log(o)
        cpu_idle_index = -4
        cpu_idle = o[cpu_idle_index]
        if cpu_idle != 'disk3' and cpu_idle != 'id':
            total = 100
            timestamp = int(time.time()*1000)
            cpu_load = total - int(cpu_idle)
            log(cpu_idle)
            log(timestamp)
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
    #db.cpu.delete_many({})
    output = server_info_output()
    save_to_db(output)
    # find_all_docments()


if __name__ == '__main__':
    main()
