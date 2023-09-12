from typing import Optional
from dataikuapi import DSSClient
import logging
import os
import json
from functools import cached_property
from webaiku.errors import WebaikuError


logger = logging.getLogger("webaiku")


class DSSInstance:
    def __init__(
        self,
        name: Optional[str] = None,
        host: Optional[str] = None,
        api_key: Optional[str] = None,
    ):
        self.name = name
        self.host = host
        self.api_key = api_key
        self._client: Optional[DSSClient] = None
        self.initialized = False
        self.init(host, api_key)

    @property
    def client(self):
        if not self.initialized:
            raise WebaikuError(
                "You need to initialize the instance before getting the client."
            )

        if self._client is None:
            raise WebaikuError("No client set for this instance.")
        return self._client

    @cached_property
    def in_dataiku(self):
        try:
            import dataiku  # type: ignore

            return True
        except Exception as err:
            return False

    @property
    def is_ready(self):
        return self.host is not None and self.api_key is not None

    def prefix_with_name(self, s: str) -> str:
        prefix = f"{self.name.upper()}_" if self.name else ""
        return f"{prefix}{s}"

    @property
    def env_api_key_key(self):
        return self.prefix_with_name("DKU_API_KEY")

    @property
    def env_host_key(self):
        return self.prefix_with_name("DKU_HOST")

    def assign_credentials(
        self, host: Optional[str] = None, api_key: Optional[str] = None
    ):
        self.assign_host(host)
        self.assign_api_key(api_key)
        if not self.is_ready:
            self.assign_from_config()

    def assign_host(self, host: Optional[str] = None):
        self.host = host
        if self.host is None:
            self.host = os.getenv(self.env_host_key)

    def assign_api_key(self, api_key: Optional[str] = None):
        self.api_key = api_key
        if self.api_key is None:
            self.api_key = os.getenv(self.env_api_key_key)

    def assign_from_config(self):
        config_path = os.path.expanduser("~/.dataiku/config.json")
        logger.info(f"Assigning credentials from config file in {config_path}")
        if not os.path.exists(config_path):
            logger.info(
                f"Config file does not exist in {config_path}. Please see documentation to know more https://doc.dataiku.com/dss/latest/python-api/outside-usage.html#setting-up-the-connection-with-dss"
            )
            return

        try:
            with open(config_path, "r") as config_file:
                config: dict = json.load(config_file)

            dss_instances_creds = config.get("dss_instances", {})
            if self.name:
                instance_creds = dss_instances_creds.get(self.name)
            else:
                default_instance_name = config.get("default_instance", "")
                instance_creds = dss_instances_creds.get(default_instance_name)
                self.name = default_instance_name

            if instance_creds is None:
                logger.info(
                    f"Could not retrieve config as it is empty or not formatted properly. See here how to format {config_path}: https://doc.dataiku.com/dss/latest/python-api/outside-usage.html#setting-up-the-connection-with-dss"
                )
                return

            self.host = instance_creds.get("url")
            self.api_key = instance_creds.get("api_key")
        except Exception as err:
            logger.exception(
                f"Something went wrong when retrieving the credentials from {config_path}. Check that the file is a valid JSON."
            )
            return

    def assign_client(self):
        if self.is_ready:
            self._client = DSSClient(host=self.host, api_key=self.api_key)
            logger.info(f"✔ DSS Client assigned successfully")

        elif self.in_dataiku:
            import dataiku  # type: ignore

            self._client = dataiku.api_client()
            logger.info("Running inside Dataiku.")
            return
        else:
            raise WebaikuError(
                "Could not assign DSS client as credentials are not set."
            )

    def check_instance_availability(self):
        if not self._client:
            raise WebaikuError(f"Client not set.")

        try:
            _ = self._client.get_auth_info()
        except Exception as err:
            raise WebaikuError(f"Instance {self.host} seems unavailable.")

    def init(self, host: Optional[str], api_key: Optional[str]):
        self.assign_credentials(host, api_key)
        self.assign_client()
        self.check_instance_availability()
        if self._client:
            logger.info(f"Instance host {self.host} initialized.")
            self.initialized = True
