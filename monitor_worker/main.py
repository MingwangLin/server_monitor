import asyncio
from cpudata import cpu_info_output, save_cpu_info
from ramdata import ram_info_output, save_ram_info
from diskdata import disk_info_output, save_disk_info


async def coroutine_save_cpu_info():
    cpu_info = cpu_info_output()
    save_cpu_info(cpu_info)



async def coroutine_save_ram_info():
    ram_info = ram_info_output()
    save_ram_info(ram_info)


async def coroutine_save_disk_info():
    disk_info = disk_info_output()
    save_disk_info(disk_info)


def main():
    # 获取EventLoop:
    loop = asyncio.get_event_loop()

    tasks = [coroutine_save_cpu_info(),
             coroutine_save_ram_info(),
             coroutine_save_disk_info()]

    # 执行coroutine
    loop.run_until_complete(asyncio.wait(tasks))

    loop.close()


if __name__ == '__main__':
    main()
