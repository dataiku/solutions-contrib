"""`DatasetService` logic: grouping unpack, filter assembly, int coercion, and
pass-through to a mocked Dataiku API (`fake_api` fixture)."""

import pytest
from pandas import DataFrame

from webaiku.core.dataset import (
    DatasetService,
    _coerce_int,
    _handle_grouping,
)
from webaiku.errors import WebaikuBadRequestError

# --- _handle_grouping ------------------------------------------------------


def test_handle_grouping_no_keys_is_noop():
    group_key, group_row, filters = _handle_grouping([], [], {})
    assert group_key is None
    assert group_row is None
    assert filters == {}


def test_handle_grouping_expanding_level():
    # More keys than rows: group on the next key, expanded rows become filters.
    group_key, group_row, filters = _handle_grouping(["a", "b"], ["x"], {})
    assert group_key == "b"
    assert group_row is None
    assert filters == {"a": ["x"]}


def test_handle_grouping_leaf_level():
    # Keys == rows: deepest key/row is the selected group.
    group_key, group_row, filters = _handle_grouping(["a"], ["x"], {})
    assert group_key == "a"
    assert group_row == "x"
    assert filters == {}


# --- _coerce_int -----------------------------------------------------------


def test_coerce_int_accepts_numeric_string():
    assert _coerce_int("42", "chunksize") == 42


def test_coerce_int_rejects_non_integer():
    with pytest.raises(WebaikuBadRequestError) as exc:
        _coerce_int("abc", "chunksize")
    assert "chunksize" in str(exc.value)
    assert exc.value.status_code == 400


# --- _build_filter ---------------------------------------------------------


def test_build_filter_none_when_empty():
    assert DatasetService._build_filter(None, None) is None
    assert DatasetService._build_filter({}, {}) is None


def test_build_filter_value_list_produces_array_contains():
    formula = DatasetService._build_filter({"col": ["v1", "v2"]}, None)
    assert "arrayContains" in formula
    assert '"v1"' in formula and '"v2"' in formula


def test_build_filter_custom_filter_produces_expression():
    formula = DatasetService._build_filter(
        None,
        {"col": {"filterType": "equals", "value": "foo"}},
    )
    assert "==" in formula


# --- Service pass-through (fake API) ---------------------------------------


def test_get_schema_passes_through(fake_api):
    service = DatasetService()
    assert service.get_schema("ds") == fake_api.schema


def test_get_chunk_returns_dataframe_and_coerces_ints(fake_api):
    service = DatasetService()
    df = service.get_chunk("ds", chunksize="100", chunk_index="0")
    assert isinstance(df, DataFrame)
    assert fake_api.last_chunk_kwargs["chunksize"] == 100
    assert fake_api.last_chunk_kwargs["chunk_index"] == 0


def test_get_filtered_chunk_forwards_assembled_filter(fake_api):
    service = DatasetService()
    service.get_filtered_chunk(
        "ds",
        chunksize="50",
        chunk_index="1",
        filters={"col": ["v1"]},
    )
    kwargs = fake_api.last_chunk_kwargs
    assert kwargs["chunksize"] == 50
    assert kwargs["chunk_index"] == 1
    assert "arrayContains" in kwargs["filter"]


def test_get_filtered_chunk_no_filter_when_unfiltered(fake_api):
    service = DatasetService()
    service.get_filtered_chunk("ds", chunksize="50", chunk_index="0")
    assert fake_api.last_chunk_kwargs["filter"] is None
