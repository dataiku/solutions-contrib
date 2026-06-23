"""Framework-free SPA serving logic.

Reads the built ``index.html`` from the resolved webapp folder and rewrites its
``<base>`` tag so the SPA's asset URLs resolve under the DSS-proxied path. The
result is returned as plain bytes; adapters turn it into an HTTP response and
serve the surrounding static assets themselves (Flask via the blueprint's
``static_folder``, FastAPI via a ``StaticFiles`` mount).
"""

import logging
import os
import re
from typing import Optional

from webaiku.context import Execution

logger = logging.getLogger("webaiku")

#: How long the served index page may be cached, in days.
CACHE_DAYS = 30


class RenderedPage:
    """Outcome of rendering the SPA entry point.

    ``found`` is ``False`` when ``index.html`` could not be read, which the
    adapter maps to a 404.
    """

    def __init__(self, html: Optional[bytes], found: bool):
        self.html = html
        self.found = found


class ServeService:
    #: Query-string argument carrying the proxied backend URL.
    URL_ARG_NAME = "URL"
    CACHE_DAYS = CACHE_DAYS

    def __init__(self, execution: Execution):
        self.execution = execution

    def render_index(self, url_arg: Optional[str]) -> RenderedPage:
        """Read ``index.html`` and inject the rewritten ``<base>`` tag.

        ``url_arg`` is the raw value of the ``URL`` query argument (the proxied
        backend base); ``None`` in local dev.
        """
        status, content = self._read_html_file()
        if content is None:
            return RenderedPage(html=None, found=False)
        lib_url = self._static_assets_path(url_arg)
        html = self._make_base_tag(lib_url, content)
        return RenderedPage(html=html, found=status == 200)

    def _backend_url(self, url_arg: Optional[str]) -> Optional[str]:
        if url_arg:
            return url_arg[1:]
        return None

    def _root_static_folder_name(self) -> Optional[str]:
        if self.execution.exec_path:
            return os.path.basename(self.execution.exec_path)
        return None

    def _static_assets_path(self, url_arg: Optional[str]) -> Optional[str]:
        """Server path under which the SPA's static assets are exposed."""
        backend_url = self._backend_url(url_arg)
        static_folder_basename = self._root_static_folder_name()
        if backend_url and static_folder_basename:
            path = os.path.join(backend_url, static_folder_basename)
            if not path.startswith("/"):
                path = "/" + path
            return path
        return None

    def _read_html_file(self) -> tuple[int, Optional[bytes]]:
        html_file_path = os.path.join(self.execution.exec_path, "index.html")
        content: Optional[bytes] = None
        status = 200
        if not os.path.exists(html_file_path):
            status = 404
        else:
            try:
                with open(html_file_path, "rb") as f:
                    content = f.read()
            except PermissionError as err:
                logger.error(f"PermissionError: {err}")
                status = 403
            except OSError as err:
                logger.error(f"OSError: {err}")
                status = 500
        return (status, content)

    def _make_base_tag(self, lib_url: Optional[str], content: bytes) -> bytes:
        html_content = content.decode("utf-8")
        new_href = f"{lib_url}/"
        base_tag = f'<base href="{new_href}">'
        head_pattern = r"<head[^>]*>"

        if re.search(head_pattern, html_content) is None:
            html_content = f"<head>{base_tag}</head>\n" + html_content
        else:
            html_content = re.sub(r"<base[^>]*>", "", html_content)
            html_content = re.sub(head_pattern, f"\\g<0>{base_tag}", html_content)

        return html_content.encode("utf-8")
