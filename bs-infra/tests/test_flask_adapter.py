"""Flask adapter binding + route invocation.

Driven through `WEBAIKU` (what the generated `wsgi.py` calls) across the three
contexts. DSS is mocked (`fake_api`); `Execution` is real, from the context
fixtures.
"""

import json
import os

import pytest

pytest.importorskip("flask")
from constants import (  # noqa: E402
    API_PORT,
    CS_BASE,
    DATASET_ROUTES,
    LIVE_APP_PATH_ENV,
    RELATIVE_PATH,
    SERVE_ROUTES,
)
from flask import Blueprint, Flask  # noqa: E402

from webaiku.extension import WEBAIKU  # noqa: E402


def _new_app():
    return Flask(__name__)


def _rules(app):
    return {rule.rule for rule in app.url_map.iter_rules()}


# --- Registration ----------------------------------------------------------


def test_dss_binds_serve_and_dataset_routes(dss_env, fake_api):
    app = _new_app()
    WEBAIKU(app, RELATIVE_PATH, API_PORT)
    rules = _rules(app)
    assert SERVE_ROUTES <= rules
    assert DATASET_ROUTES <= rules


def test_code_studio_binds_dataset_but_not_serve(code_studio_env, fake_api):
    app = _new_app()
    WEBAIKU(app, RELATIVE_PATH, API_PORT)
    rules = _rules(app)
    assert DATASET_ROUTES <= rules
    assert not (SERVE_ROUTES & rules)


def test_local_binds_dataset_only(local_env, fake_api):
    app = _new_app()
    WEBAIKU(app, RELATIVE_PATH, API_PORT)
    rules = _rules(app)
    assert DATASET_ROUTES <= rules
    assert not (SERVE_ROUTES & rules)


# --- Invocation ------------------------------------------------------------


def test_serve_route_renders_index_under_dss(dss_env, fake_api):
    app = _new_app()
    WEBAIKU(app, RELATIVE_PATH, API_PORT)
    resp = app.test_client().get("/?URL=/backend")
    assert resp.status_code == 200
    assert resp.mimetype == "text/html"
    assert b'<base href="/backend/myapp/">' in resp.data


def test_dataset_get_returns_json_frame(dss_env, fake_api):
    app = _new_app()
    WEBAIKU(app, RELATIVE_PATH, API_PORT)
    resp = app.test_client().post(
        "/bs_api/dataset/get",
        json={"dataset_name": "ds", "chunksize": 10, "chunk_index": 0},
    )
    assert resp.status_code == 200
    assert resp.mimetype == "application/json"
    assert json.loads(resp.data) == {"col": {"0": 1, "1": 2, "2": 3}}


def test_dataset_get_schema_returns_dict(dss_env, fake_api):
    app = _new_app()
    WEBAIKU(app, RELATIVE_PATH, API_PORT)
    resp = app.test_client().post(
        "/bs_api/dataset/get_schema",
        json={"dataset_name": "ds"},
    )
    assert resp.status_code == 200
    assert json.loads(resp.data) == fake_api.schema


def test_filtered_dataset_forwards_filters(dss_env, fake_api):
    app = _new_app()
    WEBAIKU(app, RELATIVE_PATH, API_PORT)
    resp = app.test_client().post(
        "/bs_api/dataset/get_filtered_dataset",
        json={
            "dataset_name": "ds",
            "chunksize": 10,
            "chunk_index": 0,
            "filters": {"col": ["v1"]},
        },
    )
    assert resp.status_code == 200
    assert "arrayContains" in fake_api.last_chunk_kwargs["filter"]


# --- Custom routes (extend) ------------------------------------------------


def test_extend_registers_custom_blueprint(dss_env, fake_api):
    app = _new_app()
    WEBAIKU(app, RELATIVE_PATH, API_PORT)

    bp = Blueprint("custom", __name__)

    @bp.route("/custom/ping")
    def ping():
        return {"pong": True}

    WEBAIKU.extend(app, [bp])

    resp = app.test_client().get("/custom/ping")
    assert resp.status_code == 200
    assert json.loads(resp.data) == {"pong": True}


# --- Error mapping ---------------------------------------------------------


def test_missing_required_field_maps_to_400(dss_env, fake_api):
    app = _new_app()
    WEBAIKU(app, RELATIVE_PATH, API_PORT)
    resp = app.test_client().post(
        "/bs_api/dataset/get",
        json={"dataset_name": "ds", "chunk_index": 0},  # no `chunksize`
    )
    assert resp.status_code == 400
    assert "chunksize" in json.loads(resp.data)["error"]


def test_extra_field_maps_to_400(dss_env, fake_api):
    app = _new_app()
    WEBAIKU(app, RELATIVE_PATH, API_PORT)
    resp = app.test_client().post(
        "/bs_api/dataset/get",
        json={"dataset_name": "ds", "chunksize": 10, "chunk_index": 0, "zzz": 1},
    )
    assert resp.status_code == 400
    assert isinstance(json.loads(resp.data)["error"], str)


def test_non_integer_chunksize_maps_to_400(dss_env, fake_api):
    app = _new_app()
    WEBAIKU(app, RELATIVE_PATH, API_PORT)
    resp = app.test_client().post(
        "/bs_api/dataset/get",
        json={"dataset_name": "ds", "chunksize": "abc", "chunk_index": 0},
    )
    assert resp.status_code == 400
    assert isinstance(json.loads(resp.data)["error"], str)


def test_malformed_json_maps_to_400(dss_env, fake_api):
    app = _new_app()
    WEBAIKU(app, RELATIVE_PATH, API_PORT)
    resp = app.test_client().post(
        "/bs_api/dataset/get",
        data="{not json",
        content_type="application/json",
    )
    assert resp.status_code == 400
    assert isinstance(json.loads(resp.data)["error"], str)


def test_non_object_body_maps_to_400(dss_env, fake_api):
    app = _new_app()
    WEBAIKU(app, RELATIVE_PATH, API_PORT)
    resp = app.test_client().post("/bs_api/dataset/get", json=123)
    assert resp.status_code == 400
    assert isinstance(json.loads(resp.data)["error"], str)


def test_api_error_maps_to_status(dss_env, failing_api):
    app = _new_app()
    WEBAIKU(app, RELATIVE_PATH, API_PORT)
    resp = app.test_client().post(
        "/bs_api/dataset/get_schema",
        json={"dataset_name": "nope"},
    )
    assert resp.status_code == 404
    assert "error" in json.loads(resp.data)


# --- Code studio sub-path mounting -----------------------------------------


def test_code_studio_serves_under_base_path(code_studio_env, fake_api):
    app = _new_app()
    WEBAIKU(app, RELATIVE_PATH, API_PORT)
    client = app.test_client()

    ok = client.post(
        f"{CS_BASE}/bs_api/dataset/get",
        json={"dataset_name": "ds", "chunksize": 10, "chunk_index": 0},
    )
    assert ok.status_code == 200

    # Outside the sub-path: 404 from the dispatcher.
    missing = client.post(
        "/bs_api/dataset/get",
        json={"dataset_name": "ds", "chunksize": 10, "chunk_index": 0},
    )
    assert missing.status_code == 404


# --- Live smoke ------------------------------------------------------------


@pytest.mark.live
@pytest.mark.skipif(
    "DIP_HOME" not in os.environ or LIVE_APP_PATH_ENV not in os.environ,
    reason=f"needs a live DSS env and {LIVE_APP_PATH_ENV}",
)
def test_live_binds_dataset_routes(fake_api):
    app = _new_app()
    WEBAIKU(app, os.environ[LIVE_APP_PATH_ENV], API_PORT)
    assert DATASET_ROUTES <= _rules(app)
