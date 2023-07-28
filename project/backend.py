from load_utils import append_project_root_to_path

append_project_root_to_path()

from flask import Flask

from commons.python.launch_utils import create_app, get_local_development_port
from project.src.fetch_api import fetch_api

app: Flask = Flask(__name__)
app = create_app(app)
app.register_blueprint(fetch_api)

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=get_local_development_port())
