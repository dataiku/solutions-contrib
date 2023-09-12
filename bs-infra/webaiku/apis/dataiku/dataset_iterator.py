from dataikuapi.dss.dataset import DSSDataset


class DatasetIterator:
    def __init__(self, dataset: DSSDataset, chunksize=10000, **kwargs) -> None:
        self.chunksize = chunksize
        self._kwargs = kwargs

        self._dataset = Dataset("%s.%s" % (dataset.project_key, dataset.dataset_name))
