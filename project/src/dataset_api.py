from flask import Blueprint
from project.src.dataiku_api import dataiku_api
dataset_api = Blueprint("dataset_api",__name__, url_prefix="/dataset")

########## First api call example ############
@dataset_api.route("/get/<dataset_name>", methods=["GET"])
def fetch_dataiku_dataset(dataset_name: str):
    return dataiku_api.get_dss_dataset_dataframe(dataset_name=dataset_name, project_id="ADVISORSANDBOX").to_json()

@dataset_api.route("/hi", methods=["GET"])
def fetch_hi():
    return "HI"