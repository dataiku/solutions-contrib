"""
Main entry, extends a flask app
"""
import logging
from flask import Flask, Blueprint
from typing import Optional
from webaiku.context import Execution, ExecutionContext

logger = logging.getLogger("webaiku")


class WEBAIKU(object):
    def __init__(self, app: Optional[Flask], relative_path: str):
        self.exec = Execution(relative_path)
        if not app is None:
            self.init_flask_app(app)

    def init_flask_app(self, app: Flask):
        # 1. Add static folder & template folders to main app instance
        if self.exec.context == ExecutionContext.DATAIKU_DSS:
            app.static_folder = self.exec.exec_path
            app.template_folder = self.exec.exec_path

        # 2. Register blueprints
