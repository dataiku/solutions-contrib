import os
import sys

sys.path.insert(
    0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
)

from flask import Flask
from flask_cors import CORS

from commons.python.launch_utils import create_app, get_local_development_port

app: Flask = Flask(__name__)

app = create_app(app)

CORS(app, resources={r"/bs_api/*": {"origins": "http://localhost:31100"}})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=get_local_development_port())
