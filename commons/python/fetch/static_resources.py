import os
from flask import Response
from pathlib import Path
from flask import Blueprint
import datetime

'''''
to enable fetching resources from your web app backend include the following 


from commons.python.fetch.static_resources import fetch_route
app.register_blueprint(fetch_route)

The route for fetching resources will be declared in flask application

TODO: add possibility to configure cache control by resource type 

'''''


def get_commons_lib_directory():
    for lib_dir in os.environ.get('PYTHONPATH', '').split(os.pathsep):
        if lib_dir.endswith('python/commons'):
            return lib_dir
    return None


fetch_route = Blueprint('fetch_route', __name__)
sol_commons_lib_dir = get_commons_lib_directory()


def fetch_resource(lib_path, resource_type, resource_lib_name, resource_version, resource_file_name):
    path = Path(lib_path)
    content = None
    status = 200
    if resource_type:
        path = path.joinpath(resource_type)
    if resource_lib_name:
        path = path.joinpath(resource_lib_name)
    if resource_version:
        path = path.joinpath(resource_version)
    path = path.joinpath(resource_file_name)
    try:
        with open(path, 'rb') as f:
            content = f.read()
    except FileNotFoundError as err:
        status = 404  # not found
        print("FileNotFoundError: {0}".format(err))
    except PermissionError as err:
        print("PermissionError: {0}".format(err))
        status = 403  # forbidden
    except OSError as err:
        print("OSError: {0}".format(err))
        status = 500  # Generic internal error

    return {'status': status, 'content': content}


@fetch_route.route('/fetch/<resource_type>/<resource_lib_name>/<resource_version>/<resource_file_name>')
def get_static_resource(resource_file_name, resource_type, resource_lib_name=None, resource_version=None):
    # default response mime type
    mime_type = 'text/html'

    # 24h expiration delay
    cache_days = 30

    # Only allow js and css types under python/commons
    if resource_type == 'js':
        mime_type = 'text/javascript'
    elif resource_type == 'css':
        mime_type = 'text/css'
    else:
        return Response(response='resource type not allowed', status=400, mimetype=mime_type)

    # Fetch the requested resource
    resource = fetch_resource(sol_commons_lib_dir, resource_type, resource_lib_name, resource_version,
                              resource_file_name)

    expiry_time = datetime.datetime.utcnow() + datetime.timedelta(cache_days)

    status = resource['status']
    resp = Response(response=resource['content'], status=status, mimetype=mime_type)
    if status == 200:
        resp.headers['Cache-Control'] = 'public'
        resp.cache_control.max_age = cache_days * 86400
        resp.headers["Expires"] = expiry_time.strftime("%a, %d %b %Y %H:%M:%S GMT")
    return resp
