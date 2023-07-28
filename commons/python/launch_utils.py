from flask import Flask
import os

from commons.python.fetch.fetch_project import fetch_route
from commons.python.business_solutions_api import (
    business_solutions_api,
    register_child_blueprints,
    dataset_api,
)


def get_local_development_port():
    lcport = os.environ.get("FLASK_RUN_PORT", 5000)
    return int(lcport)


def create_app(app: Flask):
    app.register_blueprint(fetch_route)
    app.register_blueprint(business_solutions_api)
    register_child_blueprints(app, children=[dataset_api])
    return app
