from typing import Generator, Optional
from pandas import DataFrame
from dataikuapi.dss.dataset import DSSDataset
from commons.python.business_solutions_api.improved_dataset import Dataset


class DatasetIterator:
    def __init__(self, dataset: DSSDataset, chunksize=10000, **kwargs) -> None:
        self.chunksize = chunksize
        self._kwargs = kwargs

        self._dataset = Dataset("%s.%s" % (dataset.project_key, dataset.dataset_name))

    def _create_generator(self) -> Generator[DataFrame, None, None]:
        return self._dataset.iter_dataframes(chunksize=self.chunksize, **self._kwargs)

    def get_chunk(self, index: int) -> Optional[DataFrame]:
        generator = self._create_generator()
        try:
            for _ in range(index):
                next(generator)
            return next(generator)
        except StopIteration:
            return None
