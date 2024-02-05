from flask import Blueprint, request, Response, jsonify
from webaiku.utils import parse_req
from webaiku.errors import WebaikuError
from webaiku.apis.dataiku.api import dataiku_api
from webaiku.apis.dataiku.formula import DataikuFormula
from pandas import DataFrame
from typing import Any


def json_response(payload: Any):
    return Response(payload, mimetype="application/json")


def _isGrouping(group_keys=None, group_rows=None):
    print("is grouping :", len(group_keys) > len(group_rows))
    return len(group_keys) > len(group_rows)


def _handle_grouping_from_request(data):
    group_keys = data["group_keys"] or []
    group_rows = data["group_rows"] or []
    filters = data["filters"] or {}
    group_key = None
    group_row = None
    if len(group_keys) >= 1:
        if _isGrouping(group_keys, group_rows):
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


def _build_filters_from_grouping(max_range, group_keys, group_rows, filters):
    for i in range(max_range):
        filter_key = group_keys[i]
        filter_val = group_rows[i]
        filters[filter_key] = [filter_val]


class DataikuDatasetBlueprint(object):
    def __init__(self):
        self._blueprint = Blueprint("dataiku_dataset", __name__, url_prefix="/dataset")
        self.add_routes()

    @property
    def blueprint(self):
        return self._blueprint

    def add_routes(self):
        @self._blueprint.route("/get", methods=["POST"])
        def fetch_dataiku_dataset():
            data = parse_req(
                request=request,
                required_fields=["dataset_name", "chunksize", "chunk_index"],
            )
            return self._fetch_dataiku_dataset_chunk(
                dataset_name=data["dataset_name"],
                chunksize=data["chunksize"],
                chunk_index=data["chunk_index"],
            )

        @self._blueprint.route("/get_schema", methods=["POST"])
        def fetch_dataiku_dataset_schema():
            data = parse_req(
                request=request,
                required_fields=["dataset_name"],
            )
            params = dataiku_api.get_dataset_schema(dataset=data["dataset_name"])
            response = jsonify(params)
            return response

        @self._blueprint.route("/get_generic_data", methods=["POST"])
        def get_generic_data():
            data = parse_req(
                request=request,
                required_fields=["dataset_name"],
            )
            params = dataiku_api.get_dataset_generic_data(dataset=data["dataset_name"])
            response = jsonify(params)
            return response

        @self._blueprint.route("/get_filtered_dataset", methods=["POST"])
        def fetch_filtered_dataiku_dataset():
            data = parse_req(
                request=request,
                required_fields=[
                    "dataset_name",
                    "chunksize",
                    "chunk_index",
                ],
                optional_fields=[
                    "filters",
                    "group_keys",
                    "group_rows",
                    "sort_model",
                    "custom_filters",
                ],
            )

            group_key, group_row, req_filters = _handle_grouping_from_request(data)

            if not req_filters:
                dataset_filter = None
            else:
                formula = DataikuFormula()
                for key, values in req_filters.items():
                    formula.filter_column_by_values(key, values)

            if data["custom_filters"]:
                if not req_filters:
                    formula = DataikuFormula()
                for key, filters in data["custom_filters"].items():
                    print("key, filter in custom filters", key, filters)
                    formula.filter_column_by_custom_filters(key, filters)

            if data["custom_filters"] or req_filters:
                dataset_filter = formula.execute()

            return self._fetch_dataset_chunk(
                dataset_name=data["dataset_name"],
                chunksize=data["chunksize"],
                chunk_index=data["chunk_index"],
                filter=dataset_filter,
                group_key=group_key,
                group_row=group_row,
                sort_model=data["sort_model"],
            )

    def _fetch_dataset_chunk(
        self,
        dataset_name: str,
        chunksize: str,
        chunk_index: str,
        filter=None,
        group_key=None,
        group_row=None,
        sort_model=None,
    ):
        try:
            parsed_chunksize = int(chunksize)
            parsed_chunk_index = int(chunk_index)
        except Exception:
            return f"parsed_chunksize or parsed_chunk_index is not of Int type:\nchunksize = {chunksize};\nchunk_index = {chunk_index};"

        chunk: DataFrame = dataiku_api.get_dataset_chunk(
            dataset=dataset_name,
            chunk_index=parsed_chunk_index,
            chunksize=parsed_chunksize,
            filter=filter,
            group_key=group_key,
            group_row=group_row,
            sort_model=sort_model,
        )
        payload = chunk.to_json() if isinstance(chunk, DataFrame) else "None"
        response = json_response(payload)
        return response

    def _fetch_dataiku_dataset_chunk(
        dataset_name: str, chunksize: str, chunk_index: str
    ):
        try:
            parsed_chunksize = int(chunksize)
            parsed_chunk_index = int(chunk_index)
        except Exception:
            raise WebaikuError(
                f"parsed_chunksize or parsed_chunk_index is not of Int type:\nchunksize = {chunksize};\nchunk_index = {chunk_index};"
            )
        chunk = dataiku_api.get_dataset_chunk(
            dataset=dataset_name,
            chunk_index=parsed_chunk_index,
            chunksize=parsed_chunksize,
        )
        payload = chunk.to_json() if isinstance(chunk, DataFrame) else None
        response = json_response(payload)
        return response
