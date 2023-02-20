from flask import Flask
from flask_caching import Cache

config = {
    "CACHE_TYPE": "SimpleCache",  # Flask-Caching related configs
    "CACHE_DEFAULT_TIMEOUT": 300
}
cache = Cache(config=config)

def enable_caching(app: Flask):
    cache.init_app(app=app);