# from flask_caching import Cache
import os

cache_folder = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "cache");

config = {
    "CACHE_TYPE": "FileSystemCache",  # Flask-Caching related configs
    "CACHE_DIR": cache_folder,
    "CACHE_DEFAULT_TIMEOUT": 300,
}
# cache = Cache(config=config)