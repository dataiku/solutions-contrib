"""Shared values for the test suite, kept out of `conftest` so tests can import
them by name without importing `conftest` itself."""

PROJECT_KEY = "TESTPROJECT"

# First segment (`webapps`) is what the DSS path resolver looks for.
RELATIVE_PATH = "webapps/myapp"

# Basename of `RELATIVE_PATH`: FastAPI mounts assets here, `ServeService` bakes
# it into the base tag.
APP_SLUG = "myapp"

API_PORT = "5000"

# Sub-path the app is proxied under in Code Studio.
CS_BASE = "/cs/proxy/path"

# A live run sets this to a real deployed webapp folder.
LIVE_APP_PATH_ENV = "WEBAIKU_TEST_RELATIVE_PATH"

# Serve routes: bound only under plain `DATAIKU_DSS`.
SERVE_ROUTES = {"/", "/init", "/fetch/bs_init"}

# Dataset routes: bound in every context.
DATASET_ROUTES = {
    "/bs_api/dataset/get",
    "/bs_api/dataset/get_schema",
    "/bs_api/dataset/get_generic_data",
    "/bs_api/dataset/get_filtered_dataset",
}
