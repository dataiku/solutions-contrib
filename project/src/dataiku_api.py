from typing import Optional, Dict
import logging

logger = logging.getLogger(__name__)

from project.src.paginated_dataframe import PaginatedDataframe



logger = logging.getLogger(__name__)
NO_TRACKING_CONFIG = {"udr_mode": "NO"}

class DataikuApi:
    def __init__(self):
        self._instanse_info = None
        self._default_project = None
        self._paginated_dataframes: Dict[str, PaginatedDataframe] = {}
        try:
            import dataiku
        except:
            raise ImportError("cannot import dataiku library. Add dataiky python library to the path (see /python-lib/backend/README.md)")
        
        self._client = dataiku.api_client()

    def setup(
        self,
        default_project_key: Optional[str] = None,
    ):

        self._default_project_key = default_project_key

    @property
    def default_project(self):
        try:
            return self.client.get_default_project()
        except Exception as err:
            if self._default_project_key:
                return self.client.get_project(self._default_project_key)
            else:
                raise Exception("Please define the default project before using it.")

    @property
    def client(self):
        if self._client is None:
            raise Exception("Please set the client through the function setup() before using it.")
        else:
            return self._client

    def get_project(self, project_key:Optional[str]=None):
        if project_key is None:
            return self.default_project
        else:
            return self.client.get_project(project_key)

    def create_paginated_dataframe(self, dataset_name: str, chunksize=10000, project_key:Optional[str]=None, **kwargs):
        project = self.get_project(project_key=project_key)
        return PaginatedDataframe(project=project, dataset_name=dataset_name, chunksize=chunksize, **kwargs)

    def get_paginated_dataframe(self, dataset_name: str, chunksize=10000, project_key:Optional[str]=None):
        dataset_chunksize = PaginatedDataframe.create_dataset_chunksize_binding(dataset_name, chunksize);
        if not (dataset_chunksize in self._paginated_dataframes):
            paginated_dataframe = self.create_paginated_dataframe(dataset_name=dataset_name, chunksize=chunksize, project_key=project_key)
            self._paginated_dataframes[dataset_chunksize] = paginated_dataframe;
        return self._paginated_dataframes[dataset_chunksize]

    def get_dataset_chunk(self, dataset_name: str, chunk_index: int, chunksize=10000,  project_key:Optional[str]=None):
        paginated_dataframe = self.get_paginated_dataframe(dataset_name=dataset_name, chunksize=chunksize, project_key=project_key)
        return paginated_dataframe.get_chunk(chunk_index)

    def get_dataset(self, dataset_name: str, project_key:Optional[str]=None):
        project = self.get_project(project_key=project_key)
        return project.get_dataset(dataset_name=dataset_name)
    
    def get_dataset_schema(self, dataset_name: str, project_key:Optional[str]=None):
        dataset = self.get_dataset(dataset_name=dataset_name, project_key=project_key)
        return dataset.get_schema()

dataiku_api = DataikuApi()