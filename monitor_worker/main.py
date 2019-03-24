import asyncio
from cpudata import save_cpu_info, db
from ramdata import save_ram_info
from diskdata import save_disk_info


async def task_save_cpu_info():
    await save_cpu_info()
    print('save_cpu_info')


async def task_save_ram_info():
    await save_ram_info()
    print('save_ram_info')


async def task_save_disk_info():
    await save_disk_info()
    print('save_disk_info')


def main():
    # 清空数据
    db.cpu.delete_many({})
    db.ram.delete_many({})
    db.disk.delete_many({})

    # 获取EventLoop:
    loop = asyncio.get_event_loop()

    tasks = [task_save_cpu_info(),
             task_save_ram_info(),
             task_save_disk_info()]

    # 执行coroutine
    loop.run_until_complete(asyncio.wait(tasks))
    loop.run_forever()


if __name__ == '__main__':
    main()
