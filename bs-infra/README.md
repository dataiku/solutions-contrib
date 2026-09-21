# BS Infra - Webaiku

The DSS entry routes (`/`, `/init`, and `/fetch/bs_init`) accept an optional
`URL` query parameter containing the backend's same-origin mount path, such as
`/web-apps-backends/PROJECT/APP/`. Both Flask and FastAPI return HTTP 400 for
unsafe values before reading the entry page.

After the framework decodes the query parameter, the path must begin with one
slash and contain only ASCII letters, digits, `-`, `.`, `_`, `~`, and path
separators. Repeated slashes and `.`/`..` segments are rejected, as are external
URLs, backslashes, control characters, query strings, fragments, and remaining
percent escapes. Normal DSS paths and reverse-proxy prefixes using these
characters continue to work. The final base attribute is HTML-escaped, and the
static directory name is URL-encoded as one path segment.

This validation restricts asset URLs to the current origin; it does not authorize
access to other same-origin resources or replace DSS webapp permissions.
