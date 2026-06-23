"""The adapter wiring contract and framework detection.

Adapters are internal: callers never import them. They share *nothing* at the
per-request level (each is idiomatic to its framework) and conform only to this
two-method wiring interface, through which the unified ``WEBAIKU`` drives them.
"""

from typing import Protocol, runtime_checkable

from webaiku.context import Execution
from webaiku.errors import WebaikuError


@runtime_checkable
class Adapter(Protocol):
    """Interface for framework adapters."""

    def bind(self, app, execution: Execution, api_port: str) -> None:
        """Wire webaiku's serve + dataset routes onto ``app`` for the detected context."""
        ...

    def extend(self, app, children: list) -> None:
        """Register the generated app's own routes onto ``app``."""
        ...


def detect_adapter(app) -> Adapter:
    """Return the adapter matching web framework.

    Only the installed framework is imported, so this
    works whether the user installed ``webaiku[flask]`` or ``webaiku[fastapi]``.
    The matching adapter module is imported lazily, after the type is known.
    """
    try:
        from flask import Flask  # noqa: PLC0415

        if isinstance(app, Flask):
            from webaiku.adapters.flask import FlaskAdapter  # noqa: PLC0415

            return FlaskAdapter()
    except ImportError as err:
        _ = err

    try:
        from fastapi import FastAPI  # noqa: PLC0415

        if isinstance(app, FastAPI):
            from webaiku.adapters.fastapi import FastAPIAdapter  # noqa: PLC0415

            return FastAPIAdapter()
    except ImportError as err:
        # Neither framework matched/installed; fall through to the error below.
        _ = err

    msg = (
        "app instance must be one of Flask or FastAPI. Install the matching extra:"
        "`pip install webaiku[flask]` or `pip install webaiku[fastapi]`."
        f"(received {type(app)!r}"
    )
    raise WebaikuError(msg)
