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
        chunkSize = None if group_key else self.chunksize
        return self._dataset.iter_dataframes(chunksize=chunkSize, **self._kwargs)

    def _sort_chunk(self, df:Optional[DataFrame], sort_model=None) -> Optional[DataFrame]:
        result = df
        if sort_model:
            sort_columns = []
            sort_orders = []
            for sort_info in sort_model:
                    sort_order = sort_info.get('sort', 'asc')
                    col_id = sort_info.get('colId')
                    if col_id:
                        sort_columns.append(col_id)
                        sort_orders.append(sort_order == 'asc')
            if sort_columns:
                result = result.sort_values(by=sort_columns, ascending=sort_orders).reset_index(drop=True)
        return result

    def get_chunk(self, index: int, group_key=None, group_row=None, sort_model=None) -> Optional[DataFrame]:
        generator = self._create_generator(group_key)
        try:
            for _ in range(index):
                next(generator)
            result = next(generator)
            if group_key:
                if group_row:
                    result = result.groupby(group_key, as_index=False).get_group(group_row)
                else:
                    result = result.groupby(group_key, as_index=False).count()
            result = self._sort_chunk(result, sort_model)
            return result
        except StopIteration:
            return None