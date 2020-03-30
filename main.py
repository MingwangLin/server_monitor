import os
from web_app import init_app


def rebuild_db():
    return


def run():
    config = dict(
        debug=True,
    )
    os.environ['FLASK_SETTINGS_MODULE'] = 'server_monitor.settings'
    init_app().run(**config)


if __name__ == '__main__':
    run()
