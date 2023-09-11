#!/usr/bin/env python
# encoding: utf-8
"""
dataset.py : Interaction with DSS datasets
Copyright (c) 2013-2014 Dataiku SAS. All rights reserved.
"""

from typing import Optional
import numpy as np
from dataiku.base.utils import check_base_package_version
from dataiku.core.dataset import Schema, create_sampling_argument, unique
import warnings
import logging
import uuid

try:
    import pandas as pd
    check_base_package_version(pd, 'pandas', '0.23.0', None, "DSS requires version 0.23 or above") # keep the version number in sync with install-python-packages.sh
except ImportError as e:
    logging.exception("Pandas import failure")
    warnings.warn("Could not import pandas (%s). Pandas support will be disabled. To enable get_dataframe and other methods, please install the pandas package" % (e), Warning)

from dataiku.core import default_project_key
import json, os

# Module code
from dataiku.core import flow, schema_handling
from dataiku.core import intercom

FULL_SAMPLING = {"samplingMethod": "FULL"}
CSV_SEP = '\t'
CSV_DOUBLE_QUOTE = True
CSV_QUOTE_CHAR = '"'

# Loads the export button in IPython.
try:
    from dataiku.notebook import export
    export.setup()
except:
    pass

DEFAULT_TIMEOUT = 30
if flow.FLOW is not None:
    # Timeout has been introduced to cope with ipython leaks.
    # As a default value, we have an infinite timeout when in flow.
    DEFAULT_TIMEOUT = -1

# We want to stderr something on DeprecationWarning
# But don't reset everything because pandas has set up some filters
warnings.filterwarnings("default", category=DeprecationWarning)

(GENERATING,              # underlying  generator is currently working
 IDLE,                    # waiting for the generator user to call .next()
 TIMEOUT_REACHED,         # timeout has been reached
 END_OF_ITERATOR,
 TERMINATED,) = range(5)  # we reached the generator last element.


class Dataset:
    """This is a handle to obtain readers and writers on a dataiku Dataset.
    From this Dataset class, you can:

    * Read a dataset as a Pandas dataframe
    * Read a dataset as a chunked Pandas dataframe
    * Read a dataset row-by-row
    * Write a pandas dataframe to a dataset
    * Write a series of chunked Pandas dataframes to a dataset
    * Write to a dataset row-by-row
    * Edit the schema of a dataset"""

    def __init__(self, name, project_key=None, ignore_flow=False):
        self.name = name
        self.cols = None
        self.partitions = None
        self.read_partitions = None
        self.writePartition = None
        self.writable = False
        self.readable = False
        self.preparation_steps = None
        self.preparation_requested_output_schema = None
        self.preparation_context_project_key = None
        self.ignore_flow = ignore_flow

        # Flow mode, initialize partitions to read and write and read/write flags
        if flow.FLOW is not None and ignore_flow == False:
            for input_dataset in flow.FLOW["in"]:
                if input_dataset["smartName"] == self.name or input_dataset["fullName"] == self.name:
                    self.readable = True
                    self.name = input_dataset["fullName"]
                    if "partitions" in input_dataset:
                        self.read_partitions = input_dataset["partitions"]
            for output_dataset in flow.FLOW["out"]:
                if output_dataset["smartName"] == self.name or output_dataset["fullName"] == self.name:
                    self.name = output_dataset["fullName"]
                    self.writable = True
                    self.spec_item = output_dataset
                    if "partition" in output_dataset:
                        self.writePartition = output_dataset["partition"]
            if not self.readable and not self.writable:
                raise Exception("Dataset %s cannot be used : declare it as input or output of your recipe" % self.name)
            (self.project_key, self.short_name) = self.name.split(".", 1)

        else:
            if "." not in name:
                try:
                    self.project_key = project_key or default_project_key()
                    self.short_name = name
                    self.name = self.project_key + "." + name
                except:
                    logging.exception("Failure happened")
                    raise Exception("Dataset %s is specified with a relative name, "
                                    "but no default project was found. Please use complete name" % self.name)
            else:
                # use gave a full name
                (self.project_key, self.short_name) = self.name.split(".", 1)
                if project_key is not None and self.project_key != project_key:
                    raise ValueError("Project key %s incompatible with fullname dataset %s." % (project_key, name))
            self.readable = True
            self.writable = True
            self.spec_item = {"appendMode" : False} # notebook always overwrites

    @property
    def full_name(self,):
        return self.project_key + "." + self.short_name

    def _repr_html_(self,):
        s = "Dataset[   <b>%s</b>   ]</br>" % self.name
        s += self.read_schema()._repr_html_()
        return s

    def read_schema(self, raise_if_empty=True):
        """Gets the schema of this dataset, as an array of objects like this one:
        { 'type': 'string', 'name': 'foo', 'maxLength': 1000 }.
        There is more information for the map, array and object types.
        """
        if self.cols is None:
            flow_forced_schemas = os.getenv("FLOW_FORCED_SCHEMAS")
            if flow_forced_schemas is not None:
                ffs = json.loads(flow_forced_schemas)
                if self.full_name in ffs:
                    logging.info("Forcing schema: %s"  % ffs[self.full_name])
                    return ffs[self.full_name]["columns"]

            self.cols = intercom.jek_or_backend_json_call("datasets/get-schema/", data={
                "fullDatasetName": self.full_name
            }, err_msg='Unable to fetch schema for %s'%(self.name)).get("columns")

        if raise_if_empty and len(self.cols) == 0:
            raise Exception(
                "No column in schema of %s."
                " Have you set up the schema for this dataset?" % self.name)
        return Schema(self.cols,)

    def _stream(self,
                infer_with_pandas=True,
                sampling="head",
                sampling_column=None,
                limit=None,
                ratio=None,
                columns=None,
                read_session_id=None,
                filter=None):
        if not self.readable:
            raise Exception("You cannot read dataset %s, "
                            "it is not declared as an input" % self.name)
        if flow.FLOW is not None:
            add_env = {"DKU_FLOW": "1"}
        else:
            add_env = {}

        sampling_params = create_sampling_argument(
            sampling=sampling,
            sampling_column=sampling_column,
            limit=limit,
            ratio=ratio,)

        if self.preparation_steps is not None:
            data = {
                "fullDatasetName": self.full_name,
                "script" :  json.dumps({ "steps" : self.preparation_steps }),
                "requestedOutputSchema" : json.dumps(self.preparation_requested_output_schema),
                "contextProjectKey": self.preparation_context_project_key,
                "sampling" : json.dumps(sampling_params),
                "readSessionId": read_session_id
            }
            if self.read_partitions is not None:
                data["partitions"] = json.dumps(self.read_partitions)

            return intercom.jek_or_backend_stream_call("datasets/stream-prepared-dataset/",
                        data=data, err_msg="Failed to read prepared data")

        else:
            data = {
                "projectKey" : self.project_key,
                "datasetName" : self.short_name,
                "sampling" : json.dumps(sampling_params) if sampling_params is not None else None,
                "columns" : ','.join(columns) if columns is not None else None,
                "format" : "tsv-excel-noheader",
                "partitions" : ",".join(self.read_partitions) if self.read_partitions is not None else None,
                "readSessionId": read_session_id,
                "filter": filter
            }
            return intercom.jek_or_backend_stream_call("datasets/read-data/", data=data, err_msg="Failed to read dataset stream data")

    def _verify_read(self, read_session_id):
        intercom.jek_or_backend_void_call("datasets/verify-read/",
                                          data={"readSessionId": read_session_id}, err_msg="Reading dataset failed")

    @staticmethod
    def get_dataframe_schema_st(schema, columns=None, parse_dates=True, infer_with_pandas=False, bool_as_str=False, int_as_float=False):
        names = []
        dtypes = {}
        for col in schema:
            n = col["name"]
            t = col["type"]
            if bool_as_str and t == "boolean":
                dtypes[n] = "str" # see df_from_split_desc
            elif int_as_float and t in ["tinyint", "smallint", "int", "bigint"]:
                dtypes[n] = "float64"
            elif t in schema_handling.DKU_PANDAS_TYPES_MAP:
                dtypes[n] = schema_handling.DKU_PANDAS_TYPES_MAP[t]
            else:
                dtypes[n] = np.object_
            names.append(n)
        if columns is not None:
            columns = list(unique(columns))
            names = columns
            dtypes = {
                column_name: dtypes[column_name]
                for column_name in dtypes
                if column_name in columns
            }

        # if parse_dates is set to True,
        # list up the index of the columns set up as dates by DSS
        # and forward them to pandas.
        if parse_dates is True:
            parse_dates = [
                col_id
                for (col_id, col_schema) in enumerate(schema)
                if col_schema["type"] == "date" and (columns is None or col_schema["name"] in columns)
            ]
            if len(parse_dates) == 0:
                parse_dates = False
        if infer_with_pandas:
            if bool_as_str:
                dtypes = dict((c["name"], "str") for c in schema if c["type"] == "boolean")
            else:
                dtypes = None
        return (names, dtypes, parse_dates)

    def _get_dataframe_schema(self,
                              columns=None,
                              parse_dates=True,
                              infer_with_pandas=False,
                              bool_as_str=False):

        if self.preparation_steps is not None:
            return Dataset.get_dataframe_schema_st(self.preparation_requested_output_schema["columns"],
                                                   columns, parse_dates, infer_with_pandas, bool_as_str)
        else:
            return Dataset.get_dataframe_schema_st(self.read_schema(),
                                                   columns, parse_dates, infer_with_pandas, bool_as_str)

    def iter_dataframes(self,
                        chunksize=10000,
                        infer_with_pandas=True,
                        sampling="head",
                        sampling_column=None,
                        parse_dates=True,
                        limit=None,
                        ratio=None,
                        columns=None,
                        bool_as_str=False,
                        float_precision=None,
                        na_values=None,
                        keep_default_na=True,
                        filter:Optional[str]=None):
        """Read the dataset to Pandas dataframes by chunks of fixed size.

        Returns a generator over pandas dataframes.

        Useful is the dataset doesn't fit in RAM."""
        if not self.readable:
            raise Exception("You cannot read dataset %s, "
                            "it is not declared as an input" % self.name)
        (names, dtypes, parse_date_columns) = self._get_dataframe_schema(
            columns=columns,
            parse_dates=parse_dates,
            infer_with_pandas=infer_with_pandas,
            bool_as_str=bool_as_str)
        read_session_id = str(uuid.uuid4())
        with self._stream(infer_with_pandas=infer_with_pandas,
                          sampling=sampling,
                          sampling_column=sampling_column,
                          limit=limit,
                          ratio=ratio,
                          columns=columns,
                          read_session_id=read_session_id,
                          filter=filter) as dku_output:
            df_it = pd.read_table(
                dku_output,
                dtype=dtypes,
                names=names,
                low_memory=True,
                header=None,
                sep=CSV_SEP,
                doublequote=CSV_DOUBLE_QUOTE,
                chunksize=chunksize,
                iterator=True,
                parse_dates=parse_date_columns,
                float_precision=float_precision,
                na_values=na_values,
                keep_default_na=keep_default_na)
            logging.info("Starting dataframes iterator")
            for df in df_it:
                yield df

        # stream seems to have run fine. 'Seems'. Verify that.
        # note to self: this call has to be made after the dataframe creation, because it is streamed
        self._verify_read(read_session_id)
