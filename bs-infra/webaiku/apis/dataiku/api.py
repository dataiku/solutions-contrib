import logging
import os
from functools import wraps
from typing import Any, Callable, Optional, TypeVar, Union

from dataikuapi.dss.dataset import DSSDataset
from dataikuapi.dssclient import DSSProject
from pandas import DataFrame
from typing_extensions import Concatenate, ParamSpec

from webaiku.errors import WebaikuError

from .dataset_iterator import DatasetIterator
from .dss_instance import DSSInstance

P = ParamSpec("P")
R = TypeVar("R")
T = TypeVar("T", bound="DataikuAPI")

logger = logging.getLogger("webaiku")

DKU_INSTANCE_NAME_ENV = "DKU_INSTANCE_NAME"


def using_dataset(
    func: Callable[Concatenate[T, DSSDataset, P], R],
) -> Callable[Concatenate[T, Union[DSSDataset, str], P], R]:
    """Pass Dataiku dataset handle to wrapped function."""

    @wraps(func)
    def inner(
        self: T,
        dataset: Union[DSSDataset, str],
        *args: P.args,
        **kwargs: P.kwargs,
    ) -> R:
        if isinstance(dataset, DSSDataset):
            _dataset = dataset
        elif isinstance(dataset, str):
            _dataset = self.project.get_dataset(dataset_name=dataset)
        else:
            raise WebaikuError("Unknown dataset argument")
        return func(self, _dataset, *args, **kwargs)

    return inner


class DataikuAPI:
    """Dataiku API wrapper."""

    env_project_key = "DKU_CURRENT_PROJECT_KEY"

    def __init__(
        self,
        name: Optional[str] = None,
        host: Optional[str] = None,
        api_key: Optional[str] = None,
        project_key: Optional[str] = None,
    ) -> None:
        """Build the API wrapper and eagerly initialize its DSS connection.

        Args:
            name: Optional DSS instance name used to resolve credentials.
            host: Optional DSS host URL; falls back to env/config when omitted.
            api_key: Optional DSS API key; falls back to env/config when omitted.
            project_key: Optional project key; resolved from the default project
                or the ``DKU_CURRENT_PROJECT_KEY`` env var when omitted.

        """
        self.__instance = DSSInstance(name=name, host=host, api_key=api_key)
        self._client = self.__instance.client
        self._project_key = project_key
        self.initialized = False
        self.init(project_key=project_key)

    @property
    def project_key(self) -> str:
        """Retrieve project key."""
        if not self.initialized:
            raise WebaikuError(
                "You need to initialize the project key before getting the project.",
            )

        if self._project_key is None:
            raise WebaikuError("No project set for this API")

        return self._project_key

    @property
    def project(self) -> DSSProject:
        """Retrieve project handle."""
        if not self.initialized:
            raise WebaikuError(
                "You need to initialize the project key before getting the project.",
            )

        if self._project_key is None:
            raise WebaikuError("No project set for this API")

        return self._client.get_project(project_key=self._project_key)

    def assign_project_key(self, project_key: Optional[str] = None) -> None:
        """Set the project key, resolving a default when none is given.

        When ``project_key`` is ``None`` this falls back to the DSS default
        project and then to the ``DKU_CURRENT_PROJECT_KEY`` env var.

        Raises:
            WebaikuError: If no project key can be resolved.

        """
        self._project_key = project_key
        if self._project_key is None:
            try:
                default_project = self._client.get_default_project()
                if default_project:
                    self._project_key = default_project.project_key
                else:
                    self._project_key = os.getenv(self.env_project_key, None)
            except Exception:
                raise WebaikuError(
                    "Please define the default project or set a DKU_CURRENT_PROJECT_KEY environment variable before using it.",
                )

    def check_api_availability(self) -> None:
        """Check API availability through access to project."""
        if not self._project_key:
            raise WebaikuError("Project key is not defined")
        try:
            _ = self._client.get_project(project_key=self._project_key)
        except Exception as e:
            raise WebaikuError(f"Project {self._project_key} seems unavailable.") from e

    def init(self, project_key: Optional[str] = None) -> None:
        """Resolve the project key, verify access and flag the API as ready.

        Args:
            project_key: Optional explicit project key; resolved from defaults
                when omitted.

        """
        self.assign_project_key(project_key=project_key)
        self.check_api_availability()
        if self._project_key:
            logger.info(
                f"Dataiku API initialized with project key : {self._project_key}",
            )
            self.initialized = True

    @using_dataset
    def get_dataset_schema(self, dataset: DSSDataset) -> dict[str, Any]:
        """Return the schema of the DSS dataset."""
        return dataset.get_schema()

    @using_dataset
    def get_dataset_records_count(self, dataset: DSSDataset) -> None:
        """Return the DSS dataset record count."""
        # Not implemented
        return

    @using_dataset
    def get_dataset_generic_data(self, dataset: DSSDataset) -> dict[str, Any]:
        """Return general DSS dataset metadata."""
        return {
            "schema": self.get_dataset_schema(dataset),
            "columnsCount": self.get_dataset_records_count(dataset),
        }

    @using_dataset
    def get_dataset_chunk(
        self,
        dataset: DSSDataset,
        chunk_index: int,
        chunksize: int = 10000,
        filter: Optional[str] = None,
        group_key: Optional[str] = None,
        group_row: Optional[str] = None,
        sort_model: Optional[list[dict[str, str]]] = None,
    ) -> Optional[DataFrame]:
        """Read a single paginated, optionally grouped/sorted dataset chunk.

        Args:
            dataset: The DSS dataset handle (injected by ``using_dataset``).
            chunk_index: Zero-based index of the chunk to return.
            chunksize: Number of rows per chunk; ignored when grouping (the
                whole dataset is read so grouping is global).
            filter: Optional DSS formula string.
            group_key: Optional column name to group rows by.
            group_row: Optional group value to select within ``group_key``; when
                omitted the grouped counts are returned instead.
            sort_model: Optional list of ``{"colId": str, "sort": "asc"|"desc"}``
                entries describing the sort order.

        Returns:
            The chunk as a pandas ``DataFrame``, or ``None`` if ``chunk_index``
            is past the end of the data.

        """
        dataset_iterator = DatasetIterator(
            dataset=dataset,
            chunksize=chunksize,
            filter=filter,
        )
        return dataset_iterator.get_chunk(
            index=chunk_index,
            group_key=group_key,
            group_row=group_row,
            sort_model=sort_model,
        )


_dataiku_api: Optional["DataikuAPI"] = None


def get_dataiku_api() -> "DataikuAPI":
    """Return the process-wide ``DataikuAPI`` singleton.

    Constructed lazily rather than at import time, so importing the package
    (and its adapters) has no side effects and does not require a live DSS connection.
    """
    global _dataiku_api
    if _dataiku_api is None:
        _dataiku_api = DataikuAPI(name=DKU_INSTANCE_NAME_ENV)
    return _dataiku_api
