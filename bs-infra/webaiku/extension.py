"""Public entry point.

A single ``WEBAIKU`` object works with either a Flask or a FastAPI app: it
detects the framework from the app instance (via one shared ``detect_adapter``
helper) and uses the matching internal adapter.
"""

import logging
import os
from typing import Any, Optional, Union

from webaiku.adapters import Adapter, detect_adapter
from webaiku.constants import API_PORT_ENV_VAR, API_PREFIX, BS_API_PREFIX
from webaiku.context import Execution

logger = logging.getLogger("webaiku")


class WEBAIKU:
    # Kept as class attributes for backward compatibility.
    BS_API_PREFIX = BS_API_PREFIX
    API_PREFIX = API_PREFIX
    API_PORT_ENV_VAR = API_PORT_ENV_VAR

    def __init__(
        self,
        app: Optional[Any],
        relative_path: str,
        api_port: Union[int, str] = os.getenv(API_PORT_ENV_VAR, "5000"),
        prefix: Optional[str] = None,
    ):
        """Construct and (if ``app`` is given) bind immediately.

        ``app`` may be ``None`` to construct now and bind later via
        ``init_app`` (the Flask-style app-factory / deferred-binding pattern).
        """
        self.execution = Execution(relative_path=relative_path, prefix=prefix)
        self.api_port = api_port
        self._adapter: Optional[Adapter] = None
        if app is not None:
            self.init_app(app)

    def init_app(self, app) -> Adapter:
        """Bind to ``app``, detecting Flask vs FastAPI and use the matching adapter."""
        self._adapter = detect_adapter(app)
        self._adapter.bind(app, self.execution, self.api_port)
        return self._adapter

    @staticmethod
    def extend(app, children: list) -> None:
        """Register the app's own routes (Flask ``Blueprint`` or FastAPI ``APIRouter``).

        Dispatch on the app's framework via ``detect_adapter``.
        """
        detect_adapter(app).extend(app, children)
