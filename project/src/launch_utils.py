from typing import Callable, Optional
from flask import Flask
import sys
import os
sys.path.insert(0,os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from commons.python.fetch.fetch_project import fetch_route
from project.src.fetch_api import fetch_api
from project.src.caching import enable_caching


def create_app(app_name: str, after_created: Optional[Callable[[Flask], None]]=None):
    app = Flask(app_name)
    if after_created != None:
        after_created(app);
    
    enable_caching(app=app)

    app.register_blueprint(fetch_route)
    app.register_blueprint(fetch_api)

    return app
