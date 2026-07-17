"""Services and helpers with no web-framework dependency.

Adapters (``webaiku.adapters.*``) call into these services and serialize the
plain Python results (bytes, dict, ``DataFrame``) into HTTP responses.
"""

from .dataset import DatasetService, get_dataset_service
from .request import parse_req
from .serve import RenderedPage, ServeService

__all__ = [
    "DatasetService",
    "RenderedPage",
    "ServeService",
    "get_dataset_service",
    "parse_req",
]
