"""
Main entry, extends a flask app
"""
import logging
from flask import Flask, Blueprint
from typing import Optional
from webaiku.context import Execution, ExecutionContext
from webaiku.blueprints import ServeBlueprint, DataikuDatasetBlueprint
from typing import List

logger = logging.getLogger("webaiku")


class WEBAIKU(object):
    BS_API_PREFIX = "/bs_api"
    API_PREFIX = "/api"

    def __init__(self, app: Optional[Flask], relative_path: str):
        self.exec = Execution(relative_path)
        if not app is None:
            self.init_flask_app(app)

    def init_flask_app(self, app: Flask):
        ## Only register serve blueprint for DATAIKU_DSS context
        if self.exec.context == ExecutionContext.DATAIKU_DSS:
            serve_blueprint = ServeBlueprint(self.exec)
            app.register_blueprint(serve_blueprint.blueprint)

        bs_api_blueprints = [DataikuDatasetBlueprint().blueprint]
        self._register_child_bs_blueprints(app, bs_api_blueprints)

    def _register_child_bs_blueprints(self, app: Flask, children: List[Blueprint]):
        for blueprint in children:
            blueprint.url_prefix = self.BS_API_PREFIX + blueprint.url_prefix
            app.register_blueprint(blueprint=blueprint)

    @staticmethod
    def extend(app: Flask, children: List[Blueprint]):
        for blueprint in children:
            app.register_blueprint(blueprint=blueprint)
