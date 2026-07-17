"""Framework-free dataset orchestration.

Sits between the HTTP adapters and the DSS-facing ``DataikuApi``. It owns the
logic that previously lived inside the Flask blueprint: unpacking AG-Grid-style
grouping into filters, assembling a DSS filter formula, and coercing the chunk
arguments. Both adapters call the same ``DatasetService`` so a Flask request and
a FastAPI request always produce the same answer.
"""

import logging
from typing import Any, Optional

from pandas import DataFrame

from webaiku.apis.dataiku.api import get_dataiku_api
from webaiku.apis.dataiku.formula import DataikuFormula
from webaiku.errors import WebaikuBadRequestError

logger = logging.getLogger("webaiku")


def _is_grouping(group_keys: list, group_rows: list) -> bool:
    return len(group_keys) > len(group_rows)


def _build_filters_from_grouping(
    max_range: int, group_keys: list, group_rows: list, filters: dict
) -> None:
    for i in range(max_range):
        filters[group_keys[i]] = [group_rows[i]]


def _handle_grouping(
    group_keys: Optional[list],
    group_rows: Optional[list],
    filters: Optional[dict],
) -> tuple:
    """Translate the requested grouping level into (group_key, group_row, filters).

    Mirrors the original blueprint behaviour: expanded rows become equality
    filters, and the deepest requested key is the column to group on.
    """
    group_keys = group_keys or []
    group_rows = group_rows or []
    filters = filters or {}
    group_key = None
    group_row = None
    if len(group_keys) >= 1:
        if _is_grouping(group_keys, group_rows):
            group_key = group_keys[len(group_rows)]
            _build_filters_from_grouping(
                len(group_rows), group_keys, group_rows, filters
            )
        else:
            _build_filters_from_grouping(
                len(group_keys) - 1, group_keys, group_rows, filters
            )
            group_key = group_keys[-1]
            group_row = group_rows[-1]
    return group_key, group_row, filters


def _coerce_int(value: Any, name: str) -> int:
    # NOTE: ``int()`` truncates floats, so a non-int chunk arg is silently accepted here
    # while the FastAPI adapter's Pydantic `int` rejects it.
    # Left as-is, but documented
    try:
        return int(value)
    except (TypeError, ValueError):
        raise WebaikuBadRequestError(f"{name} must be an integer, got {value!r}")


class DatasetService:
    """Stateless orchestrator over the lazily-constructed ``DataikuApi``."""

    def get_schema(self, dataset_name: str) -> dict:
        return get_dataiku_api().get_dataset_schema(dataset=dataset_name)

    def get_generic_data(self, dataset_name: str) -> dict:
        return get_dataiku_api().get_dataset_generic_data(dataset=dataset_name)

    def get_chunk(
        self, dataset_name: str, chunksize: Any, chunk_index: Any
    ) -> Optional[DataFrame]:
        return get_dataiku_api().get_dataset_chunk(
            dataset=dataset_name,
            chunk_index=_coerce_int(chunk_index, "chunk_index"),
            chunksize=_coerce_int(chunksize, "chunksize"),
        )

    def get_filtered_chunk(
        self,
        dataset_name: str,
        chunksize: Any,
        chunk_index: Any,
        filters: Optional[dict] = None,
        group_keys: Optional[list] = None,
        group_rows: Optional[list] = None,
        sort_model: Optional[list] = None,
        custom_filters: Optional[dict] = None,
    ) -> Optional[DataFrame]:
        group_key, group_row, req_filters = _handle_grouping(
            group_keys, group_rows, filters
        )
        dataset_filter = self._build_filter(req_filters, custom_filters)
        return get_dataiku_api().get_dataset_chunk(
            dataset=dataset_name,
            chunk_index=_coerce_int(chunk_index, "chunk_index"),
            chunksize=_coerce_int(chunksize, "chunksize"),
            filter=dataset_filter,
            group_key=group_key,
            group_row=group_row,
            sort_model=sort_model,
        )

    @staticmethod
    def _build_filter(
        req_filters: Optional[dict], custom_filters: Optional[dict]
    ) -> Optional[str]:
        if not req_filters and not custom_filters:
            return None
        formula = DataikuFormula()
        if req_filters:
            for key, values in req_filters.items():
                formula.filter_column_by_values(key, values)
        if custom_filters:
            for key, filters in custom_filters.items():
                formula.filter_column_by_custom_filters(key, filters)
        return formula.execute()


_dataset_service: Optional[DatasetService] = None


def get_dataset_service() -> DatasetService:
    """Return the process-wide ``DatasetService`` singleton.

    Cheap to call: the DSS client behind it is only opened on the first request
    that actually reaches ``DataikuApi`` (see ``get_dataiku_api``).
    """
    global _dataset_service
    if _dataset_service is None:
        _dataset_service = DatasetService()
    return _dataset_service
