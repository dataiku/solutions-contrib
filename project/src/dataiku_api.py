from werkzeug.exceptions import NotFound
from typing import Dict, Any
from flask import current_app
import logging
import os

logger = logging.getLogger(__name__)

try:
    import dataiku
    from dataiku.customwebapp import get_webapp_config, get_plugin_config
except ImportError:
    logger.debug("Working outside of Dataiku.")


logger = logging.getLogger(__name__)
NO_TRACKING_CONFIG = {"udr_mode": "NO"}


class DataikuApi:
    def __init__(self):
        self._webapp_config = None
        self._plugin_config = None
        self._instanse_info = None
        self._default_project = None
        try:
            import dataiku
        except:
            raise ImportError("cannot import dataiku library. Add dataiky python library to the path (see /python-lib/backend/README.md)")
        
        self._client = dataiku.api_client()
        self.set_instance_info()

    def setup(
        self,
        webapp_config: Dict,
        plugin_config: Dict,
        default_project_key: str = None,
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
        try:
            schema = dataset.get_schema()
        except Exception as err:
            raise NotFound("Dataset not found.")
        return schema["columns"]

    @property
    def in_dataiku(self):
        return os.getenv("FLASK_ENV") == "dss"

    @property
    def webapp_config(self):
        return self._webapp_config or get_webapp_config()

    @property
    def plugin_config(self):
        return self._plugin_config or get_plugin_config()

    @property
    def public_plugin_config(self):
        public_config = ["activate_tracking", "csp_headers_allowlist", "samesite_headers_allowlist"]
        plugin_config = self.plugin_config
        public_plugin_config = {k: v for k, v in plugin_config.items() if k in public_config}
        return public_plugin_config

    def is_dev_instance(self):
        try:
            import dataiku

            return dataiku.get_dss_settings()["devInstance"]
        except Exception:
            return False

    def is_user_admin(self):
        try:
            _ = self.client.get_general_settings()
            return True
        except Exception as err:
            return False



    def get_tracking_config(self, headers):
        if not self.in_dataiku:
            return NO_TRACKING_CONFIG

        import dataiku

        is_user_admin = self.is_user_admin()
        plugin_config = self.plugin_config
        if is_user_admin:
            general_settings = self.client.get_general_settings().get_raw()
            if "udr" in general_settings:
                udr_mode = "DEFAULT" if general_settings["udr"] else "NO"
            if "udrMode" in general_settings:
                udr_mode = general_settings["udrMode"]
        else:
            general_settings = {}
            udr_mode = "DEFAULT"

        if not plugin_config.get("activate_tracking"):
            udr_mode = "NO"

        dss_settings: Dict = dataiku.get_dss_settings()
        is_dev_instance = dss_settings.get("devInstance", False)

        is_tracking_enabled = udr_mode != "NO" and not is_dev_instance

        if not is_tracking_enabled:
            return {"udr_mode": udr_mode}

        try:
            instance_info = self.get_instance_info()
        except Exception:
            instance_info = {}

        if is_user_admin:
            licensing_status = self.client.get_licensing_status()
            try:
                dss_license_kind = licensing_status["base"]["licenseContent"]["licenseKind"]
            except KeyError:
                dss_license_kind = None
        else:
            licensing_status = {}
            dss_license_kind = None

        try:
            user_info: Dict = self.get_user_info(headers)
        except Exception as _:
            auth_info: Dict = self.get_auth_info(headers)
            user_info = {
                "login": auth_info.get("associatedDSSUser"),
                "userProfile": auth_info.get("userProfile"),
            }

        is_dev = os.getenv("FLASK_ENV") == "development"

        tracking_config = {
            "udr_mode": udr_mode,
            "dip_instance_id": instance_info.get("dipInstanceId"),
            "install_id": instance_info.get("installId"),
            "dss_license_kind": dss_license_kind,
            "bkd_distrib": dss_settings.get("distrib"),
            "bkd_distrib_version": dss_settings.get("distribVersion"),
            "node_type": instance_info.get("nodeType"),
            "dss_version": instance_info.get("dssVersion"),
            "install_id": instance_info.get("installId"),
            "is_dev_instance": is_dev_instance or is_dev,   
            "user_info": user_info,
            "web_app_id": current_app.config.get("WEB_APP_ID"),
        }

        return tracking_config

    def get_auth_info(self, headers):
        try:
            return self.client.get_auth_info_from_browser_headers(headers)
        except Exception as err:
            return self.client.get_auth_info()

    def get_user_info(self, headers):
        auth_info = self.get_auth_info(headers)
        return self.client.get_user(auth_info["authIdentifier"]).get_settings().get_raw()

    def get_connection_info(self, connection_name: str) -> Dict:
        return self.client.get_connection(connection_name).get_info()

    def execute_sql(self, *args, **kwargs):
        return self.client.sql_query(*args, **kwargs)

    def set_instance_info(self):
        try:
            self._instanse_info = self.client.get_instance_info().raw
        except Exception:
            self.instance_info = {}

    def get_instance_info(self):
        if self._instanse_info == None:
            self.set_instance_info()
        return self._instanse_info


dataiku_api = DataikuApi()