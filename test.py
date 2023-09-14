from webaiku.extension import WEBAIKU
from flask import Flask


app = Flask(__name__)
WEBAIKU(app=app)
