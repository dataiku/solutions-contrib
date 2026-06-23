"""Framework-free request-body validation.

Takes an already-parsed JSON ``body`` rather than a framework request object,
so the Flask adapter feeds it ``request.get_json()``.
The FastAPI adapter validates with Pydantic models instead and generally does
not call this.
"""

from typing import Optional

from webaiku.errors import WebaikuBadRequestError


def parse_req(
    body: dict,
    required_fields: Optional[list] = None,
    optional_fields: Optional[list] = None,
    allow_additional_fields: bool = False,
) -> dict:
    required_fields = required_fields or []
    optional_fields = optional_fields or []

    # Copy so we can pop without mutating the caller's dict.
    req_json = dict(body)
    data = {}
    missing_fields = []
    for field in required_fields + optional_fields:
        if field not in req_json and field in required_fields:
            missing_fields.append(field)
        else:
            data[field] = req_json.pop(field, None)

    if len(missing_fields) > 0:
        raise WebaikuBadRequestError(
            f"Missing mandatory field(s): {', '.join(missing_fields)}.",
        )

    if not allow_additional_fields and len(req_json) > 0:
        raise WebaikuBadRequestError(
            f"Additional field(s) not allowed: {', '.join(list(req_json.keys()))}.",
        )
    return data
