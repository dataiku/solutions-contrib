from webaiku.extension import WEBAIKU
from flask import Flask


if __name__ == "__main__":
    app = Flask(__name__)
    t = WEBAIKU(app=app, relative_path="")
    print(t.exec.exec_path)
    app.run(host="localhost", port=5000)
