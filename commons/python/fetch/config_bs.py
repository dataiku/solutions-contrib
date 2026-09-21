
from os.path import expanduser, exists, join, dirname, abspath
import os
import re
from enum import Enum
from urllib.parse import quote

from werkzeug.exceptions import BadRequest


# TODO : Resolve https / http replacement 

class EnvMode(Enum):
    LOCAL = "local"
    DSS = "dss"

class ConfigBs(object):

    # project_folder_name = "project"
    html_file_name = "index.html"
    arg_url_name = "URL"


    @staticmethod
    def __get_env_mode():
        is_local = exists(join(expanduser("~"),".dataiku/bs-config.json"))
        return EnvMode.LOCAL.value if is_local else EnvMode.DSS.value
    
    @classmethod
    def __get_lib_python_path(cls):
        mode = cls.__get_env_mode()
        if mode == EnvMode.DSS.value:
            for lib_dir in os.environ.get("PYTHONPATH", "").split(os.pathsep):
                if lib_dir.endswith("python/commons"):
                    return dirname(lib_dir)
 
        return dirname(dirname(dirname(dirname(abspath(__file__)))))
    
    @classmethod
    def __get_project_name(cls):
        root_path = cls.__get_lib_python_path()
        project_list =  [folder for folder in os.listdir(root_path) if os.path.isdir(os.path.join(root_path,folder)) and not folder.startswith(".") and folder != "commons"]
        if len(project_list) == 1:
            return project_list[0]
        return "project"

    @classmethod
    def __get_project_entry_file(cls):
        python_path = cls.__get_lib_python_path()
        project_folder_name = cls.__get_project_name()
        project_dir = join(python_path,project_folder_name)
        file_dir = join(project_dir,cls.html_file_name)
        if exists(file_dir):
            return file_dir
        return None
    
    @classmethod
    def __get_dir_name(cls):
        mode = cls.__get_env_mode()
        if mode == EnvMode.DSS.value:
            return "python"
        else:
            python_lib_path = cls.__get_lib_python_path() 
            return python_lib_path.split("/")[-1]
    
    @classmethod
    def _backend_url(cls, url_arg):
        """Accept only a root-relative backend mount on the current origin.

        Flask has already decoded the query value. Reject remaining escapes
        and ambiguous syntax rather than trying to normalize untrusted input.
        Missing/empty values use the same root mount as the legacy empty URL.
        """
        if not url_arg:
            return "/"
        if (
            re.fullmatch(r"/[A-Za-z0-9._~/-]*", url_arg) is None
            or "//" in url_arg
            or any(part in {".", ".."} for part in url_arg.split("/"))
        ):
            # Werkzeug's HTTP exception stops rendering and Flask returns 400.
            # "URL" is the parameter name; the message never echoes its value.
            raise BadRequest("URL must be an absolute same-origin path.")
        return url_arg

    @classmethod
    def __get_lib_backend_url(cls,request):
        dir_name = cls.__get_dir_name()
        if cls.__get_env_mode() == EnvMode.DSS.value:
            backend_url = cls._backend_url(request.args.get(cls.arg_url_name))
        else:
            # Local development does not use the caller-supplied backend URL.
            backend_url = "/"
        # The legacy static mount is /python in DSS. Its directory name is one
        # URL segment; append it without depending on a caller's trailing slash.
        return backend_url.rstrip("/") + "/" + quote(dir_name, safe="")
    
    @classmethod
    def static_folder(cls):
        return cls.__get_lib_python_path()
    
    @classmethod
    def template_folder(cls):
        return dirname(cls.__get_project_entry_file())
    
    @classmethod
    def html_file(cls):
        return cls.__get_project_entry_file()
    
    @classmethod
    def lib_backend_url(cls, request):
        return cls.__get_lib_backend_url(request)
    
    @classmethod
    def mode(cls):
        return cls.__get_env_mode()
    
    @classmethod
    def get_project_name(cls):
        return cls.__get_project_name()

    


if __name__ == "__main__":
    project_name = ConfigBs.get_project_name()
    print(project_name)
