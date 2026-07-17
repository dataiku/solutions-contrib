"""Unit tests for the framework-free `ServeService` (base-tag rewriting)."""

from types import SimpleNamespace

from webaiku.core.serve import RenderedPage, ServeService


def _service(exec_path):
    # `ServeService` only reads `execution.exec_path`; real `Execution` is
    # covered in test_execution.py and the adapter tests.
    return ServeService(SimpleNamespace(exec_path=str(exec_path)))


def _make_index(tmp_path, html):
    app_dir = tmp_path / "myapp"
    app_dir.mkdir()
    (app_dir / "index.html").write_text(html, encoding="utf-8")
    return app_dir


def test_injects_base_tag_into_existing_head(tmp_path):
    app_dir = _make_index(
        tmp_path,
        "<html><head><title>t</title></head><body>Test</body></html>",
    )
    page = _service(app_dir).render_index("/backend")

    assert page.found is True
    body = page.html.decode("utf-8")
    # slug appended to the stripped backend url -> /backend/myapp/
    assert '<base href="/backend/myapp/">' in body
    assert "<title>t</title>" in body


def test_strips_pre_existing_base_tag(tmp_path):
    app_dir = _make_index(
        tmp_path,
        '<html><head><base href="/old/base/"><title>t</title></head>'
        "<body>hi</body></html>",
    )
    page = _service(app_dir).render_index("/backend")

    body = page.html.decode("utf-8")
    assert "/old/base/" not in body
    assert '<base href="/backend/myapp/">' in body


def test_injects_head_when_absent(tmp_path):
    app_dir = _make_index(tmp_path, "<html><body>hi</body></html>")
    page = _service(app_dir).render_index("/backend")

    assert page.found is True
    assert page.html.decode("utf-8").startswith("<head>")


def test_missing_index_returns_not_found(tmp_path):
    empty = tmp_path / "empty"
    empty.mkdir()
    page = _service(empty).render_index("/backend")

    assert isinstance(page, RenderedPage)
    assert page.found is False
    assert page.html is None


def test_local_dev_without_url_arg_still_renders(tmp_path):
    app_dir = _make_index(
        tmp_path,
        "<html><head></head><body>hi</body></html>",
    )
    page = _service(app_dir).render_index(None)

    # No URL arg (dev mode) -> still renders.
    assert page.found is True
    assert b"<base" in page.html
