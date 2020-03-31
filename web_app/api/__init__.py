from flask import Blueprint

api = Blueprint('api', __name__, template_folder='../static')

from . import monitor