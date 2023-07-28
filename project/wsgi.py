from load_utils import append_project_root_to_path

append_project_root_to_path()

from dotenv import load_dotenv

load_dotenv()

from flask import Flask
from flask_cors import CORS

from commons.python.launch_utils import create_app, get_local_development_port
from project.src.fetch_api import fetch_api


app: Flask = Flask(__name__)
app = create_app(app)
app.register_blueprint(fetch_api)

with app.app_context():
    routes = []
    for rule in app.url_map.iter_rules():
        routes.append(
            {
                "Endpoint": rule.endpoint,
                "Methods": ",".join(rule.methods),
                "Route": str(rule),
            }
        )

    for route in routes:
        print(route)

CORS(app=app, resources={r"/bs_api/*": {"origins": "*"}})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=get_local_development_port())
