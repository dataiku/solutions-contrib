from flask import Blueprint, request, Request
from webaiku.context import Execution
import os
import logging
from typing import Tuple, Optional

logger = logging.getLogger(__name__)


class ServeBlueprint:
    URL_ARG_NAME = "URL"

    def __init__(self, context: Execution):
        self.context = context
        self._blueprint = Blueprint(
            "serve",
            __name__,
            template_folder=context.exec_path,
            static_folder=context.exec_path,
        )

    def add_routes(self):
        @self._blueprint.route("/init")
        @self._blueprint.route("/")
        @self._blueprint.route("/fetch/bs_init")  ## backward compatibility
        def init():
            status, content = self.__read_html_file()
            lib_url = self.__get_static_assets_path()

            return

    def __get_lib_backend_url(self, request: Request):
        backend_url = request.args.get(self.URL_ARG_NAME)
        if backend_url:
            return backend_url[1:]
        return None

    def __get_static_assets_path(self, request: Request):
        """
        Static assets root server path
        """
        backend_url = self.__get_lib_backend_url()
        static_folder_basename = self.__get_root_static_folder_name()
        if backend_url and static_folder_basename:
            return os.path.join(backend_url, static_folder_basename)
        return None

    def __get_root_static_folder_name(self):
        if self.context.exec_path:
            return os.path.basename(self.context.exec_path)
        return None

    def __read_html_file(self) -> Tuple[int, Optional[bytes]]:
        html_file_path = os.path.join(self.context.exec_path, "index.html")
        content = None
        status = 200
        if not os.path.exists(html_file_path):
            status = 404
        else:
            try:
                with open(html_file_path, "rb") as f:
                    content = f.read()
            except PermissionError as err:
                logger.error("PermissionError: {0}".format(err))
                status = 403  # forbidden
            except OSError as err:
                logger.error("OSError: {0}".format(err))
                status = 500
        return (status, content)
