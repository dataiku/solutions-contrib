from functools import wraps
from typing import Any, Dict, Optional, Union, Callable

from dataikuapi.dss.dataset import DSSDataset
from dataikuapi.dss.project import DSSProject

from commons.python.business_solutions_api.dataset_iterator import DatasetIterator


def using_project(func: Callable):
    @wraps(func)
    def inner(
        self: Any, *args, project: Optional[Union[str, DSSProject]] = None, **kwargs
    ):
        if not isinstance(project, DSSProject):
            project = self.get_project(project_key=project)
        return func(self, *args, project=project, **kwargs)

    return inner


def using_dataset(func: Callable):
    @wraps(func)
    @using_project
    def inner(
        self: Any, dataset: Union[str, DSSDataset], project: DSSProject, *args, **kwargs
    ):
        if not isinstance(dataset, DSSDataset):
            dataset = project.get_dataset(dataset_name=dataset)
        return func(self, *args, dataset=dataset, project=project, **kwargs)

    return inner


class DataikuApi:
    def __init__(self, default_project_key: Optional[str] = None):
        self._instanse_info = None
        self._default_project_key = default_project_key
        try:
            import dataiku
        except:
            raise ImportError(
                "cannot import dataiku library. Add dataiky python library to the path (see /python-lib/backend/README.md)"
            )

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
                raise Exception(
                    f"Please define the default project or set a DKU_CURRENT_PROJECT_KEY environment variable before using it."
                )

    @property
    def client(self):
        if self._client is None:
            raise Exception(
                "Please set the client through the function setup() before using it."
            )
        else:
            return self._client

    def get_project(self, project_key: Optional[str] = None):
        if project_key is None:
            return self.default_project
        else:
            return self.client.get_project(project_key)

    @using_dataset
    def get_dataset_schema(self, dataset: DSSDataset, project: DSSProject):
        return dataset.get_schema()

    @using_dataset
    def get_dataset_records_count(self, dataset: DSSDataset, project: DSSProject):
        # info: Dict = dataset.get_info().info
        # try:
        #     return info["status"]["records"]["totalValue"]
        # except Exception:
        #     try:
        #         return dataset.get_last_metric_values() \
        #         .get_metric_by_id("records:COUNT_RECORDS")["lastValues"][0]['value']
        #     except Exception:
        #         return None
        return None

    @using_dataset
    def get_dataset_generic_data(self, dataset: DSSDataset, project: DSSProject):
        return {
            "schema": self.get_dataset_schema(dataset=dataset, project=project),
            "columnsCount": self.get_dataset_records_count(
                dataset=dataset, project=project
            ),
        }

    @using_dataset
    def get_dataset_chunk(
        self,
        dataset: DSSDataset,
        project: DSSProject,
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
        return dataset_iterator.get_chunk(index=chunk_index, group_key=group_key, 
                                          group_row=group_row, sort_model=sort_model)

    @using_dataset
    def get_dataset_last_build_start_time(
        self, dataset: DSSDataset, project: DSSProject
    ):
        return dataset.get_info().last_build_start_time


dataiku_api = DataikuApi()
