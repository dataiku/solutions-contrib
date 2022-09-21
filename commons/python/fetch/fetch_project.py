from flask import Blueprint, Response, make_response, render_template, request
import os
import datetime
import logging


## Setup logger
logger = logging.getLogger(__name__)


def get_lib_python_path_mode():
    """
    """
    for lib_dir in os.environ.get("PYTHONPATH", "").split(os.pathsep):
        if lib_dir.endswith("python/commons"):
            return {"path" : os.path.dirname(lib_dir), "mode" : "dss"}
 
    return {"path" : os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))), "mode" : "local"}

PYTHON_PATH_MODE = get_lib_python_path_mode()
PYTHON_MODE = PYTHON_PATH_MODE["mode"]
PYTHON_PATH = PYTHON_PATH_MODE["path"]


def get_project_entry_html(
        project_folder="project",
        html_file="index.html",
        python_lib_path=PYTHON_PATH
    ):
        """
        """
        if python_lib_path:
            project_dir = os.path.join(python_lib_path,project_folder)
            file_dir = os.path.join(project_dir,html_file)
            if os.path.exists(file_dir):
                return file_dir
            return None
        return None

def get_dir_name(
    mode=PYTHON_MODE,
):
    if mode == "dss":
        return "python"
    else:
        return PYTHON_PATH.split("/")[-1]


DIR_NAME = get_dir_name()


def get_project_entry_html(
    project_folder="project",
    html_file="index.html",
    python_lib_path=PYTHON_PATH
):
    """
    """
    if python_lib_path:
        project_dir = os.path.join(python_lib_path,project_folder)
        file_dir = os.path.join(project_dir,html_file)
        if os.path.exists(file_dir):
            return file_dir
        return None
    return None

PATH_TO_INDEX_FILE = get_project_entry_html()

fetch_route = Blueprint("fetch_route", __name__,static_folder=PYTHON_PATH) if PATH_TO_INDEX_FILE is None else Blueprint("fetch_route", __name__,template_folder=os.path.dirname(PATH_TO_INDEX_FILE),static_folder=PYTHON_PATH)


def get_lib_backend_url(request,
            mode,
            dir_name=DIR_NAME,
            arg_url_name="URL",
            ):
    lib_url = None
    if mode == "dss":
        lib_url = request.url_root + request.args.get(arg_url_name)[1:] + dir_name
        return lib_url.replace("http","https")
    else:
        lib_url = request.url_root + dir_name
        return lib_url
    
    
    

@fetch_route.route('/fetch/bs_init')
def init_project():
    lib_url = get_lib_backend_url(request,PYTHON_MODE)
    logger.info("lib URL : " + lib_url)
    content = None
    status = 200
    if PATH_TO_INDEX_FILE:
        try:
            with open(PATH_TO_INDEX_FILE,"rb") as f:
                content = f.read()
        except PermissionError as err:
            logger.error("PermissionError: {0}".format(err))
            status = 403  # forbidden
        except OSError as err:
            logger.error("OSError: {0}".format(err))
            status = 500  # Generic internal error
    else:
        logger.error("file index.html not found")
        status = 404 # Not found
    
    resource = {"status": status, "mimetype": "text/html", "content": content}
    cache_days = 30
    expiry_time = datetime.datetime.utcnow() + datetime.timedelta(cache_days)    
    status = resource["status"]
    response = make_response(render_template("index.html", lib_url=lib_url))
    if status == 200:
        response.headers["Cache-Control"] = "public"
        response.cache_control.max_age = cache_days * 86400
        response.headers["Expires"] = expiry_time.strftime("%a, %d %b %Y %H:%M:%S GMT")
    return response


        







