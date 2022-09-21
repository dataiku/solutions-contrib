from flask import Blueprint, Response, make_response, render_template, request
import os
import datetime
import logging
from .config_bs import ConfigBs


## Setup logger
logger = logging.getLogger(__name__)

# TODO : Node js server (src / build ) 


fetch_route =  Blueprint("fetch_route", __name__,template_folder=ConfigBs.template_folder(),static_folder=ConfigBs.static_folder())


@fetch_route.route('/fetch/bs_init')
def init_project():
    lib_url = ConfigBs.lib_backend_url(request)
    html_file_path = ConfigBs.html_file()
    logger.info("lib URL : " + lib_url)
    content = None
    status = 200
    if html_file_path:
        try:
            with open(html_file_path,"rb") as f:
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


        







