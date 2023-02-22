from flask import Blueprint
from commons.python.business_solutions_api.dataset_api import dataset_api

business_solutions_api = Blueprint("business_solutions_api", __name__, url_prefix="/bs_api")
business_solutions_api.register_blueprint(dataset_api);