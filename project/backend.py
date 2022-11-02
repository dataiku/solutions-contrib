from flask import Flask
import sys
import os
sys.path.insert(0,os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from commons.python.fetch.fetch_project import fetch_route
from project.src.fetch_api import fetch_api

app = Flask(__name__)

app.register_blueprint(fetch_route)
app.register_blueprint(fetch_api)


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)

