from flask import Blueprint, jsonify
from commons.python.business_solutions_api.dataiku_api import dataiku_api
from pandas import DataFrame
# from commons.python.caching import cache

dataset_api = Blueprint("dataset_api",__name__, url_prefix="/dataset")

@dataset_api.route("/get/dataset_name=<dataset_name>/chunksize=<chunksize>/chunk_index=<chunk_index>", methods=["GET"])
def fetch_dataiku_dataset(dataset_name: str, chunksize: str, chunk_index: str):
    last_build_start = dataiku_api.get_dataset_last_build_start_time(dataset=dataset_name)
    timestamp = "None" if last_build_start is None else str(last_build_start.timestamp())

    return fetch_dataiku_dataset_cached(dataset_name=dataset_name, chunksize=chunksize, chunk_index=chunk_index, last_build_start_timestamp=timestamp)

def fetch_dataiku_dataset_cached(dataset_name: str, chunksize: str, chunk_index: str, last_build_start_timestamp: str):
    try:
        parsed_chunksize = int(chunksize)
        parsed_chunk_index = int(chunk_index)
    except Exception:
        return f"parsed_chunksize or parsed_chunk_index is not of Int type:\nchunksize = {chunksize};\nchunk_index = {chunk_index};"
    
    chunk = dataiku_api.get_dataset_chunk(
        dataset=dataset_name,
        chunk_index=parsed_chunk_index,
        chunksize=parsed_chunksize,
    )
    payload = chunk if isinstance(chunk, DataFrame) else None
    response = jsonify(payload)
    return response

@dataset_api.route("/get_schema/dataset_name=<dataset_name>", methods=["GET"])
def fetch_dataiku_dataset_schema(dataset_name: str):
    params = dataiku_api.get_dataset_schema(dataset=dataset_name)
    response = jsonify(params)
    return response

@dataset_api.route("/get_generic_data/dataset_name=<dataset_name>", methods=["GET"])
def get_generic_data(dataset_name: str):
    params = dataiku_api.get_dataset_generic_data(dataset=dataset_name)
    response = jsonify(params)
    return response
