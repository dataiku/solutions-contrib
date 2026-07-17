"""Module for wrapping and assembling DSS formulas."""

import logging
from typing import Union

from webaiku.errors import WebaikuError

from .filters import CustomFilter, FilterType, RangeFilter

logger = logging.getLogger("webaiku")


def _escape_double_quotes(text: str) -> str:
    """Escape double quotes so a value can be embedded in a DSS formula."""
    return text.replace('"', '\\"')


class DataikuFormula:
    """Builder that assembles a DSS filter formula from column filters.

    Filters are accumulated via the ``filter_column_by_*`` methods and joined
    into a single boolean formula string by :meth:`execute`.
    """

    def __init__(self) -> None:
        """Initialize an empty formula with no expressions."""
        self._expressions: list[str] = []

    @staticmethod
    def _create_multiple_custom_filter(
        column: str,
        filters: list[CustomFilter],
    ) -> str:
        """Combine several custom filters on one column into an ``and(...)``.

        Adjacent filters are joined using the ``operator`` of the first filter.
        """
        combined_filter = DataikuFormula._create_custom_filter(column, filters[0])
        operator = filters[0].get("operator", "and")
        for filter in filters[1:]:
            exp = DataikuFormula._create_custom_filter(column, filter)
            combined_filter = DataikuFormula._combine_filter_expressions(
                exp,
                combined_filter,
                operator,
            )
        return "and(" + combined_filter + ")"

    @staticmethod
    def _create_custom_filter(column: str, filter: CustomFilter) -> str:
        """Build a parenthesized expression for a single custom filter.

        Raises:
            WebaikuError: If the filter's ``filterType`` is not recognized.

        """
        sanitized_column = _escape_double_quotes(column)
        filter_value = filter.get("value", "")
        try:
            filter_type = FilterType(filter.get("filterType"))
            filter_to_value = None
            value_type = None
            if filter_type == FilterType.InRange:
                filter_to_value = filter.get("toValue", "")
                filter_to_value = f"{_escape_double_quotes(filter_to_value)}"
                value_type = filter.get("valueType", "")
            sanitized_val = f"{_escape_double_quotes(filter_value)}"
            expression = FilterType.generate_filter_expression(
                filter_type,
                sanitized_column,
                sanitized_val,
                filter_to_value,
                value_type,
            )
            return "(" + expression + ")"
        except:
            raise (WebaikuError("Unknown filter type:", filter.get("filterType")))

    @staticmethod
    def _create_list_filter(sanitized_column: str, vals: list[str]) -> str:
        """Build an ``arrayContains(...)`` expression matching any of ``vals``."""
        sanitized_vals = [f'"{_escape_double_quotes(val)}"' for val in vals]
        expression = f'arrayContains([{", ".join(sanitized_vals)}], strval("{sanitized_column}"))'
        return expression

    @staticmethod
    def _combine_filter_expressions(a: str, b: str, operator: str = "and") -> str:
        """Join two expressions with a boolean operator (default ``and``)."""
        return f"{operator}({a}, {b})"

    @staticmethod
    def _create_range_filter(sanitized_column: str, filter: RangeFilter) -> str:
        """Build a range expression from a :class:`RangeFilter`'s bounds."""
        from_val = filter.get("value", "")
        from_val = _escape_double_quotes(from_val)
        to_val = filter.get("toValue", "")
        to_val = _escape_double_quotes(to_val)
        isString = filter.get("valueType", "") == "string"
        return FilterType._create_range_filter_from_values(
            sanitized_column,
            from_val,
            to_val,
            isString,
        )

    @staticmethod
    def _create_filter_by_column_vals(
        column: str,
        vals: Union[list[str], RangeFilter],
    ) -> str:
        """Dispatch to a list or range expression based on ``vals``' shape.

        Returns an empty string when ``vals`` is neither a list nor a range
        filter.
        """
        sanitized_column = _escape_double_quotes(column)
        if isinstance(vals, list):
            return DataikuFormula._create_list_filter(sanitized_column, vals)
        if vals.get("filterType", "") == "inRange":
            return DataikuFormula._create_range_filter(sanitized_column, vals)
        return ""

    def filter_column_by_values(
        self,
        column: str,
        vals: Union[list[str], RangeFilter],
    ) -> "DataikuFormula":
        """Filter column by specified values.

        Vals can be either :
        - a list of strings : the filtered values in the column.
        - a RangeFilter { value: string, toValue: string, valueType: 'str'|'number'}:
        can be used to filter values inside of a range. For exp: dates, numbers
        - value: lower bound
        - toValue: upper bound
        - valueType: can be either 'str' or 'number'.
        If not string, the Boundaries will be compared as number.

        Returns:
            ``self``, to allow chaining filter calls.

        """
        col_filter = DataikuFormula._create_filter_by_column_vals(
            column=column,
            vals=vals,
        )
        self._expressions.append(col_filter)
        return self

    def filter_column_by_custom_filters(
        self,
        column: str,
        vals: Union[list[CustomFilter], CustomFilter],
    ) -> "DataikuFormula":
        """Add one or more custom (operator-based) filters on a column.

        Args:
            column: The column to filter.
            vals: A single :class:`CustomFilter` or a list of them; a list is
                combined into a single ``and(...)`` expression.

        Returns:
            ``self``, to allow chaining filter calls.

        """
        if isinstance(vals, list):
            col_filter = DataikuFormula._create_multiple_custom_filter(
                column=column,
                filters=vals,
            )
        else:
            col_filter = DataikuFormula._create_custom_filter(
                column=column,
                filter=vals,
            )
        self._expressions.append(col_filter)
        return self

    def execute(self) -> str:
        """Combine all accumulated expressions into a single DSS formula.

        Returns:
            The combined boolean formula string.

        Raises:
            WebaikuError: If no expressions have been added.

        """
        if len(self._expressions) == 0:
            raise (WebaikuError("No expressions added"))

        combined_filter = self._expressions[0]
        for expression in self._expressions[1:]:
            combined_filter = DataikuFormula._combine_filter_expressions(
                expression,
                combined_filter,
            )
        logger.info("combined filters:", combined_filter)
        return combined_filter
