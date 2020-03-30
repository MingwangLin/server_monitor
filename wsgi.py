import logging
from server_monitor import init_app

application = init_app()
application.debug = True
