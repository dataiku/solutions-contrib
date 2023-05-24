def parse_req(request, required_fields=[], optional_fields=[], useless_fields=[], allow_additional_fields=False):
    def is_required(field):
        return field in required_fields

    def is_useless(field):
        return field in useless_fields

    req_json = request.get_json(force=True)
    data = {}
    missing_fields = []
    for field in required_fields + optional_fields + useless_fields:
        if isinstance(field, dict):
            field_from = list(field.keys())[0]
            field_to = list(field.values())[0]
        else:
            field_from = field
            field_to = field
        if field_from not in req_json and is_required(field):
            missing_fields.append(field_from)
        else:
            field_value = req_json.pop(field_from, None)
            if not is_useless(field):
                data[field_to] = field_value

    if len(missing_fields) > 0:
        raise Exception(f'Missing mandatory field(s): {", ".join(missing_fields)}.')

    if not allow_additional_fields:
        if len(req_json) > 0:
            raise Exception(f'Additional field(s) not allowed: {", ".join(list(req_json.keys()))}.')
    return data
