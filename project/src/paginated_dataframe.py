from typing import Generator, Optional, List
from pandas import DataFrame
from dataikuapi.dss.project import DSSProject

DATASET_CHUNKSIZE_SEPARATOR = ":==:"

class PaginatedDataframe:
    def __init__(self, project: DSSProject, dataset_name: str, chunksize=10000, **kwargs) -> None:
        self.dataset_name = dataset_name
        self.chunksize = chunksize
        self.dataset_chunksize_binding = self.create_dataset_chunksize_binding(dataset_name=dataset_name, chunksize=chunksize)
        self._chunks: List[DataFrame] = []
        self._iteration_complete = False

        dataset = project.get_dataset(dataset_name=self.dataset_name).get_as_core_dataset()
        self._generator: Generator[DataFrame, None, None] = dataset.iter_dataframes(chunksize=self.chunksize, **kwargs)

    @property
    def _chunks_loaded(self):
        return len(self._chunks)

    def load(self) -> Optional[DataFrame]:
        if self._iteration_complete: return None
        try:
            chunk = next(self._generator)
            self._chunks.append(chunk)
            return chunk
        except StopIteration:
            self._iteration_complete = True


    def get_chunk(self, index: int) -> Optional[DataFrame]:
        if (index > self._chunks_loaded - 1): 
            if (self._iteration_complete): return None
            self.load()
            return self.get_chunk(index)
        return self._chunks[index]

    @staticmethod
    def create_dataset_chunksize_binding(dataset_name: str, chunksize: int):
        return f"{dataset_name}{DATASET_CHUNKSIZE_SEPARATOR}{chunksize}"

    @staticmethod
    def split_dataset_chunksize_binding(dataset_chunksize_binding: str):
        return dataset_chunksize_binding.split(DATASET_CHUNKSIZE_SEPARATOR)