"""
Main entry, extends a flask app
"""
import logging
from flask import Flask, Blueprint
from typing import Optional
from webaiku.context import Execution, ExecutionContext
from webaiku.blueprints import ServeBlueprint, DataikuDatasetBlueprint
from typing import List, Union
from werkzeug.middleware.dispatcher import DispatcherMiddleware
from werkzeug.wrappers import Response
import os

logger = logging.getLogger("webaiku")


class WEBAIKU(object):
    BS_API_PREFIX = "/bs_api"
    API_PREFIX = "/api"
    API_PORT_ENV_VAR = "VITE_API_PORT"

    def __init__(
        self,
        app: Optional[Flask],
        relative_path: str,
        api_port: Union[str, int] = os.getenv(API_PORT_ENV_VAR, "5000"),
        prefix: Optional[str] = None,
    ):
        self.exec = Execution(relative_path=relative_path, prefix=prefix)
        self.api_port = str(api_port)
        if not app is None:
            self.init_flask_app(app)

    def __get_code_studio_base(self):
        if (
            self.api_port
            and self.exec.context == ExecutionContext.DATAIKU_DSS_CODE_STUDIO
        ):
            code_studio_browser_path = f"DKU_CODE_STUDIO_BROWSER_PATH_{self.api_port}"
            return os.getenv(code_studio_browser_path, None)
        return None

    def init_flask_app(self, app: Flask):
        ## Only register serve blueprint for DATAIKU_DSS context
        if self.exec.context == ExecutionContext.DATAIKU_DSS_CODE_STUDIO:
            code_studio_base = self.__get_code_studio_base()
            if code_studio_base:
                app.wsgi_app = DispatcherMiddleware(
                    Response("Not Found", status=404), {code_studio_base: app.wsgi_app}
                )
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
