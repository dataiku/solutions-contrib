from flask import Blueprint, jsonify
from dataset_api import dataset_api


def register_child_blueprints(parent: Blueprint, children: list):
    [parent.register_blueprint(blueprint) for bluprint in children]

fetch_api = Blueprint("fetch_api",__name__, url_prefix="/api")

register_child_blueprints(
    parent=fetch_api,
    children=[
    dataset_api
]);

########## First api call example ############
@fetch_api.route("/hello", methods=["GET"])
def hello():
    return jsonify({"key" : "hello"})

@fetch_api.route("/fetch-dataset?dataset-name=<dataset_name>", methods=["GET"])
def fetch_dataiku_dataset(dataset_name: str):
    return 