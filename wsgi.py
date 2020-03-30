import logging
from server_monitor import init_app

app = init_app()
app.debug = True
