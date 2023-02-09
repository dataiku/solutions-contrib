from flask import Blueprint, jsonify
from dataiku_api import dataiku_api

dataset_api = Blueprint("dataset_api",__name__, url_prefix="/dataset")

########## First api call example ############
@dataset_api.route("?dataset-name=<dataset_name>", methods=["GET"])
def fetch_dataiku_dataset(dataset_name: str):
    return 