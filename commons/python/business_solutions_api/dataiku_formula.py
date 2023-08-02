from enum import Enum
from typing import TypedDict, Union

def _escape_double_quotes(text: str):
    return text.replace('"', '\\"')

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
    # TODO inrange to be changed to in range filter
    @staticmethod
    def generate_filter_expression(filter_type, sanitized_column:str, sanitized_val: str, sanitized_to_val: str =None):
        filter_map = {
            FilterType.Equals: f"strval('{sanitized_column}') == '{sanitized_val}'",
            FilterType.NotEqual: f"strval('{sanitized_column}') != ('{sanitized_val}')",
            FilterType.Contains: f"strval('{sanitized_column}').contains('{sanitized_val}')",
            FilterType.NotContains: f"not (strval('{sanitized_column}').contains('{sanitized_val}'))",
            FilterType.StartsWith: f"strval('{sanitized_column}').startsWith('{sanitized_val}')",
            FilterType.EndsWith: f"strval('{sanitized_column}').endsWith('{sanitized_val}')",
            FilterType.Blank: f"strval('{sanitized_column}') == ''",
            FilterType.NotBlank: f"strval('{sanitized_column}') != ''",
            FilterType.LessThan: f"{sanitized_column} < {sanitized_val}",
            FilterType.LessThanOrEqual: f"{sanitized_column} <= {sanitized_val}",
            FilterType.GreaterThan: f"{sanitized_column} > {sanitized_val}",
            FilterType.GreaterThanOrEqual: f"{sanitized_column} >= {sanitized_val}",
            FilterType.InRange: f"{sanitized_val} <= {sanitized_column} <= {sanitized_to_val}", 
        }
        return filter_map.get(filter_type, f"Unknown filter type: {filter_type}")

class CustomFilter(TypedDict):
    filter_type: FilterType
    value: str

class DataikuFormula:
    def __init__(self):
        self._expressions = []

    @staticmethod
    def _create_multiple_custom_filter(column: "str", filters:list):
        combined_filter = DataikuFormula._create_custom_filter(column, filters[0])
        operator = filters[0].get('operator','and')
        for filter in filters[1:]:
            exp = DataikuFormula._create_custom_filter(column, filter)
            combined_filter = DataikuFormula._combine_filter_expressions(exp, combined_filter, operator)
        return 'and(' +combined_filter+ ')'

    @staticmethod
    def _create_custom_filter(column: "str", filter:dict):
        sanitized_column = _escape_double_quotes(column)
        filter_value = filter.get('value','')
        # filter_operator = filter.get('operator', 'and')
        try:
            filter_type = FilterType(filter.get('type'))
            filter_value_to = None
            if filter_type == FilterType.InRange:
                filter_value_to = filter.get('toValue','')
            sanitized_val = f'{_escape_double_quotes(filter_value)}'
            expression = FilterType.generate_filter_expression(filter_type, sanitized_column, sanitized_val, filter_value_to)
            return '(' +expression+')'
        except:
            raise(Exception("Unknown filter type:", filter.get('type')))
        
    @staticmethod
    def _create_filter_by_column_vals(column: "str", vals: "list[str]"):
        sanitized_column = _escape_double_quotes(column)
        sanitized_vals = [f'"{_escape_double_quotes(val)}"' for val in vals]
        expression = f'arrayContains([{", ".join(sanitized_vals)}], strval("{sanitized_column}"))'
        return expression
    
    @staticmethod
    def _combine_filter_expressions(a: str, b: str, operator: str="and"):
        return f"{operator}({a}, {b})"


    def filter_column_by_values(self, column: str, vals: Union["list[str]", dict]):
        # todo improve
        if isinstance(vals, list) and all(isinstance(val, str) for val in vals):
            col_filter = DataikuFormula._create_filter_by_column_vals(column=column, vals=vals)
        elif isinstance(vals, list) and all(isinstance(val, dict) for val in vals):
            col_filter = DataikuFormula._create_multiple_custom_filter(column=column, filters=vals)
        else:
            col_filter = DataikuFormula._create_custom_filter(column=column, filter=vals)
        self._expressions.append(col_filter)
        return self
    
    def execute(self):
        if (len(self._expressions) == 0):
            raise(Exception("No expressions added"))
        
        combined_filter = self._expressions[0];
        for expression in self._expressions[1:]:
            combined_filter = DataikuFormula._combine_filter_expressions(expression, combined_filter)
        print('combined filters:', combined_filter)
        return combined_filter