"""Flask adapter.

Imported only when the user passes a Flask app, so importing ``flask`` at module
top is safe here. Wires the framework-free core services to Flask blueprints and
maps the typed error hierarchy to HTTP responses.
"""

import datetime
import logging
from typing import Optional

import pandas as pd
from flask import Blueprint, Flask, Response, jsonify, request

from webaiku.constants import BS_API_PREFIX
from webaiku.context import Execution, ExecutionContext
from webaiku.core import ServeService, get_dataset_service, parse_req
from webaiku.errors import WebaikuError

logger = logging.getLogger("webaiku")


def _convert_df_to_response(df: Optional[pd.DataFrame]) -> Response:
    payload = df.to_json() if isinstance(df, pd.DataFrame) else "None"
    return Response(payload, mimetype="application/json")


def build_serve_blueprint(service: ServeService) -> Blueprint:
    # static_folder serves the SPA's built assets; only index.html gets the
    # rewritten <base> tag (handled by ServeService).
    blueprint = Blueprint("serve", __name__, static_folder=service.execution.exec_path)

    @blueprint.route("/init")
    @blueprint.route("/")
    @blueprint.route("/fetch/bs_init")  # backward compatibility
    def init():
        page = service.render_index(request.args.get(ServeService.URL_ARG_NAME))
        if not page.found or page.html is None:
            return Response(page.html or b"", status=404, mimetype="text/html")
        response = Response(page.html, mimetype="text/html")
        response.headers["Cache-Control"] = (
            f"public, max-age={ServeService.CACHE_DAYS * 86400}"
        )

        expiry_time = datetime.datetime.now(
            tz=datetime.timezone.utc,
        ) + datetime.timedelta(days=ServeService.CACHE_DAYS)
        response.headers["Expires"] = expiry_time.strftime(
            "%a, %d %b %Y %H:%M:%S GMT",
        )
        return response

    return blueprint


def build_dataset_blueprint() -> Blueprint:
    blueprint = Blueprint(
        "dataiku_dataset",
        __name__,
        url_prefix=f"{BS_API_PREFIX}/dataset",
    )
    service = get_dataset_service()

    @blueprint.route("/get", methods=["POST"])
    def get():
        data = parse_req(
            request.get_json(force=True),
            required_fields=["dataset_name", "chunksize", "chunk_index"],
        )
        return _convert_df_to_response(
            service.get_chunk(
                dataset_name=data["dataset_name"],
                chunksize=data["chunksize"],
                chunk_index=data["chunk_index"],
            ),
        )

    @blueprint.route("/get_schema", methods=["POST"])
    def get_schema():
        data = parse_req(request.get_json(force=True), required_fields=["dataset_name"])
        return jsonify(service.get_schema(dataset_name=data["dataset_name"]))

    @blueprint.route("/get_generic_data", methods=["POST"])
    def get_generic_data():
        data = parse_req(request.get_json(force=True), required_fields=["dataset_name"])
        return jsonify(service.get_generic_data(dataset_name=data["dataset_name"]))

    @blueprint.route("/get_filtered_dataset", methods=["POST"])
    def get_filtered_dataset():
        data = parse_req(
            request.get_json(force=True),
            required_fields=["dataset_name", "chunksize", "chunk_index"],
            optional_fields=[
                "filters",
                "group_keys",
                "group_rows",
                "sort_model",
                "custom_filters",
            ],
        )
        return _convert_df_to_response(
            service.get_filtered_chunk(
                dataset_name=data["dataset_name"],
                chunksize=data["chunksize"],
                chunk_index=data["chunk_index"],
                filters=data.get("filters"),
                group_keys=data.get("group_keys"),
                group_rows=data.get("group_rows"),
                sort_model=data.get("sort_model"),
                custom_filters=data.get("custom_filters"),
            ),
        )

    return blueprint


def _register_error_handlers(app: Flask) -> None:
    @app.errorhandler(WebaikuError)
    def handle_webaiku_error(err: WebaikuError):
        status = getattr(err, "status_code", 500)
        return jsonify({"error": str(err)}), status


class FlaskAdapter:
    """Conforms to ``webaiku.adapters.Adapter``."""

    def bind(self, app: Flask, execution: Execution, api_port: str) -> None:
        _register_error_handlers(app)

        if execution.context == ExecutionContext.DATAIKU_DSS_CODE_STUDIO:
            base = execution.code_studio_base(api_port)
            if base:
                from werkzeug.middleware.dispatcher import DispatcherMiddleware
                from werkzeug.wrappers import Response as WSGIResponse

                app.wsgi_app = DispatcherMiddleware(
                    WSGIResponse("Not Found", status=404),
                    {base: app.wsgi_app},
                )

        if execution.context == ExecutionContext.DATAIKU_DSS:
            app.register_blueprint(build_serve_blueprint(ServeService(execution)))

        app.register_blueprint(build_dataset_blueprint())

    def extend(self, app: Flask, children: list) -> None:
        for blueprint in children:
            app.register_blueprint(blueprint)
