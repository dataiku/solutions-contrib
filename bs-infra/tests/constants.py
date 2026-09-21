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

# Decoded query values: clients encode these when constructing HTTP requests.
# Includes injection payloads and paths outside our deliberately narrow policy;
# rejection does not imply that every value is an exploit on its own.
UNSAFE_BASE_URLS = [
    # HTML tag/attribute breakout and entity syntax at the base-href sink.
    '/"><script>/* regression marker */</script><base href="',
    '/backend" data-injected="yes',
    "/backend' data-injected='yes",
    '/backend<svg>',
    '/backend&#x2f;other',

    # Network-path references (authority), including userinfo and port syntax.
    '//example.invalid/',
    '///example.invalid/',
    '//user@example.invalid:8443/',

    # Explicit schemes are disallowed, regardless of scheme or letter case.
    'https://example.invalid/',
    'HTTPS://example.invalid/',
    'javascript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'https:example.invalid',

    # Document-relative references: the backend mount must start with '/'.
    'backend',
    './backend',
    '../backend',

    # Backslashes and mixed separators must never become path/host separators.
    '/\\example.invalid/',
    '\\example.invalid/',
    '\\\\example.invalid/',
    '/backend\\other',
    '/backend\\g<0>',

    # Empty path segments, including interior and trailing repeated slashes.
    '/backend//other',
    '/backend//',

    # Whitespace/controls must be rejected, not stripped before validation.
    ' /backend',
    '/backend ',
    '/back end',
    '\x00/backend',
    '\t/backend',
    '/\n/example.invalid/',
    '/\r/example.invalid/',
    '/\t/example.invalid/',
    '/backend\n',
    '/backend\x00/',
    '/backend\x7f/',

    # Non-ASCII characters, including whitespace and slash lookalikes.
    '/backend\u00a0/',  # Non-breaking space.
    '/backend\uff0fother',  # Fullwidth solidus, not an ASCII slash.
    '/caf\u00e9/',

    # Query/fragment delimiters would change how the appended asset path works.
    '/backend?next=elsewhere',
    '/backend#fragment',
    '/backend?',
    '/backend#',

    # Dot segments at the root, inside the path, and without a trailing slash.
    '/./backend',
    '/../backend',
    '/backend/../other',
    '/backend/./other',
    '/backend/.',
    '/backend/..',
    '/.',
    '/..',

    # Remaining percent escapes must not undergo another decoding pass.
    # Cover encoded separators, dot segments, markup, controls and delimiters,
    # including mixed-case, partial and double encoding.
    '/%2f%2fexample.invalid/',
    '/%2F%2fexample.invalid/',
    '/%5cexample.invalid/',
    '/backend/%2e%2e/other',
    '/backend/.%2E/other',
    '/backend/%252e%252e/other',
    '/%252f%252fexample.invalid/',
    '/backend%22%3E%3Cscript%3E',
    '/backend%0d%0a/',
    '/backend%00/',
    '/backend%3fquery',
    '/backend%23fragment',
    '/backend%20name',

    # Malformed percent escapes are rejected rather than repaired or ignored.
    '/backend%',
    '/backend%2',
    '/backend%GG',
]

VALID_BASE_URLS = [
    '/backend',
    '/web-apps-backends/PROJECT/app_id/',
    '/web-apps-backends/SOL_RECONCILIATION/sSHVgQQ/',
    '/dss-prefix/html-apps-backends/legacy-id/',
]

# Dataset routes: bound in every context.
DATASET_ROUTES = {
    "/bs_api/dataset/get",
    "/bs_api/dataset/get_schema",
    "/bs_api/dataset/get_generic_data",
    "/bs_api/dataset/get_filtered_dataset",
}
