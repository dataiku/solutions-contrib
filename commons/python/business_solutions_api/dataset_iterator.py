from typing import Generator, Optional
from pandas import DataFrame
import pandas as pd
from dataikuapi.dss.dataset import DSSDataset
from commons.python.business_solutions_api.improved_dataset import Dataset


class DatasetIterator:
    def __init__(self, dataset: DSSDataset, chunksize=10000, **kwargs) -> None:
        self.chunksize = chunksize
        self._kwargs = kwargs

        self._dataset = Dataset("%s.%s" % (dataset.project_key, dataset.dataset_name))

    def _create_generator(self, group_key=None) -> Generator[DataFrame, None, None]:
        #if we are using grouping we group on the whole data
        # TODO review this
        chunkSize = None if group_key else self.chunksize
        return self._dataset.iter_dataframes(chunksize=chunkSize, **self._kwargs)

    def get_chunk(self, index: int, group_key=None, group_row=None) -> Optional[DataFrame]:
        generator = self._create_generator(group_key)
        try:
            for _ in range(index):
                next(generator)
            if group_key:
                if group_row:
                    result = next(generator).groupby(group_key, as_index=False).get_group(group_row)
                else:
                    result = next(generator).groupby(group_key, as_index=False).count()
                return result
            return next(generator)
        except StopIteration:
            return None