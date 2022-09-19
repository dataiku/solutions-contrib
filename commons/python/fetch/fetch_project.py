from flask import Blueprint, Response
import os
import datetime



fetch_route = Blueprint("fetch_route", __name__)

def get_lib_python_path():
    for lib_dir in os.environ.get("PYTHONPATH", "").split(os.pathsep):
        if lib_dir.endswith("python/commons"):
            return os.path.dirname(lib_dir)
 
    return None

def get_project_entry_html(
    project_folder="project",
    html_file="index.html"
):
    python_lib_path = get_lib_python_path()
    if python_lib_path:
        project_dir = os.path.join(python_lib_path,project_folder)
        file_dir = os.path.join(project_dir,html_file)
        if os.path.exists(file_dir):
            return file_dir
    return None

path_to_file = get_project_entry_html()




@fetch_route.route('/fetch/bs_init')
def init_project():
    content = None
    status = 200
    if path_to_file:
        try:
            with open(path_to_file,"rb") as f:
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
    
    resource = {"status": status, "mimetype": "text/html", "content": content}
    cache_days = 30
    expiry_time = datetime.datetime.utcnow() + datetime.timedelta(cache_days)    
    status = resource["status"]
    mimetype = resource["mimetype"]
    resp = Response(response=resource["content"], status=status, mimetype=mimetype)
    if status == 200:
        resp.headers["Cache-Control"] = "public"
        resp.cache_control.max_age = cache_days * 86400
        resp.headers["Expires"] = expiry_time.strftime("%a, %d %b %Y %H:%M:%S GMT")
    return resp



        







