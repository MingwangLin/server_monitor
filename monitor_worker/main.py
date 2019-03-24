import asyncio
from cpudata import cpu_info_generator, save_cpu_info, db
from ramdata import ram_info_generator, save_ram_info
from diskdata import disk_info_generator, save_disk_info


async def task_save_cpu_info():
    info_generator =  cpu_info_generator()
    print('save_cpu_info 0')
    await save_cpu_info(info_generator)
    print('save_cpu_info 1')


async def task_save_ram_info():
    info_generator = ram_info_generator()
    print('save_ram_info 0')
    await save_ram_info(info_generator)
    print('save_ram_info 1')


async def task_save_disk_info():
    info_generator = disk_info_generator()
    print('save_disk_info 0')
    await save_disk_info(info_generator)
    print('save_disk_info 1')


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
