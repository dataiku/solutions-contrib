from flask import request, url_for, Flask
import sys
import os
sys.path.insert(0,os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from commons.python.fetch.fetch_project import fetch_route

app = Flask(__name__)

app.register_blueprint(fetch_route)


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)

