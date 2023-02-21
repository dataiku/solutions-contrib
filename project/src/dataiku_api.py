from typing import Optional
import logging

logger = logging.getLogger(__name__)

from project.src.dataset_iterator import DatasetIterator

logger = logging.getLogger(__name__)
NO_TRACKING_CONFIG = {"udr_mode": "NO"}

class DataikuApi:
    def __init__(self):
        self._instanse_info = None
        self._default_project = None
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

    def get_dataset(self, dataset_name: str, project_key:Optional[str]=None):
        project = self.get_project(project_key=project_key)
        return project.get_dataset(dataset_name=dataset_name)
    
    def get_dataset_schema(self, dataset_name: str, project_key:Optional[str]=None):
        dataset = self.get_dataset(dataset_name=dataset_name, project_key=project_key)
        return dataset.get_schema()
    
    def get_dataset_chunk(self, dataset_name: str, chunk_index: int, chunksize=10000,  project_key:Optional[str]=None):
        project = self.get_project(project_key=project_key)
        dataset_iterator = DatasetIterator(project=project, dataset_name=dataset_name, chunksize=chunksize);
        return dataset_iterator.get_chunk(index=chunk_index);

    def get_dataset_last_build_start_time(self, dataset_name: str, project_key:Optional[str]=None):
        dataset = self.get_dataset(dataset_name=dataset_name, project_key=project_key)
        return dataset.get_info().last_build_start_time;


dataiku_api = DataikuApi()