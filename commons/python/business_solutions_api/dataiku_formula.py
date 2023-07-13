from typing import Union

def _escape_double_quotes(text: str):
    return text.replace('"', '\\"')



class DataikuFormula:
    def __init__(self):
        self._expressions = []

    @staticmethod
    def _create_filter_by_column_vals(column: str, vals: Union["list[str]", dict]):
        sanitized_column = _escape_double_quotes(column)
        expressions = []
        expression = ''
        if isinstance(vals, list):
            sanitized_column = _escape_double_quotes(column)
            sanitized_vals = [f'"{_escape_double_quotes(val)}"' for val in vals]
            expression = f'arrayContains([{", ".join(sanitized_vals)}], strval("{sanitized_column}"))'
        elif isinstance(vals, dict):
            from_val = vals.get('from')
            to_val = vals.get('to')
            type = vals.get('type')
            if from_val is not None:
                from_val = f'"{_escape_double_quotes(from_val)}"' if type == 'string' else f'{_escape_double_quotes(from_val)}'
                expressions.append(f'({sanitized_column} >= {from_val})')
            if to_val is not None:
                to_val = f'"{_escape_double_quotes(to_val)}"' if type == 'string' else f'{_escape_double_quotes(to_val)}'
                expressions.append(f'({sanitized_column} <= {to_val})')
            expression = ' , '.join(expressions)
        return expression
    
    @staticmethod
    def _combine_filter_expressions(a: str, b: str):
        return f"and({a}, {b})"


    def filter_column_by_values(self, column: str,  vals: Union["list[str]", dict]):
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