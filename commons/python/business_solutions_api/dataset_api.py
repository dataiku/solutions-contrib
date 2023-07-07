from typing import Any
from flask import Blueprint, Response, jsonify, request
from commons.python.business_solutions_api.dataiku_api import dataiku_api
from commons.python.utils import parse_req
from pandas import DataFrame
from .dataiku_formula import DataikuFormula
# from commons.python.caching import cache

dataset_api = Blueprint("dataset_api",__name__, url_prefix="/dataset")

def json_response(payload: Any):
    return Response(payload, mimetype='application/json')

@dataset_api.route("/get", methods=["POST"])
def fetch_dataiku_dataset():
    data = parse_req(
        request=request,
        required_fields=["dataset_name", "chunksize", "chunk_index"]
    )
    # last_build_start = dataiku_api.get_dataset_last_build_start_time(dataset=dataset_name)
    # timestamp = "None" if last_build_start is None else str(last_build_start.timestamp())

    return _fetch_dataiku_dataset_chunk(
        dataset_name=data["dataset_name"], chunksize=data["chunksize"], chunk_index=data["chunk_index"]
    )

def _fetch_dataiku_dataset_chunk(dataset_name: str, chunksize: str, chunk_index: str, filter=None):
    try:
        parsed_chunksize = int(chunksize)
        parsed_chunk_index = int(chunk_index)
    except Exception:
        return f"parsed_chunksize or parsed_chunk_index is not of Int type:\nchunksize = {chunksize};\nchunk_index = {chunk_index};"
    
    chunk = dataiku_api.get_dataset_chunk(
        dataset=dataset_name,
        chunk_index=parsed_chunk_index,
        chunksize=parsed_chunksize,
        filter=filter
    )
    payload = chunk.to_json() if isinstance(chunk, DataFrame) else "None"
    response = json_response(payload)
    return response

@dataset_api.route("/get_schema", methods=["POST"])
def fetch_dataiku_dataset_schema():
    data = parse_req(
        request=request,
        required_fields=["dataset_name"],
    )
    params = dataiku_api.get_dataset_schema(dataset=data["dataset_name"])
    response = jsonify(params)
    return response

@dataset_api.route("/get_generic_data", methods=["POST"])
def get_generic_data():
    data = parse_req(
        request=request,
        required_fields=["dataset_name"],
    )
    params = dataiku_api.get_dataset_generic_data(dataset=data["dataset_name"])
    response = jsonify(params)
    return response

@dataset_api.route("/get_filtered_dataset", methods=["POST"])
def fetch_filtered_dataiku_dataset():
    data = parse_req(
        request=request,
        required_fields=[
            "dataset_name",
            "chunksize",
            "chunk_index",
            "filters"
        ]
    )

    if not data['filters']:
        dataset_filter = None
    else:
        formula = DataikuFormula()
        for key, values in data["filters"].items():
            formula.filter_column_by_values(key, values)
            
        dataset_filter = formula.execute()

    return _fetch_dataset_chunk(
        dataset_name=data["dataset_name"],
        chunksize=data["chunksize"],
        chunk_index=data["chunk_index"],
        filter=dataset_filter
    )

def _fetch_dataset_chunk(dataset_name: str, chunksize: str, chunk_index: str, filter: "None | str"=None):
    try:
        parsed_chunksize = int(chunksize)
        parsed_chunk_index = int(chunk_index)
    except Exception:
        return f"parsed_chunksize or parsed_chunk_index is not of Int type:\nchunksize = {chunksize};\nchunk_index = {chunk_index};"

    chunk: DataFrame = dataiku_api.get_dataset_chunk(
        dataset=dataset_name,
        chunk_index=parsed_chunk_index,
        chunksize=parsed_chunksize,
        filter=filter
    )

    payload = chunk.to_json() if isinstance(chunk, DataFrame) else "None"
    response = json_response(payload)
    return response
