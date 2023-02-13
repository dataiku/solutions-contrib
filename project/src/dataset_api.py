from flask import Blueprint, Response
from project.src.dataiku_api import dataiku_api
from pandas import DataFrame
dataset_api = Blueprint("dataset_api",__name__, url_prefix="/dataset")

########## First api call example ############
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
    return Response(payload, mimetype='application/json');

@dataset_api.route("/hi", methods=["GET"])
def fetch_hi():
    return "HI"