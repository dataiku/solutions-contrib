from load_utils import append_project_root_to_path
append_project_root_to_path()

from dotenv import load_dotenv
load_dotenv()

from flask import Flask
from flask_cors import CORS

from commons.python.launch_utils import create_app, get_local_development_port
from project.src.fetch_api import fetch_api


app: Flask = create_app(__name__)
app.register_blueprint(fetch_api)

CORS(app=app, resources={r"/bs_api/*": {"origins": "*"}})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=get_local_development_port())