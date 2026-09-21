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
from html import escape
from typing import Optional
from urllib.parse import quote

from webaiku.context import Execution
from webaiku.errors import WebaikuBadRequestError

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

        ``url_arg`` is the decoded value of the ``URL`` query argument (the proxied
        backend base); ``None`` in local dev. Supplied values must be canonical,
        absolute same-origin paths, not URLs with an authority or encoded syntax.
        """
        lib_url = self._static_assets_path(url_arg)
        status, content = self._read_html_file()
        if content is None:
            return RenderedPage(html=None, found=False)
        html = self._make_base_tag(lib_url, content)
        return RenderedPage(html=html, found=status == 200)

    def _backend_url(self, url_arg: Optional[str]) -> Optional[str]:
        """Validate and return the backend path supplied in the URL parameter.

        For example, accept ``/web-apps-backends/PROJECT/APP/`` unchanged.
        "Absolute path" means starting at the site's root with ``/``; it does
        not mean a full URL such as ``https://example.com/path``. A path without
        a scheme or hostname stays on the page's origin (scheme, host and port).
        This validates the path's syntax, not the caller's access to that path.

        Return None if the parameter is missing or empty. Raise
        WebaikuBadRequestError if a supplied value is unsafe to use as a base.
        """
        if not url_arg:
            return None
        # Flask/FastAPI already decoded the query parameter. Do not decode it
        # again: remaining percent escapes could hide slashes or dot segments.
        if (
            # Require a leading slash and allow only these path characters.
            # This excludes HTML quotes/tags, backslashes, whitespace/control
            # characters, percent escapes, and URL query/fragment syntax.
            re.fullmatch(r"/[A-Za-z0-9._~/-]*", url_arg) is None
            # A leading // means "another host" to a browser. Reject repeated
            # slashes anywhere to also avoid ambiguous path normalization.
            or "//" in url_arg
            # Browsers resolve . and .. segments, potentially changing the
            # intended asset path. Dots within a name, such as app.v1, are OK.
            or any(part in {".", ".."} for part in url_arg.split("/"))
        ):
            # Stop rendering instead of trying to repair unsafe input. This
            # exception has status_code=400; both adapters catch it and return
            # {"error": "URL must be an absolute same-origin path."} as JSON.
            # "URL" names the query parameter, not the whole request address.
            # The message is fixed: it does not echo the untrusted input.
            raise WebaikuBadRequestError("URL must be an absolute same-origin path.")
        return url_arg

    def _root_static_folder_name(self) -> Optional[str]:
        if self.execution.exec_path:
            return os.path.basename(self.execution.exec_path)
        return None

    def _static_assets_path(self, url_arg: Optional[str]) -> Optional[str]:
        """Server path under which the SPA's static assets are exposed."""
        backend_url = self._backend_url(url_arg)
        static_folder_basename = self._root_static_folder_name()
        if backend_url and static_folder_basename:
            # A filesystem name is a single URL path segment, not URL syntax.
            return backend_url.rstrip("/") + "/" + quote(static_folder_basename, safe="")
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
        base_tag = f'<base href="{escape(new_href, quote=True)}">'
        head_pattern = r"<head[^>]*>"

        if re.search(head_pattern, html_content) is None:
            html_content = f"<head>{base_tag}</head>\n" + html_content
        else:
            html_content = re.sub(r"<base[^>]*>", "", html_content)
            html_content = re.sub(
                head_pattern, lambda match: match.group(0) + base_tag, html_content
            )

        return html_content.encode("utf-8")
