"""Unit tests for the framework-free `parse_req` body validator."""

import pytest

from webaiku.core.request import parse_req
from webaiku.errors import WebaikuBadRequestError


def test_returns_only_declared_fields():
    data = parse_req(
        {"dataset_name": "ds", "chunksize": 100, "chunk_index": 0},
        required_fields=["dataset_name", "chunksize", "chunk_index"],
    )
    assert data == {"dataset_name": "ds", "chunksize": 100, "chunk_index": 0}


def test_optional_field_defaults_to_none_when_absent():
    data = parse_req(
        {"dataset_name": "ds"},
        required_fields=["dataset_name"],
        optional_fields=["filters"],
    )
    assert data == {"dataset_name": "ds", "filters": None}


def test_missing_required_field_raises():
    with pytest.raises(WebaikuBadRequestError) as exc:
        parse_req(
            {"dataset_name": "ds"},
            required_fields=["dataset_name", "chunksize"],
        )
    assert "chunksize" in str(exc.value)
    assert exc.value.status_code == 400


def test_additional_field_rejected_by_default():
    with pytest.raises(WebaikuBadRequestError) as exc:
        parse_req(
            {"dataset_name": "ds", "surprise": 1},
            required_fields=["dataset_name"],
        )
    assert "surprise" in str(exc.value)


def test_additional_field_allowed_when_flag_set():
    data = parse_req(
        {"dataset_name": "ds", "extra": 1},
        required_fields=["dataset_name"],
        allow_additional_fields=True,
    )
    # Tolerated, but not returned
    assert data == {"dataset_name": "ds"}


def test_does_not_mutate_caller_body():
    body = {"dataset_name": "ds", "chunksize": 1}
    parse_req(body, required_fields=["dataset_name"], allow_additional_fields=True)
    assert body == {"dataset_name": "ds", "chunksize": 1}
