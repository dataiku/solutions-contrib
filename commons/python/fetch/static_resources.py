import os
from flask import Response
from pathlib import Path
from flask import Blueprint
import datetime
import numpy as np
import mimetypes


"""
to enable fetching resources from your web app backend include the following 


from commons.python.fetch.static_resources import fetch_route
app.register_blueprint(fetch_route)

The route for fetching resources will be declared in flask application

TODO: add possibility to configure cache control by resource type 

"""


def get_lib_python_path():
    for lib_dir in os.environ.get("PYTHONPATH", "").split(os.pathsep):
        if lib_dir.endswith("python/commons"):
            return os.path.dirname(lib_dir)
 
    return None


def get_granted_directory_list():
    return np.array(["commons", "project"])


def get_granted_resource_type_list():
    return np.array(["js", "css", "images"])

mimetypes.init()
fetch_route = Blueprint("fetch_route", __name__)
lib_python_path = get_lib_python_path()
granted_directory_list = get_granted_directory_list()
resource_type_list = get_granted_resource_type_list()


def is_directory_granted(directory):
    return directory in granted_directory_list


def is_resource_type_granted(resource):
    return resource in resource_type_list


def get_resource_mime_type(resource_type, resource_file_name):
    
    if resource_type == "js":
        return "text/javascript"
    elif resource_type == "css":
        return "text/css"
    else:
        return mimetypes.guess_type(resource_file_name)[0]


def fetch_resource(
    lib_python_path,
    resource_directory,
    resource_type,
    resource_lib_name,
    resource_version,
    resource_file_name,
):
    print(
        " fetching .... \n\t lib_python_path : [{0}] \n\t resource_directory: [{1}] \n\t resource_type: [{2}] \n\t resource_lib_name: [{3}] \n\t resource_version: [{4}] \n\t resource_file_name: [{5}]".format(
            lib_python_path,
            resource_directory,
            resource_type,
            resource_lib_name,
            resource_version,
            resource_file_name,
        )
    )
    path = Path(lib_python_path).joinpath(resource_directory)
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
        with open(path, "rb") as f:
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

    return {"status": status, "mimetype": get_resource_mime_type(resource_type, resource_file_name), "content": content}


@fetch_route.route(
    "/fetch/bs_init"
)
def business_solution_init ():
    # 30d expiration delay
    cache_days = 30

    # Fetch the requested resource
    resource = fetch_resource(
        lib_python_path,
        "commons",
        "js",
        "business_solutions",
        "1.0",
        "fetch_resources.js",
    )

    expiry_time = datetime.datetime.utcnow() + datetime.timedelta(cache_days)

    status = resource["status"]
    resp = Response(response=resource["content"], status=status, mimetype="text/javascript")
    if status == 200:
        resp.headers["Cache-Control"] = "public"
        resp.cache_control.max_age = cache_days * 86400
        resp.headers["Expires"] = expiry_time.strftime("%a, %d %b %Y %H:%M:%S GMT")
    return resp
    
    
    
@fetch_route.route(
    "/fetch/<resource_directory>/<resource_type>/<resource_lib_name>/<resource_version>/<resource_file_name>"
)
def get_static_resource(
    resource_directory,
    resource_type,
    resource_lib_name,
    resource_version,
    resource_file_name,
):

    
    # check grants
    if not is_directory_granted(resource_directory):
        return Response(
            response="resource directory not allowed {0}".format(resource_directory),
            status=400,
            mimetype="text/html",
        )
    if not is_resource_type_granted(resource_type):
        return Response(
            response="resource type not allowed{0}".format(resource_type),
            status=400,
            mimetype="text/html",
        )

    # 24h expiration delay
    cache_days = 30

    # Fetch the requested resource
    resource = fetch_resource(
        lib_python_path,
        resource_directory,
        resource_type,
        resource_lib_name,
        resource_version,
        resource_file_name,
    )

    expiry_time = datetime.datetime.utcnow() + datetime.timedelta(cache_days)

    status = resource["status"]
    mimetype = resource["mimetype"]
    resp = Response(response=resource["content"], status=status, mimetype=mimetype)
    if status == 200:
        resp.headers["Cache-Control"] = "public"
        resp.cache_control.max_age = cache_days * 86400
        resp.headers["Expires"] = expiry_time.strftime("%a, %d %b %Y %H:%M:%S GMT")
    return resp
