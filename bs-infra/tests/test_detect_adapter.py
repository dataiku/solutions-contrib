"""Tests for framework dispatch in `detect_adapter`."""

import pytest

from webaiku.adapters import detect_adapter
from webaiku.errors import WebaikuError


def test_detects_flask():
    flask = pytest.importorskip("flask")
    from webaiku.adapters.flask import FlaskAdapter

    adapter = detect_adapter(flask.Flask(__name__))
    assert isinstance(adapter, FlaskAdapter)


def test_detects_fastapi():
    fastapi = pytest.importorskip("fastapi")
    from webaiku.adapters.fastapi import FastAPIAdapter

    adapter = detect_adapter(fastapi.FastAPI())
    assert isinstance(adapter, FastAPIAdapter)


def test_unknown_app_raises():
    with pytest.raises(WebaikuError):
        detect_adapter(object())
