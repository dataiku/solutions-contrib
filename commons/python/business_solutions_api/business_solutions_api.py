from flask import Blueprint
from commons.python.business_solutions_api.dataset_api import dataset_api

def register_child_blueprints(parent: Blueprint, children: list):
    for blueprint in children:
        parent.register_blueprint(blueprint=blueprint)

business_solutions_api = Blueprint("business_solutions_api", __name__, url_prefix="/bs_api")

register_child_blueprints(
    parent=business_solutions_api,
    children=[
    dataset_api
])