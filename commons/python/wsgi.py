
from flask import Flask
from flask_cors import CORS

import os
from dotenv import load_dotenv, dotenv_values

from commons.python.launch_utils import create_app

load_dotenv()
dotenv_vals = dotenv_values(".env")
LOCAL_DSS_PROJECT = dotenv_vals["LOCAL_DSS_PROJECT"]
os.environ["DKU_CURRENT_PROJECT_KEY"] = str(LOCAL_DSS_PROJECT)

app: Flask = create_app(app_name=__name__)

CORS(app, resources={r"/bs_api/*": {"origins": "http://localhost:31100"}})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)