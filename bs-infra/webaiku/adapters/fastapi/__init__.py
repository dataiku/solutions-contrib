"""FastAPI adapter.

Imported only when the user passes a FastAPI app, so importing ``fastapi`` /
``pydantic`` at module top is safe here. Mirrors the Flask adapter's behaviour
using FastAPI idioms: Pydantic request models (native validation + OpenAPI) and
an ASGI middleware for Code Studio sub-path mounting.
"""

import logging
import os
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, FastAPI, Request
from fastapi.responses import JSONResponse, Response
from fastapi.staticfiles import StaticFiles
from pandas import DataFrame
from pydantic import BaseModel

from webaiku.adapters.fastapi.middleware import CodeStudioSubPathMiddleware
from webaiku.constants import BS_API_PREFIX
from webaiku.context import Execution, ExecutionContext
from webaiku.core import ServeService, get_dataset_service
from webaiku.errors import WebaikuError

logger = logging.getLogger("webaiku")


# --- Request models (3.9-safe: Optional/typing, never PEP 604 `X | Y`) --------


class DatasetChunkRequest(BaseModel):
    """Model for dataset chunk request."""

    dataset_name: str
    chunksize: int
    chunk_index: int


class DatasetNameRequest(BaseModel):
    """Model for dataset name request."""

    dataset_name: str


class FilteredDatasetRequest(BaseModel):
    """Model for dataset request with filters."""

    dataset_name: str
    chunksize: int
    chunk_index: int
    filters: Optional[dict] = None
    group_keys: Optional[list] = None
    group_rows: Optional[list] = None
    sort_model: Optional[list] = None
    custom_filters: Optional[dict] = None


def _df_response(df: Optional[DataFrame]) -> Response:
    """Serialize dataframe to JSON response."""
    payload = df.to_json() if isinstance(df, DataFrame) else "None"
    return Response(content=payload, media_type="application/json")


def build_serve_router(service: ServeService) -> APIRouter:
    """Build serve router as FastAPI router with static asset serving."""
    router = APIRouter()

    @router.get("/")
    @router.get("/init")
    @router.get("/fetch/bs_init")  # backward compatibility
    def init(request: Request):
        page = service.render_index(request.query_params.get(ServeService.URL_ARG_NAME))
        if not page.found or page.html is None:
            return Response(
                content=page.html or b"",
                status_code=404,
                media_type="text/html",
            )
        expiry = datetime.now(tz=timezone.utc) + timedelta(
            days=ServeService.CACHE_DAYS,
        )
        headers = {
            "Cache-Control": f"public, max-age={ServeService.CACHE_DAYS * 86400}",
            "Expires": expiry.strftime("%a, %d %b %Y %H:%M:%S GMT"),
        }
        return Response(content=page.html, media_type="text/html", headers=headers)

    return router


def build_dataset_router() -> APIRouter:
    """Build dataset router as FastAPI router."""
    router = APIRouter(prefix="/dataset")
    service = get_dataset_service()

    @router.post("/get")
    def get(body: DatasetChunkRequest):
        return _df_response(
            service.get_chunk(
                dataset_name=body.dataset_name,
                chunksize=body.chunksize,
                chunk_index=body.chunk_index,
            ),
        )

    @router.post("/get_schema")
    def get_schema(body: DatasetNameRequest) -> JSONResponse:
        """Return dataset schema as JSON response."""
        return JSONResponse(service.get_schema(dataset_name=body.dataset_name))

    @router.post("/get_generic_data")
    def get_generic_data(body: DatasetNameRequest) -> JSONResponse:
        """Return generic data as JSON response."""
        return JSONResponse(service.get_generic_data(dataset_name=body.dataset_name))

    @router.post("/get_filtered_dataset")
    def get_filtered_dataset(body: FilteredDatasetRequest) -> Response:
        """Return filtered dataset as JSON response."""
        return _df_response(service.get_filtered_chunk(**body.model_dump()))

    return router


def _register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(WebaikuError)
    async def handle_webaiku_error(request: Request, err: WebaikuError) -> JSONResponse:
        """Handle server errors across the router."""
        status = getattr(err, "status_code", 500)
        return JSONResponse({"error": str(err)}, status_code=status)


class FastAPIAdapter:
    """Conforms to ``webaiku.adapters.Adapter``."""

    def bind(self, app: FastAPI, execution: Execution, api_port: str) -> None:
        """Bind core API routers to app instance.

        Adds custom path middleware for Code Studio proxied paths.
        """
        _register_exception_handlers(app)

        if execution.context == ExecutionContext.DATAIKU_DSS_CODE_STUDIO:
            base = execution.code_studio_base(api_port)
            logger.debug("Base path in Code Studio context: %s", base)
            if base:
                app.add_middleware(CodeStudioSubPathMiddleware, base=base)

        if execution.context == ExecutionContext.DATAIKU_DSS:
            app.include_router(build_serve_router(ServeService(execution)))
            if execution.exec_path:
                # Serve the SPA's built static assets and mount under the exec_path
                # basename so the URL matches the <base> tag ServeService injects into
                # index.html (see ServeService._static_assets_path)
                mount_path = "/" + os.path.basename(execution.exec_path)
                app.mount(
                    mount_path,
                    StaticFiles(directory=execution.exec_path),
                    name="webaiku_assets",
                )

        app.include_router(build_dataset_router(), prefix=BS_API_PREFIX)

    def extend(self, app: FastAPI, children: list) -> None:
        """Extend app instance with custom routers."""
        for router in children:
            app.include_router(router)
