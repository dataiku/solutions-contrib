from flask import Blueprint, request, Request, make_response, render_template
from webaiku.context import Execution
import os
import logging
from typing import Tuple, Optional
from datetime import datetime, timedelta
import re


logger = logging.getLogger(__name__)


class ServeBlueprint(object):
    URL_ARG_NAME = "URL"
    CACHE_DAYS = 30

    def __init__(self, context: Execution):
        self.context = context
        self._blueprint = Blueprint(
            "serve",
            __name__,
            template_folder=context.exec_path,
            static_folder=context.exec_path,
        )
        self.add_routes()

    @property
    def blueprint(self):
        return self._blueprint

    def add_routes(self):
        @self._blueprint.route("/init")
        @self._blueprint.route("/")
        @self._blueprint.route("/fetch/bs_init")  ## backward compatibility
        def init():
            lib_url = self.__get_static_assets_path(request=request)
            status, content = self.__read_html_file()
            expiry_time = datetime.utcnow() + timedelta(days=self.CACHE_DAYS)
            modified_content: Optional[bytes] = None
            if content:
                modified_content = self.__make_base_tag(
                    lib_url=lib_url, content=content
                )

            response = make_response(render_template("index.html"))
            response.data = modified_content
            if status == 200:
                response.headers[
                    "Cache-Control"
                ] = f"public, max-age={self.CACHE_DAYS * 86400}"
                response.headers["Expires"] = expiry_time.strftime(
                    "%a, %d %b %Y %H:%M:%S GMT"
                )

            return response

    def __get_lib_backend_url(self, request: Request):
        backend_url = request.args.get(self.URL_ARG_NAME)
        if backend_url:
            return backend_url[1:]
        return None

    def __get_static_assets_path(self, request: Request):
        """
        Static assets root server path
        """
        backend_url = self.__get_lib_backend_url(request=request)
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

    def __make_base_tag(self, lib_url, content: bytes):
        html_content = content.decode("utf-8")
        new_href = f"{lib_url}/"
        base_tag = f'<base href="{new_href}">'
        head_pattern = r"<head[^>]*>"

        # Check if <head> tag exists, and if not, create one
        if re.search(head_pattern, html_content) is None:
            html_content = f"<head>{base_tag}</head>\n" + html_content
        else:
            # If <head> tag exists, add or replace <base> tag inside it
            html_content = re.sub(r"<base[^>]*>", "", html_content)
            html_content = re.sub(head_pattern, f"\\g<0>{base_tag}", html_content)

        return html_content.encode("utf-8")
