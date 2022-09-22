
from os.path import expanduser, exists, join, dirname, abspath
import os
from enum import Enum


# TODO : Resolve https / http replacement 

class EnvMode(Enum):
    LOCAL = "local"
    DSS = "dss"

class ConfigBs(object):

    project_folder_name = "project"
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
    def __get_project_entry_file(cls):
        python_path = cls.__get_lib_python_path()
        project_dir = join(python_path,cls.project_folder_name)
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
    def __get_lib_backend_url(cls,request):
        dir_name = cls.__get_dir_name()
        lib_url = None
        if cls.__get_env_mode() == EnvMode.DSS.value:
            lib_url = request.url_root + request.args.get(cls.arg_url_name)[1:] + dir_name
            lib_url = lib_url.replace("http","https")
        else:
            lib_url = request.url_root + dir_name
        
        return lib_url
    
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
    


if __name__ == "__main__":
    print(ConfigBs.static_folder())
    print(ConfigBs.template_folder())