from typing import Any
from flask import Blueprint, Response
from project.src.dataiku_api import dataiku_api
from pandas import DataFrame
import json
dataset_api = Blueprint("dataset_api",__name__, url_prefix="/dataset")

########## First api call example ############

def cors_json_response(payload: Any):
    res = Response(payload, mimetype='application/json')
    res.headers.add('Access-Control-Allow-Origin', 'http://localhost:31100')
    return res

@dataset_api.route("/get/dataset_name=<dataset_name>/chunksize=<chunksize>/chunk_index=<chunk_index>", methods=["GET"])
def fetch_dataiku_dataset(dataset_name: str, chunksize: str, chunk_index: str):
    try:
        parsed_chunksize = int(chunksize)
        parsed_chunk_index = int(chunk_index)
    except Exception:
        return f"parsed_chunksize or parsed_chunk_index is not of Int type:\nchunksize = {chunksize};\nchunk_index = {chunk_index};"
    
    chunk = dataiku_api.get_dataset_chunk(
        dataset_name=dataset_name,
        chunk_index=parsed_chunk_index,
        chunksize=parsed_chunksize,
    )
    payload = chunk.to_json() if isinstance(chunk, DataFrame) else "None"
    response = cors_json_response(payload)
    return response

@dataset_api.route("/get_schema/dataset_name=<dataset_name>", methods=["GET"])
def fetch_dataiku_dataset_schema(dataset_name: str):
    params = dataiku_api.get_dataset_schema(dataset_name=dataset_name)
    response = cors_json_response(json.dumps(params))
    return response
