from flask import Flask
import sys
import os
sys.path.insert(0,os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from commons.python.fetch.fetch_project import fetch_route
from commons.python.business_solutions_api import business_solutions_api
# from commons.python.caching import cache

from dotenv import load_dotenv
load_dotenv()

if os.environ.get("FLASK_RUN_PORT") == None: os.environ["FLASK_RUN_PORT"] = "5000"

def get_local_development_port():
    lcport = os.environ.get("FLASK_RUN_PORT")
    if lcport != None:
        return int(lcport)
    return 5000

def create_app(app_name: str):
    app = Flask(app_name)

    # cache.init_app(app=app)

    app.register_blueprint(fetch_route)
    app.register_blueprint(business_solutions_api)
    return app