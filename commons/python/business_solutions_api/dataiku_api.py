from functools import wraps
from typing import Any, Dict, Optional, Union, Callable
import logging
from dataikuapi.dss.dataset import DSSDataset
from dataikuapi.dss.project import DSSProject

logger = logging.getLogger(__name__)

from commons.python.business_solutions_api.dataset_iterator import DatasetIterator

logger = logging.getLogger(__name__)
NO_TRACKING_CONFIG = {"udr_mode": "NO"}

def using_project(func: Callable):
    @wraps(func)
    def inner(self: Any, *args, project: Optional[Union[str, DSSProject]]=None, **kwargs):
        if not isinstance(project, DSSProject):
            project = self.get_project(project_key=project);
        return func(self, *args, project=project, **kwargs)
    return inner

def using_dataset(func: Callable):

    @wraps(func)
    @using_project
    def inner(self: Any, dataset: Union[str, DSSDataset], project: DSSProject, *args, **kwargs):
        if not isinstance(dataset, DSSDataset):
            dataset = project.get_dataset(dataset_name=dataset)
        return func(self, *args, dataset=dataset, project=project, **kwargs)
    return inner


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

    @using_dataset
    def get_dataset_schema(self, dataset: DSSDataset, project: DSSProject):
        return dataset.get_schema()
    
    @using_dataset
    def get_dataset_records_count(self, dataset: DSSDataset, project: DSSProject):
        info: Dict = dataset.get_info().info
        try:
            return info["status"]["records"]["totalValue"];
        except Exception:
            return None

    @using_dataset
    def get_dataset_chunk(self, dataset: DSSDataset, project: DSSProject, chunk_index: int, chunksize=10000):
        dataset_iterator = DatasetIterator(dataset=dataset, chunksize=chunksize);
        return dataset_iterator.get_chunk(index=chunk_index);

    @using_dataset
    def get_dataset_last_build_start_time(self, dataset: DSSDataset, project: DSSProject):
        return dataset.get_info().last_build_start_time;


dataiku_api = DataikuApi()