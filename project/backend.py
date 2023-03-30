from flask import Flask

from commons.python.launch_utils import create_app
from project.src.fetch_api import fetch_api

app: Flask = create_app(__name__)
app.register_blueprint(fetch_api)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)