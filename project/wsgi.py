
from flask import Flask
from flask_cors import CORS

import os
from dotenv import load_dotenv, dotenv_values

from project.src.launch_utils import create_app

def after_created(app: Flask):
    load_dotenv()
    dotenv_vals = dotenv_values(".env")
    LOCAL_DSS_PROJECT = dotenv_vals["LOCAL_DSS_PROJECT"]
    os.environ["DKU_CURRENT_PROJECT_KEY"] = str(LOCAL_DSS_PROJECT)
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:31100"}})

app = create_app(app_name=__name__, after_created=after_created)

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)