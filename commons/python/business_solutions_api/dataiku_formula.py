from typing import Union, Literal

def _escape_double_quotes(text: str):
    return text.replace('"', '\\"')

RangeFilterType = Literal["string", "number"]

class DataikuFormula:
    def __init__(self):
        self._expressions = []

    @staticmethod
    def _create_list_filter(sanitized_column: str, vals: "list[str]"):
        sanitized_vals = [f'"{_escape_double_quotes(val)}"' for val in vals]
        expression = f'arrayContains([{", ".join(sanitized_vals)}], strval("{sanitized_column}"))'
        return expression
    
    @staticmethod
    def _create_range_filter(sanitized_column: str, vals: dict):
        expressions = []
        from_val = vals.get('from')
        to_val = vals.get('to')
        filter_type = vals.get('type')
        isString = filter_type == 'string'
        if from_val is not None:
            from_val = _escape_double_quotes(from_val)
            from_val = f'"{from_val}"' if isString else f'{from_val}'
            expressions.append(f'({sanitized_column} >= {from_val})')
        if to_val is not None:
            to_val = _escape_double_quotes(to_val)
            to_val = f'"{to_val}"' if isString else f'{to_val}'
            expressions.append(f'({sanitized_column} <= {to_val})')
        expression = ', '.join(expressions)
        return 'and('+expression+')'
    
    @staticmethod
    def _create_filter_by_column_vals(column: str, vals: Union["list[str]", dict]):
        sanitized_column = _escape_double_quotes(column)
        if isinstance(vals, list):
            return DataikuFormula._create_list_filter(sanitized_column, vals)
        elif isinstance(vals, dict):
            return DataikuFormula._create_range_filter(sanitized_column, vals)
        return ''
    
    @staticmethod
    def _combine_filter_expressions(a: str, b: str):
        return f"and({a}, {b})"


    def filter_column_by_values(self, column: str,  vals: Union["list[str]", dict]):
        """
        vals can be either :
        - a list of strings : the filtered values in the column.
        - a dict { from: string, to: string, type: RangeFilterType} : can be used 
        to filter values inside of a range. For exp: dates, numbers
        - from: lower bound
        - to: upper bound
        - type: can be either 'string' or 'number'. 
        If not string, the Boundaries will be compared as number.
        """
        col_filter = DataikuFormula._create_filter_by_column_vals(column=column, vals=vals)
        self._expressions.append(col_filter)
        return self
    
    def execute(self):
        if (len(self._expressions) == 0):
            raise(Exception("No expressions added"))
        
        combined_filter = self._expressions[0]
        for expression in self._expressions[1:]:
            combined_filter = DataikuFormula._combine_filter_expressions(expression, combined_filter)
        return combined_filter