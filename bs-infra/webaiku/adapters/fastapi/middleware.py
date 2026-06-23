"""ASGI sub-path mounting for the Code Studio context.

Pure-ASGI analog of Werkzeug's ``DispatcherMiddleware`` (used by the Flask
adapter): strip the Code Studio sub-path prefix from incoming requests so the
app's ``/`` and ``/bs_api/...`` routes match, and 404 anything outside it.

The prefix arrives in ``scope["path"]`` because the Code Studio proxy forwards
the full request URI (``proxiedUrlSuffix: "/$request_uri"`` in the Code Studio
template) — independently of WSGI vs ASGI.
"""

import logging

logger = logging.getLogger("webaiku")


class CodeStudioSubPathMiddleware:
    """Mount the app under ``base``, stripping the prefix before it sees requests."""

    def __init__(self, app, base: str):
        self.app = app
        # Normalise to a single leading slash, no trailing slash: "/foo/bar".
        self.base = "/" + base.strip("/")

    async def __call__(self, scope, receive, send):
        if scope["type"] not in ("http", "websocket"):
            # lifespan and anything else passes straight through.
            await self.app(scope, receive, send)
            return

        path = scope.get("path", "")
        if path == self.base or path.startswith(self.base + "/"):
            # Copy the scope so concurrent requests don't see our mutation.
            scope = dict(scope)
            scope["path"] = path[len(self.base) :] or "/"
            scope["root_path"] = scope.get("root_path", "") + self.base
            await self.app(scope, receive, send)
        else:
            await self._not_found(scope, send)

    async def _not_found(self, scope, send):
        if scope["type"] == "http":
            await send(
                {
                    "type": "http.response.start",
                    "status": 404,
                    "headers": [(b"Content-Type", b"text/plain; charset=utf-8")],
                },
            )
            await send({"type": "http.response.body", "body": b"Not Found"})
        else:  # websocket
            await send({"type": "websocket.close", "code": 1000})
