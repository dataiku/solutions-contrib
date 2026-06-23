"""Typed custom errors.

Core raises the custom errors. Each adapter maps them to an HTTP status
code (the ``status_code`` attribute) and a JSON error body.
"""


class WebaikuError(Exception):
    """Base error. Maps to HTTP 500 unless a subclass overrides it."""

    status_code = 500


class WebaikuBadRequestError(WebaikuError):
    """Invalid client input (bad/missing fields, non-integer chunk args)."""

    status_code = 400


class WebaikuNotFoundError(WebaikuError):
    """A requested resource (dataset, file) does not exist."""

    status_code = 404
