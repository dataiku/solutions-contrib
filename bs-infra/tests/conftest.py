"""Fixtures for the test suite.

`Execution` reads only env vars and the filesystem, so each DSS context is
reproduced with `monkeypatch` + a `tmp_path` tree. The `get_dataiku_api` instance
(the only thing that opens a real DSS client) is replaced by `FakeDataikuApi`.
"""

from types import SimpleNamespace

import pytest
from constants import API_PORT, CS_BASE, PROJECT_KEY, RELATIVE_PATH
from pandas import DataFrame

from webaiku.context import ExecutionContext

# Wiped before each test so a real DSS env can't leak into the simulated ones.
_DSS_ENV_VARS = (
    "DIP_HOME",
    "DKU_CODE_STUDIO_BROWSER_PATH",
    f"DKU_CODE_STUDIO_BROWSER_PATH_{API_PORT}",
    "DKU_CURRENT_PROJECT_KEY",
    "DKU_PROJECT_LIB_VERSIONED_LOCATION",
    "PYTHONPATH",
)


def _write_index(dir_path):
    dir_path.mkdir(parents=True, exist_ok=True)
    (dir_path / "index.html").write_text(
        "<html><head><title>t</title></head><body>Test</body></html>",
        encoding="utf-8",
    )
    return dir_path


@pytest.fixture
def clean_env(monkeypatch):
    for var in _DSS_ENV_VARS:
        monkeypatch.delenv(var, raising=False)
    return monkeypatch


@pytest.fixture
def local_env(clean_env):
    # No `DIP_HOME`. `exec_path` stays unresolved, which is fine: `LOCAL` binds
    # only the dataset routes and never reads `exec_path`.
    return SimpleNamespace(
        context=ExecutionContext.LOCAL,
        exec_path=None,
        base=None,
    )


@pytest.fixture
def dss_env(clean_env, tmp_path):
    # Lay out `<tmp>/project-python-libs/<KEY>/webapps/myapp` and point
    # `PYTHONPATH` at a segment inside it, as DSS exposes a project's python libs.
    root = tmp_path / "project-python-libs" / PROJECT_KEY
    webapp = _write_index(root / RELATIVE_PATH)
    clean_env.setenv("DIP_HOME", str(tmp_path))
    clean_env.setenv("DKU_CURRENT_PROJECT_KEY", PROJECT_KEY)
    clean_env.setenv("PYTHONPATH", str(root / "python"))
    return SimpleNamespace(
        context=ExecutionContext.DATAIKU_DSS,
        exec_path=str(webapp),
        base=None,
    )


@pytest.fixture
def code_studio_env(clean_env, tmp_path):
    proj_lib = tmp_path / "proj_lib"
    webapp = _write_index(proj_lib / RELATIVE_PATH)
    clean_env.setenv("DIP_HOME", str(tmp_path))
    clean_env.setenv("DKU_CODE_STUDIO_BROWSER_PATH", CS_BASE)
    clean_env.setenv(f"DKU_CODE_STUDIO_BROWSER_PATH_{API_PORT}", CS_BASE)
    clean_env.setenv("DKU_PROJECT_LIB_VERSIONED_LOCATION", str(proj_lib))
    clean_env.setenv("DKU_CURRENT_PROJECT_KEY", PROJECT_KEY)
    return SimpleNamespace(
        context=ExecutionContext.DATAIKU_DSS_CODE_STUDIO,
        exec_path=str(webapp),
        base=CS_BASE,
    )


class FakeDataikuAPI:
    """Mock `DataikuAPI` so no DSS client is constructed.

    Records the last `get_dataset_chunk` kwargs so tests can check the assembled
    filter/grouping. Set `raises` to exercise the adapters' error -> status mapping.
    """

    def __init__(self, schema=None, chunk=None, generic=None, raises=None):
        self.schema = schema if schema is not None else {"columns": [{"name": "col"}]}
        self.chunk = chunk if chunk is not None else DataFrame({"col": [1, 2, 3]})
        self.generic = generic
        self.raises = raises
        self.last_chunk_kwargs = None

    def _maybe_raise(self):
        if self.raises is not None:
            raise self.raises

    def get_dataset_schema(self, dataset):
        self._maybe_raise()
        return self.schema

    def get_dataset_generic_data(self, dataset):
        self._maybe_raise()
        if self.generic is not None:
            return self.generic
        return {"schema": self.schema, "columnsCount": None}

    def get_dataset_chunk(self, dataset, chunk_index, chunksize, **kwargs):
        self._maybe_raise()
        self.last_chunk_kwargs = dict(
            dataset=dataset,
            chunk_index=chunk_index,
            chunksize=chunksize,
            **kwargs,
        )
        return self.chunk


@pytest.fixture
def fake_api(monkeypatch):
    # Patch the name bound in `core.dataset` so `DataikuAPI` is never imported.
    api = FakeDataikuAPI()
    monkeypatch.setattr("webaiku.core.dataset.get_dataiku_api", lambda: api)
    return api


@pytest.fixture
def failing_api(monkeypatch):
    from webaiku.errors import WebaikuNotFoundError

    api = FakeDataikuAPI(
        raises=WebaikuNotFoundError("dataset 'not_available' not found")
    )
    monkeypatch.setattr("webaiku.core.dataset.get_dataiku_api", lambda: api)
    return api
