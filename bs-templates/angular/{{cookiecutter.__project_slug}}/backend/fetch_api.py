from flask import Blueprint, jsonify

fetch_api = Blueprint("fetch_api", __name__, url_prefix="/api")


@fetch_api.route("/hello", methods=["GET"])
def hello():
    return jsonify({"key": "hello"})
