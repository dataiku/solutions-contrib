from flask import Flask
from .fetch_api import fetch_api

app = Flask(__name__)
app.register_blueprint(fetch_api)

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=int("{{ cookiecutter.api_port }}"))
