
from flask import Flask
from flask_cors import CORS

import sys
import os
from dotenv import load_dotenv, dotenv_values

sys.path.insert(0,os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from commons.python.fetch.fetch_project import fetch_route
from project.src.fetch_api import fetch_api

load_dotenv()
dotenv_vals = dotenv_values(".env")

LOCAL_DSS_PROJECT = dotenv_vals["LOCAL_DSS_PROJECT"]

os.environ["DKU_CURRENT_PROJECT_KEY"] = str(LOCAL_DSS_PROJECT)

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:31100"}})

app.register_blueprint(fetch_route)
app.register_blueprint(fetch_api)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)