from flask import Blueprint, jsonify


fetch_api = Blueprint("fetch_api",__name__)

########## First api call example ############
@fetch_api.route("/api/hello")
def hello():
    return jsonify({"key" : "hello"})