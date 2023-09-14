from .dss_instance import DSSInstance
from dataikuapi.dss.dataset import DSSDataset
from typing import TypeVar, Optional, Callable, Union
from functools import wraps
import os
from webaiku.errors import WebaikuError
import logging
from .dataset_iterator import DatasetIterator


logger = logging.getLogger("webaiku")

T = TypeVar("T", bound="DataikuApi")

DKU_INSTANCE_NAME_ENV = "DKU_INSTANCE_NAME"


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
    def project_key(self):
        if not self.initialized:
            raise WebaikuError(
                "You need to initialize the project key before getting the project."
            )

        if self._project_key is None:
            raise WebaikuError("No project set for this api")

        return self._project_key

    @property
    def project(self):
        if not self.initialized:
            raise WebaikuError(
                "You need to initialize the project key before getting the project."
            )

        if self._project_key is None:
            raise WebaikuError("No project set for this api")

        return self._client.get_project(project_key=self._project_key)

    @staticmethod
    def using_dataset(func: Callable):
        @wraps(func)
        def inner(self: T, dataset: Union[str, DSSDataset], *args, **kwargs):
            dataset_: Optional[DSSDataset] = None
            if isinstance(dataset, DSSDataset):
                dataset_ = dataset
            elif isinstance(dataset, str):
                dataset_ = self.project.get_dataset(dataset_name=dataset)
            else:
                raise WebaikuError("Unknow dataset argument")
            return func(self, *args, dataset=dataset_, **kwargs)

        return inner

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

    @using_dataset
    def get_dataset_schema(self, dataset: Union[DSSDataset, str]):
        return dataset.get_schema()

    @using_dataset
    def get_dataset_records_count(self, dataset: Union[DSSDataset, str]):
        ## Not implemented
        return None

    @using_dataset
    def get_dataset_generic_data(self, dataset: Union[DSSDataset, str]):
        return {
            "schema": self.get_dataset_schema(dataset=dataset),
            "columnsCount": self.get_dataset_records_count(dataset=dataset),
        }

    @using_dataset
    def get_dataset_chunk(
        self,
        dataset: Union[DSSDataset, str],
        chunk_index: int,
        chunksize=10000,
        filter=None,
        group_key=None,
        group_row=None,
        sort_model=None,
    ):
        dataset_iterator = DatasetIterator(
            dataset=dataset, chunksize=chunksize, filter=filter
        )
        return dataset_iterator.get_chunk(
            index=chunk_index,
            group_key=group_key,
            group_row=group_row,
            sort_model=sort_model,
        )


dataiku_api = DataikuApi(name=DKU_INSTANCE_NAME_ENV)
