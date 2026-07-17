"""Resolve DSS instance credentials and settings."""

import importlib.util
import json
import logging
import os
from typing import Optional

from dataikuapi import DSSClient

from webaiku.errors import WebaikuError

logger = logging.getLogger("webaiku")


class DSSInstance:
    """Resolve DSS connection credentials and build a ``DSSClient``.

    Credentials are resolved (in order) from explicit arguments, environment
    variables, the ``~/.dataiku/config.json`` file, or — when running inside
    DSS — the ambient ``dataiku`` runtime client.
    """

    def __init__(
        self,
        name: Optional[str] = None,
        host: Optional[str] = None,
        api_key: Optional[str] = None,
    ) -> None:
        """Build the instance and eagerly establish a DSS client.

        Args:
            name: Optional DSS instance name used to namespace env vars and to
                look up credentials in the config file.
            host: Optional DSS host URL; resolved from env/config when omitted.
            api_key: Optional DSS API key; resolved from env/config when omitted.

        """
        self.name = name
        self.host = host
        self.api_key = api_key
        self._client: Optional[DSSClient] = None
        self.initialized = False
        self.init(host, api_key)

    @property
    def client(self) -> DSSClient:
        """Get the client."""
        if not self.initialized:
            msg = "You need to initialize the instance before getting client."
            raise WebaikuError(msg)

        if self._client is None:
            msg = "No client set for this instance."
            raise WebaikuError(msg)
        return self._client

    @property
    def is_in_dataiku(self) -> bool:
        """Check if in a Dataiku instance.

        Linter strips away bare ``import dataiku``. Use ``importlib`` instead.
        Only returns ``True`` inside DSS, where the ``dataiku`` package exists.
        """
        return importlib.util.find_spec("dataiku") is not None

    @property
    def is_ready(self) -> bool:
        """Check if host and API key are present to represent ready state."""
        return self.host is not None and self.api_key is not None

    def _prefix_with_name(self, s: str) -> str:
        """Prefix with name."""
        prefix = f"{self.name.upper()}_" if self.name else ""
        return f"{prefix}{s}"

    @property
    def env_api_key_key(self) -> str:
        """Name of the env var holding the API key (name-prefixed if set)."""
        return self._prefix_with_name("DKU_API_KEY")

    @property
    def env_host_key(self) -> str:
        """Name of the env var holding the host URL (name-prefixed if set)."""
        return self._prefix_with_name("DKU_DSS_URL")

    def assign_credentials(
        self,
        host: Optional[str] = None,
        api_key: Optional[str] = None,
    ) -> None:
        """Resolve host and API key, falling back to the config file.

        Explicit arguments take precedence, then environment variables; if the
        instance is still not ready the ``~/.dataiku/config.json`` file is read.
        """
        self.assign_host(host)
        self.assign_api_key(api_key)
        if not self.is_ready:
            self.assign_from_config()

    def assign_host(self, host: Optional[str] = None) -> None:
        """Set the host from the argument, or the host env var when omitted."""
        self.host = host
        if self.host is None:
            self.host = os.getenv(self.env_host_key)

    def assign_api_key(self, api_key: Optional[str] = None) -> None:
        """Set the API key from the argument, or the env var when omitted."""
        self.api_key = api_key
        if self.api_key is None:
            self.api_key = os.getenv(self.env_api_key_key)

    def assign_from_config(self) -> None:
        """Load host and API key from ``~/.dataiku/config.json``.

        Reads the credentials for ``self.name`` (or the configured default
        instance). Missing, empty or malformed config is logged and ignored
        rather than raised.
        """
        config_path = os.path.expanduser("~/.dataiku/config.json")
        logger.info(f"Assigning credentials from config file in {config_path}")
        if not os.path.exists(config_path):
            logger.info(
                f"Config file does not exist in {config_path}. Please see documentation to know more https://doc.dataiku.com/dss/latest/python-api/outside-usage.html#setting-up-the-connection-with-dss",
            )
            return

        try:
            with open(config_path) as config_file:
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
                    f"Could not retrieve config as it is empty or not formatted properly. See here how to format {config_path}: https://doc.dataiku.com/dss/latest/python-api/outside-usage.html#setting-up-the-connection-with-dss",
                )
                return

            self.host = instance_creds.get("url")
            self.api_key = instance_creds.get("api_key")
        except Exception:
            logger.exception(
                f"Something went wrong when retrieving the credentials from {config_path}. Check that the file is a valid JSON.",
            )
            return

    def assign_client(self) -> None:
        """Create the ``DSSClient`` from resolved credentials or the runtime.

        Uses explicit host/API key when ready, otherwise the ambient ``dataiku``
        client when running inside DSS.

        Raises:
            WebaikuError: If no client can be created because credentials are
                unset and the code is not running inside DSS.

        """
        if self.is_ready:
            self._client = DSSClient(host=self.host, api_key=self.api_key)
            logger.info("✔ DSS Client assigned successfully")
            return

        if self.is_in_dataiku:
            import dataiku  # noqa: PLC0415

            self._client = dataiku.api_client()  # pyright: ignore[reportAttributeAccessIssue]
            logger.info("Running inside Dataiku.")
            return

        msg = "Could not assign DSS client as credentials are not set."
        raise WebaikuError(msg)

    def check_instance_availability(self) -> None:
        """Check instance availability."""
        if not self._client:
            msg = "Client not set."
            raise WebaikuError(msg)

        try:
            _ = self._client.get_auth_info()
        except Exception as e:
            msg = f"Instance {self.host} seems unavailable."
            raise WebaikuError(msg) from e

    def init(self, host: Optional[str], api_key: Optional[str]) -> None:
        """Resolve credentials, build the client, verify it and mark as ready.

        Args:
            host: Optional DSS host URL.
            api_key: Optional DSS API key.

        """
        self.assign_credentials(host, api_key)
        self.assign_client()
        self.check_instance_availability()
        if self._client:
            logger.info(f"Instance host {self.host} initialized.")
            self.initialized = True
