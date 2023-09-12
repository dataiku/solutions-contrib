from flask import Blueprint, request
from webaiku.utils import parse_req


class DataikuDatasetBlueprint(object):
    def __init__(self):
        self._blueprint = Blueprint("dataiku_dataset", __name__, url_prefix="/dataset")

    def add_routes(self):
        @self._blueprint.route("/get", methods=["POST"])
        def fetch_dataiku_dataset():
            data = parse_req(
                request=request,
                required_fields=["dataset_name", "chunksize", "chunk_index"],
            )
            return

    def _fetch_dataiku_dataset_chunk(
        dataset_name: str, chunksize: str, chunk_index: str
    ):
        try:
            parsed_chunksize = int(chunksize)
            parsed_chunk_index = int(chunk_index)
        except Exception as e:
            raise e
