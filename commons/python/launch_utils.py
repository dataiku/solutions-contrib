from flask import Flask
import sys
import os
sys.path.insert(0,os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from commons.python.fetch.fetch_project import fetch_route
from commons.python.business_solutions_api import business_solutions_api
from commons.python.caching import cache

def create_app(app_name: str):
    app = Flask(app_name)

    cache.init_app(app=app)

    app.register_blueprint(fetch_route)
    app.register_blueprint(business_solutions_api)
    return app