import time
import pymongo
from pymongo import MongoClient

client = MongoClient()
db = client.serverData


def log(*args):
    t = time.time()
    tt = time.strftime(r'%Y/%m/%d %H:%M:%S', time.localtime(time.time()))
    print(tt, *args)



def find_all_docments():
    cursor = db.cpu.find().sort("time_stamp", pymongo.DESCENDING)
    cpu_load_data = []
    i = 0
    for document in cursor:
        if i < 10:
            cpu_load = document.get('cpu_load')
            cpu_load_data.insert(0, cpu_load)
            i += 1
        else:
            break
    log(cpu_load_data)


def main():
    # db.cpu.delete_many({})
    find_all_docments()


if __name__ == '__main__':
    main()
