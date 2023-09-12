from enum import Enum
import os
from typing import Optional, Dict
import inspect
from webaiku.utils import find_relative_path
import logging
from webaiku.errors import WebaikuError

## TODO : Add custom exception classes, and better handle errors

logger = logging.getLogger("webaiku")


class ExecutionContext(str, Enum):
    LOCAL = "LOCAL"
    DATAIKU_DSS = "DATAIKU_DSS"
    DATAIKU_DSS_CODE_STUDIO = "DATAIKU_DSS_CODE_STUDIO"


class Execution(object):
    dss_env_var = "DIP_HOME"
    dss_code_studio_env_var = "DKU_CODE_STUDIO_BROWSER_PATH"
    dss_current_project_env_var = "DKU_CURRENT_PROJECT_KEY"
    dss_code_studio_project_lib_env_var = "DKU_PROJECT_LIB_VERSIONED_LOCATION"
    dss_python_path_env_var = "PYTHONPATH"

    def __init__(self, relative_path: str):
        self.__context = self.__find_context()
        self.__dss_current_project = self.__get_dss_current_project()
        self.relative_path = relative_path.lstrip(" /").rstrip(" /")
        self.__exec_path = self.__get_execution_main_path()
        if not self.__verify_exec_path():
            raise WebaikuError("Path for web application folder is not found")
        logger.info(
            f"Web application execution context initilized with path {self.__exec_path}"
        )

    @property
    def exec_path(self):
        return self.__exec_path

    @property
    def context(self):
        return self.__context

    @property
    def dss_current_project(self):
        return self.__dss_current_project

    def __find_context(self) -> ExecutionContext:
        if self.dss_env_var in os.environ:
            if self.dss_code_studio_env_var in os.environ:
                return ExecutionContext.DATAIKU_DSS_CODE_STUDIO
            return ExecutionContext.DATAIKU_DSS
        return ExecutionContext.LOCAL

    def __get_dss_current_project(self) -> Optional[str]:
        if not self.context == ExecutionContext.LOCAL:
            return os.environ.get(self.dss_current_project_env_var)
        return None

    def __get_root_path(self) -> Optional[str]:
        if self.context == ExecutionContext.DATAIKU_DSS_CODE_STUDIO:
            if not os.environ.get(self.dss_code_studio_project_lib_env_var) is None:
                return os.environ.get(self.dss_code_studio_project_lib_env_var)
            else:
                raise WebaikuError(
                    "Synchronization of project lib versionned is necessary for the code studio template"
                )
        elif self.context == ExecutionContext.DATAIKU_DSS:
            paths = os.environ.get(self.dss_python_path_env_var)
            if paths:
                target_directory = "project-python-libs"
                paths_splitted = paths.split(":")
                for path in paths_splitted:
                    if target_directory in path:
                        return os.path.join(
                            path.split(target_directory)[0],
                            target_directory,
                            self.dss_current_project,
                        )
        else:
            ## No root path predefined for local env, all should be done on the exec path
            return None

        return None

    def __get_execution_main_path(self):
        ## If code studio the path should exist
        if self.context == ExecutionContext.DATAIKU_DSS_CODE_STUDIO:
            try:
                root_path = self.__get_root_path()
                exec_path = os.path.join(root_path, self.relative_path)
                if os.path.exists(exec_path):
                    return exec_path
                else:
                    raise WebaikuError(f"{exec_path} does not exist")
            except Exception as e:
                raise e from None

        ## The path should both exist and be in python libs
        elif self.context == ExecutionContext.DATAIKU_DSS:
            root_relative_path = self.relative_path.split("/")[0]
            root_path = self.__get_root_path()
            if root_relative_path in os.listdir(root_path):
                return os.path.join(root_path, self.relative_path)
            else:
                ## can be autofixed in DSS new versions by reading the external libs and adding relative wabapps paths
                ## TODO : Should it be auto-fixed
                raise WebaikuError(
                    f"You should add {root_relative_path} to your pythonPath in external-libraries.json of the current project lib folder"
                )
        else:
            ## 1- find the caller frame and abs path
            caller_frame = None
            calling_file_path = None
            try:
                for frame_info in inspect.stack():
                    if frame_info.filename != __file__:
                        caller_frame = frame_info
                        break
            finally:
                del frame_info

            if caller_frame is not None:
                calling_file_path = os.path.abspath(caller_frame.filename)
            else:
                raise WebaikuError("Execution path was not found")

            if calling_file_path:
                return find_relative_path(calling_file_path, self.relative_path)
        return None

    def __verify_exec_path(self) -> bool:
        try:
            if (not self.exec_path is None) and os.path.exists(self.exec_path):
                return True
            return False
        except Exception as e:
            raise e from None
