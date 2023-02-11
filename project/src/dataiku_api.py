import json
from werkzeug.exceptions import NotFound
from typing import Dict, Any, Optional
from flask import current_app, jsonify
import logging
import os

logger = logging.getLogger(__name__)

from dataikuapi.dss.dataset import DSSDataset

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
        webapp_config: Dict,
        plugin_config: Dict,
        default_project_key: Optional[str] = None,
    ):

        self._webapp_config = webapp_config
        self._default_project_key = default_project_key
        self._plugin_config = plugin_config

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
            raise Exception("Please set the client before using it.")
        else:
            return self._client

    @client.setter
    def client(self, c: Any):
        raise Exception("If working outside of Dataiku, Client can only be set through the function setup()")

    def get_project(self, project_id=None):
        if project_id is None:
            return self.default_project
        else:
            return self.client.get_project(project_id)

    def is_dataset_sql_supported(self, dataset_type):
        return dataset_type in [
            "PostgreSQL",
            "Snowflake",
            "SQLServer",
            "BigQuery",
            "Synapse",
            "Redshift",
        ]

    def list_datasets(self, project_id=None, connection=None):
        project = self.get_project(project_id)
        datasets = project.list_datasets()
        if connection:
            datasets = [d for d in datasets if d["params"].get("connection") == connection]
        return datasets

    def list_sql_datasets(self, project_id=None):
        datasets = self.list_datasets(project_id=project_id)
        sql_datasets = [d for d in datasets if self.is_dataset_sql_supported(d.get("type"))]
        return sql_datasets

    def list_datasets_summary(self, project_id=None, connection=None):
        datasets = self.list_datasets(project_id, connection)
        return [{"name": ds["name"]} for ds in datasets]

    def list_sql_datasets_summary(self, project_id=None):
        sql_datasets = self.list_sql_datasets(project_id)
        return [{"name": ds["name"], "type": ds["type"]} for ds in sql_datasets]

    def list_columns(self, dataset_name, project_id=None):
        project = self.get_project(project_id)
        dataset = project.get_dataset(dataset_name)
        schema = self.get_dataset_schema(dataset=dataset)
        return schema["columns"]
    
    def get_dataset_schema(self, dataset: DSSDataset):
        try:
            return dataset.get_schema()
        except Exception as err:
            raise NotFound("Dataset not found.")
    
    def get_dss_dataset_dataframe(self, dataset_name, project_id=None):
        project = self.get_project(project_id)
        dataset = project.get_dataset(dataset_name)
        return dataset.get_as_core_dataset().get_dataframe()


dataiku_api = DataikuApi()