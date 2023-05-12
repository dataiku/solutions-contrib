
from flask import Flask
from flask_cors import CORS

import os

from commons.python.launch_utils import create_app, get_local_development_port

os.environ['FLASK_RUN_PORT'] = str(get_local_development_port())
app: Flask = create_app(app_name=__name__)

CORS(app, resources={r"/bs_api/*": {"origins": "http://localhost:31100"}})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=get_local_development_port())