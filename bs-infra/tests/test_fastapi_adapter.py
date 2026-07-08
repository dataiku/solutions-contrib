"""FastAPI adapter binding + route invocation.

Mirror of the Flask tests, driven through `WEBAIKU` across the three contexts
with DSS mocked. Also carries the 3.9 guardrail on the Pydantic request models.
"""

import os

import pytest

pytest.importorskip("fastapi")
pytest.importorskip("httpx")
from constants import (  # noqa: E402
    API_PORT,
    CS_BASE,
    DATASET_ROUTES,
    LIVE_APP_PATH_ENV,
    RELATIVE_PATH,
    SERVE_ROUTES,
)
from fastapi import APIRouter, FastAPI  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from webaiku.extension import WEBAIKU  # noqa: E402


def _new_app():
    return FastAPI()


def _paths(app):
    return {getattr(route, "path", None) for route in app.routes}


# --- Registration ----------------------------------------------------------


def test_dss_binds_serve_and_dataset_routes(dss_env, fake_api):
    app = _new_app()
    WEBAIKU(app, RELATIVE_PATH, API_PORT)
    paths = _paths(app)
    assert SERVE_ROUTES <= paths
    assert DATASET_ROUTES <= paths


def test_code_studio_binds_dataset_but_not_serve(code_studio_env, fake_api):
    app = _new_app()
    WEBAIKU(app, RELATIVE_PATH, API_PORT)
    paths = _paths(app)
    assert DATASET_ROUTES <= paths
    assert not (SERVE_ROUTES & paths)


def test_local_binds_dataset_only(local_env, fake_api):
    app = _new_app()
    WEBAIKU(app, RELATIVE_PATH, API_PORT)
    paths = _paths(app)
    assert DATASET_ROUTES <= paths
    assert not (SERVE_ROUTES & paths)


# --- Invocation ------------------------------------------------------------


def test_serve_route_renders_index_under_dss(dss_env, fake_api):
    app = _new_app()
    WEBAIKU(app, RELATIVE_PATH, API_PORT)
    resp = TestClient(app).get("/?URL=/backend")
    assert resp.status_code == 200
    assert resp.headers["content-type"].startswith("text/html")
    assert b'<base href="/backend/myapp/">' in resp.content


def test_dataset_get_returns_json_frame(dss_env, fake_api):
    app = _new_app()
    WEBAIKU(app, RELATIVE_PATH, API_PORT)
    resp = TestClient(app).post(
        "/bs_api/dataset/get",
        json={"dataset_name": "ds", "chunksize": 10, "chunk_index": 0},
    )
    assert resp.status_code == 200
    assert resp.json() == {"col": {"0": 1, "1": 2, "2": 3}}


def test_dataset_get_schema_returns_dict(dss_env, fake_api):
    app = _new_app()
    WEBAIKU(app, RELATIVE_PATH, API_PORT)
    resp = TestClient(app).post(
        "/bs_api/dataset/get_schema",
        json={"dataset_name": "ds"},
    )
    assert resp.status_code == 200
    assert resp.json() == fake_api.schema


def test_filtered_dataset_forwards_filters(dss_env, fake_api):
    app = _new_app()
    WEBAIKU(app, RELATIVE_PATH, API_PORT)
    resp = TestClient(app).post(
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


def test_extend_registers_custom_router(dss_env, fake_api):
    app = _new_app()
    WEBAIKU(app, RELATIVE_PATH, API_PORT)

    router = APIRouter()

    @router.get("/custom/ping")
    def ping():
        return {"pong": True}

    WEBAIKU.extend(app, [router])

    resp = TestClient(app).get("/custom/ping")
    assert resp.status_code == 200
    assert resp.json() == {"pong": True}


# --- Error mapping ---------------------------------------------------------


def test_missing_required_field_maps_to_400(dss_env, fake_api):
    app = _new_app()
    WEBAIKU(app, RELATIVE_PATH, API_PORT)
    resp = TestClient(app).post(
        "/bs_api/dataset/get",
        json={"dataset_name": "ds", "chunk_index": 0},  # no `chunksize`
    )
    assert resp.status_code == 400
    assert isinstance(resp.json()["error"], str)
    assert "chunksize" in resp.json()["error"]


def test_extra_field_maps_to_400(dss_env, fake_api):
    app = _new_app()
    WEBAIKU(app, RELATIVE_PATH, API_PORT)
    resp = TestClient(app).post(
        "/bs_api/dataset/get",
        json={"dataset_name": "ds", "chunksize": 10, "chunk_index": 0, "zzz": 1},
    )
    assert resp.status_code == 400
    assert isinstance(resp.json()["error"], str)


def test_non_integer_chunksize_maps_to_400(dss_env, fake_api):
    app = _new_app()
    WEBAIKU(app, RELATIVE_PATH, API_PORT)
    resp = TestClient(app).post(
        "/bs_api/dataset/get",
        json={"dataset_name": "ds", "chunksize": "abc", "chunk_index": 0},
    )
    assert resp.status_code == 400
    assert isinstance(resp.json()["error"], str)


def test_malformed_json_maps_to_400(dss_env, fake_api):
    app = _new_app()
    WEBAIKU(app, RELATIVE_PATH, API_PORT)
    resp = TestClient(app).post(
        "/bs_api/dataset/get",
        content="{not json",
        headers={"content-type": "application/json"},
    )
    assert resp.status_code == 400
    assert isinstance(resp.json()["error"], str)


def test_non_object_body_maps_to_400(dss_env, fake_api):
    app = _new_app()
    WEBAIKU(app, RELATIVE_PATH, API_PORT)
    resp = TestClient(app).post("/bs_api/dataset/get", json=123)
    assert resp.status_code == 400
    assert isinstance(resp.json()["error"], str)


def test_api_error_maps_to_status(dss_env, failing_api):
    app = _new_app()
    WEBAIKU(app, RELATIVE_PATH, API_PORT)
    resp = TestClient(app).post(
        "/bs_api/dataset/get_schema",
        json={"dataset_name": "nope"},
    )
    assert resp.status_code == 404
    assert "error" in resp.json()


# --- code studio sub-path mounting -----------------------------------------


def test_code_studio_serves_under_base_path(code_studio_env, fake_api):
    app = _new_app()
    WEBAIKU(app, RELATIVE_PATH, API_PORT)
    client = TestClient(app)

    ok = client.post(
        f"{CS_BASE}/bs_api/dataset/get",
        json={"dataset_name": "ds", "chunksize": 10, "chunk_index": 0},
    )
    assert ok.status_code == 200

    missing = client.post(
        "/bs_api/dataset/get",
        json={"dataset_name": "ds", "chunksize": 10, "chunk_index": 0},
    )
    assert missing.status_code == 404


# --- Python 3.9 guardrail --------------------------------------------------


def test_pydantic_models_instantiate_on_current_python():
    from webaiku.adapters.fastapi import (
        DatasetChunkRequest,
        DatasetNameRequest,
        FilteredDatasetRequest,
    )

    DatasetNameRequest(dataset_name="ds")
    DatasetChunkRequest(dataset_name="ds", chunksize=10, chunk_index=0)
    model = FilteredDatasetRequest(
        dataset_name="ds",
        chunksize=10,
        chunk_index=0,
        filters={"col": ["v1"]},
    )
    assert model.filters == {"col": ["v1"]}
    assert model.custom_filters is None  # `Optional[...]` default


# --- Live smoke ------------------------------------------------------------


@pytest.mark.live
@pytest.mark.skipif(
    "DIP_HOME" not in os.environ or LIVE_APP_PATH_ENV not in os.environ,
    reason=f"needs a live DSS env and {LIVE_APP_PATH_ENV}",
)
def test_live_binds_dataset_routes(fake_api):
    app = _new_app()
    WEBAIKU(app, os.environ[LIVE_APP_PATH_ENV], API_PORT)
    assert DATASET_ROUTES <= _paths(app)
