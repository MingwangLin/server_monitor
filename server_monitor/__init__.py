import os
from flask import Flask

# 把 flask 的初始化放到函数中
# 由外部启动函数来调用

def init_app():
    # 初始化并配置 flask
    app = Flask(__name__)
    config = os.environ['FLASK_SETTINGS_MODULE']
    app.config.from_object(config)
    from web_app .api import api as api
    # 注册蓝图
    app.register_blueprint(api)
    return app
