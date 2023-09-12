from .dss_instance import DSSInstance
from typing import Optional, Callable
import os
from webaiku.errors import WebaikuError
import logging


logger = logging.getLogger("webaiku")


class DataikuApi:
    env_project_key = "DKU_CURRENT_PROJECT_KEY"

    def __init__(
        self,
        name: Optional[str] = None,
        host: Optional[str] = None,
        api_key: Optional[str] = None,
        project_key: Optional[str] = None,
    ):
        self.__instance = DSSInstance(name=name, host=host, api_key=api_key)
        self._client = self.__instance.client
        self._project_key = project_key
        self.initialized = False
        self.init(project_key=project_key)

    @property
    def project(self):
        if not self.initialized:
            raise WebaikuError(
                "You need to initialize the project key before getting the project."
            )

        if self._project_key is None:
            raise WebaikuError("No project set for this api")

        return self._client.get_project(project_key=self._project_key)

    def assign_project_key(self, project_key: Optional[str] = None):
        self._project_key = project_key
        if self._project_key is None:
            try:
                default_project = self._client.get_default_project()
                if default_project:
                    self._project_key = default_project.project_key
                else:
                    self._project_key = os.getenv(self.env_project_key, None)
            except Exception as err:
                raise WebaikuError(
                    "Please define the default project or set a DKU_CURRENT_PROJECT_KEY environment variable before using it."
                )

    def check_api_availability(self):
        if not self._project_key:
            raise WebaikuError("Project key is not defined")
        try:
            _ = self._client.get_project(project_key=self._project_key)
        except Exception as err:
            raise WebaikuError(f"Project {self._project_key} seems unavailable.")

    def init(self, project_key: Optional[str] = None):
        self.assign_project_key(project_key=project_key)
        self.check_api_availability()
        if self._project_key:
            logger.info(
                f"Dataiku Api initialized with project key : {self._project_key}"
            )
            self.initialized = True
