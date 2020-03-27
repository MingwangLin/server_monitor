import logging
from server_monitor import init_app

app = init_app()
app.debug = True
gunicorn_error_logger = logging.getLogger('gunicorn.error')
app.logger.handlers = gunicorn_error_logger.handlers
app.logger.setLevel(gunicorn_error_logger.level)
