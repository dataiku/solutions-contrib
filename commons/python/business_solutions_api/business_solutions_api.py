from flask import Blueprint, Flask
from commons.python.business_solutions_api.dataset_api import dataset_api
from typing import List

## backward compatibility with flask dss built-env


def register_child_blueprints(app: Flask, children: List[Blueprint]):
    for blueprint in children:
        blueprint.url_prefix = "/bs_api" + blueprint.url_prefix
        app.register_blueprint(blueprint=blueprint)


business_solutions_api = Blueprint(
    "business_solutions_api", __name__, url_prefix="/bs_api"
)
