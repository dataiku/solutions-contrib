from enum import Enum
from typing import TypedDict, Union, Literal

class FilterType(str, Enum):
    Equals = 'equals'
    NotEqual = 'notEqual'
    Contains = 'contains'
    NotContains = 'notContains'
    StartsWith = 'startsWith'
    EndsWith = 'endsWith'
    Blank = 'blank'
    NotBlank = 'notBlank'
    LessThan = 'lessThan'
    LessThanOrEqual = 'lessThanOrEqual'
    GreaterThan = 'greaterThan'
    GreaterThanOrEqual = 'greaterThanOrEqual'
    InRange = 'inRange'

    @staticmethod
    def generate_filter_expression(filter_type, sanitized_column: str, sanitized_val: str, sanitized_to_val: str = None, value_type: str = None):
        if filter_type not in FilterType:
            return f"Unknown filter type: {filter_type}"
        
        lower_sanitized_column = f"toLowercase(strval('{sanitized_column}'))"
        lower_sanitized_val = f"toLowercase('{sanitized_val}')"

        filter_map = {
            FilterType.Equals: f"{lower_sanitized_column} == {lower_sanitized_val}",
            FilterType.NotEqual: f"{lower_sanitized_column} != {lower_sanitized_val}",
            FilterType.Contains: f"{lower_sanitized_column}.contains({lower_sanitized_val})",
            FilterType.NotContains: f"not ({lower_sanitized_column}.contains({lower_sanitized_val}))",
            FilterType.StartsWith: f"{lower_sanitized_column}.startsWith({lower_sanitized_val})",
            FilterType.EndsWith: f"{lower_sanitized_column}.endsWith({lower_sanitized_val})",
            FilterType.Blank: f"isBlank(strval('{sanitized_column}'))",
            FilterType.NotBlank: f"isNonBlank(strval('{sanitized_column}'))",
            FilterType.LessThan: f"{sanitized_column} < {sanitized_val}",
            FilterType.LessThanOrEqual: f"{sanitized_column} <= {sanitized_val}",
            FilterType.GreaterThan: f"{sanitized_column} > {sanitized_val}",
            FilterType.GreaterThanOrEqual: f"{sanitized_column} >= {sanitized_val}",
            FilterType.InRange: FilterType._create_range_filter_from_values(sanitized_column, sanitized_val, sanitized_to_val, value_type == 'string'),
        }
        return filter_map[filter_type]

    @staticmethod
    def _create_range_filter_from_values(sanitized_column: str, sanitized_val: str, sanitized_to_val: str, isString: bool):
        expressions = []
        if sanitized_val:
            from_val = f'"{sanitized_val}"' if isString else f'{sanitized_val}'
            expressions.append(f'({sanitized_column} >= {from_val})')
        if sanitized_to_val:
            to_val = f'"{sanitized_to_val}"' if isString else f'{sanitized_to_val}'
            expressions.append(f'({sanitized_column} <= {to_val})')
        expression = ', '.join(expressions)
        return 'and(' + expression + ')'
    
OperatorType = Union[None, Literal['and'], Literal['or']]


class CustomFilter(TypedDict):
    filterType: FilterType
    value: str
    toValue: Union[None, str]
    operator: OperatorType


class RangeFilter(CustomFilter, TypedDict):
    filterType: Literal[FilterType.InRange]
    toValue: Union[None, str]
    valueType: Literal["string", "number"]