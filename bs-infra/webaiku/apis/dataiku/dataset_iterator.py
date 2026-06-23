from collections.abc import Generator
from typing import Any, Optional

from dataikuapi.dss.dataset import DSSDataset
from pandas import DataFrame


class DatasetIterator:
    """Page through a DSS dataset and group/sort chunks in pandas.

    Wraps the vendored :class:`~webaiku.apis.dataiku.improved_dataset.Dataset`
    streaming reader, exposing one chunk at a time with optional grouping and
    sorting applied client-side.
    """

    def __init__(
        self,
        dataset: DSSDataset,
        chunksize: int = 10000,
        **kwargs: Any,
    ) -> None:
        """Build an iterator over the given dataset.

        Args:
            dataset: The DSS dataset handle to read from.
            chunksize: Number of rows per chunk when not grouping.
            **kwargs: Extra keyword arguments forwarded to
                ``Dataset.iter_dataframes`` (e.g. ``filter``).
        """
        # Imported lazily: improved_dataset pulls in the in-DSS `dataiku`
        # package, which is only available at request time inside DSS. Keeping
        # it out of module scope lets the package (and adapters) import without
        # a DSS runtime.
        from .improved_dataset import Dataset

        self.chunksize = chunksize
        self._kwargs = kwargs
        self._dataset = Dataset("%s.%s" % (dataset.project_key, dataset.dataset_name))

    def _create_generator(
        self,
        group_key: Optional[str] = None,
    ) -> Generator[DataFrame, None, None]:
        """Return a generator of dataframes for the underlying dataset.

        When ``group_key`` is set the whole dataset is read in a single chunk so
        that grouping is computed globally rather than per page.
        """
        # if we are using grouping we group on the whole data
        chunkSize = None if group_key else self.chunksize
        return self._dataset.iter_dataframes(chunksize=chunkSize, **self._kwargs)

    def _sort_chunk(
        self,
        df: Optional[DataFrame],
        sort_model: Optional[list[dict[str, str]]] = None,
    ) -> Optional[DataFrame]:
        """Sort a chunk in place according to ``sort_model``.

        Args:
            df: The dataframe to sort, or ``None``.
            sort_model: List of ``{"colId": str, "sort": "asc"|"desc"}`` entries;
                entries without a ``colId`` are skipped.

        Returns:
            The sorted dataframe (with a reset index), or ``df`` unchanged when
            there is nothing to sort.
        """
        result = df
        if sort_model:
            sort_columns = []
            sort_orders = []
            for sort_info in sort_model:
                sort_order = sort_info.get("sort", "asc")
                col_id = sort_info.get("colId")
                if col_id:
                    sort_columns.append(col_id)
                    sort_orders.append(sort_order == "asc")
            if sort_columns:
                result = result.sort_values(
                    by=sort_columns,
                    ascending=sort_orders,
                ).reset_index(drop=True)
        return result

    def get_chunk(
        self,
        index: int,
        group_key: Optional[str] = None,
        group_row: Optional[str] = None,
        sort_model: Optional[list[dict[str, str]]] = None,
    ) -> Optional[DataFrame]:
        """Return the chunk at ``index``, optionally grouped and sorted.

        Args:
            index: Zero-based chunk index; the generator is advanced this many
                times before the chunk is read.
            group_key: Optional column name to group by.
            group_row: Optional group value to select within ``group_key``; when
                omitted the grouped counts are returned instead.
            sort_model: Optional sort specification (see :meth:`_sort_chunk`).

        Returns:
            The requested chunk as a ``DataFrame``, or ``None`` if ``index`` is
            past the end of the data.
        """
        generator = self._create_generator(group_key)
        try:
            for _ in range(index):
                next(generator)
            result = next(generator)
            if group_key:
                if group_row:
                    result = result.groupby(group_key, as_index=False).get_group(
                        group_row,
                    )
                else:
                    result = result.groupby(group_key, as_index=False).count()
            result = self._sort_chunk(result, sort_model)
            return result
        except StopIteration:
            return None
