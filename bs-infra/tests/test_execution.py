"""`Execution` context detection and path resolution.

Every context and branch is driven via `monkeypatch` + `tmp_path` (fixtures in
`conftest`). Live smoke test checks the real env when run inside DSS.
"""

import os

import pytest
from constants import API_PORT, CS_BASE, LIVE_APP_PATH_ENV, RELATIVE_PATH

from webaiku.context import Execution, ExecutionContext
from webaiku.errors import WebaikuError

# --- Context detection -----------------------------------------------------


def test_local_context_when_no_dip_home(local_env):
    execution = Execution(relative_path=RELATIVE_PATH)
    assert execution.context == ExecutionContext.LOCAL
    assert execution.dss_current_project is None


def test_dss_context_and_exec_path(dss_env):
    execution = Execution(relative_path=RELATIVE_PATH)
    assert execution.context == ExecutionContext.DATAIKU_DSS
    assert execution.exec_path == dss_env.exec_path
    assert os.path.isfile(os.path.join(execution.exec_path, "index.html"))


def test_code_studio_context_and_exec_path(code_studio_env):
    execution = Execution(relative_path=RELATIVE_PATH)
    assert execution.context == ExecutionContext.DATAIKU_DSS_CODE_STUDIO
    assert execution.exec_path == code_studio_env.exec_path


# --- code_studio_base ------------------------------------------------------


def test_code_studio_base_reads_per_port_env(code_studio_env):
    execution = Execution(relative_path=RELATIVE_PATH)
    # Raw per-port sub-path the app will strip.
    assert execution.code_studio_base(API_PORT) == CS_BASE


def test_code_studio_base_none_outside_code_studio(dss_env):
    execution = Execution(relative_path=RELATIVE_PATH)
    assert execution.code_studio_base(API_PORT) is None


# --- Raise paths -----------------------------------------------------------


def test_dss_raises_when_webapp_folder_missing(dss_env):
    # Unresolvable path must raise under the strict `DATAIKU_DSS` context.
    with pytest.raises(WebaikuError):
        Execution(relative_path="webapps/does_not_exist")


def test_code_studio_raises_without_versioned_lib_location(code_studio_env, clean_env):
    clean_env.delenv("DKU_PROJECT_LIB_VERSIONED_LOCATION", raising=False)
    with pytest.raises(WebaikuError):
        Execution(relative_path=RELATIVE_PATH)


# --- Live smoke ------------------------------------------------------------


@pytest.mark.live
@pytest.mark.skipif(
    "DIP_HOME" not in os.environ or LIVE_APP_PATH_ENV not in os.environ,
    reason=f"needs a live DSS env and {LIVE_APP_PATH_ENV}",
)
def test_live_execution_resolves():
    execution = Execution(relative_path=os.environ[LIVE_APP_PATH_ENV])
    assert execution.context in (
        ExecutionContext.DATAIKU_DSS,
        ExecutionContext.DATAIKU_DSS_CODE_STUDIO,
    )
    assert execution.exec_path and os.path.isdir(execution.exec_path)
