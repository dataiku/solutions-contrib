"""
Main entry, extends a flask app
"""
import logging
from flask import Flask, Blueprint
from typing import Optional
from webaiku.context import Execution, ExecutionContext
from webaiku.blueprints import ServeBlueprint

logger = logging.getLogger("webaiku")


class WEBAIKU(object):
    def __init__(self, app: Optional[Flask], relative_path: str):
        self.exec = Execution(relative_path)
        if not app is None:
            self.init_flask_app(app)

    def init_flask_app(self, app: Flask):
        serve_blueprint = ServeBlueprint(self.exec)
        app.register_blueprint(serve_blueprint.blueprint)
