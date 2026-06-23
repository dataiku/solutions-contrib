"""Module for wrapping filters in DSS API."""

from enum import Enum
from typing import Optional, Union

try:
    from typing import Literal, TypedDict
except ImportError:
    from typing_extensions import Literal, TypedDict


class FilterType(str, Enum):
    """Supported column filter operators (mirrors the frontend grid filters)."""

    Equals = "equals"
    NotEqual = "notEqual"
    Contains = "contains"
    NotContains = "notContains"
    StartsWith = "startsWith"
    EndsWith = "endsWith"
    Blank = "blank"
    NotBlank = "notBlank"
    LessThan = "lessThan"
    LessThanOrEqual = "lessThanOrEqual"
    GreaterThan = "greaterThan"
    GreaterThanOrEqual = "greaterThanOrEqual"
    InRange = "inRange"

    @staticmethod
    def generate_filter_expression(
        filter_type: "FilterType",
        sanitized_column: str,
        sanitized_val: str,
        sanitized_to_val: Optional[str] = None,
        value_type: Optional[str] = None,
    ) -> str:
        """Build the DSS formula fragment for a single column filter.

        Args:
            filter_type: The operator to apply.
            sanitized_column: The (escaped) column name.
            sanitized_val: The (escaped) comparison value.
            sanitized_to_val: The (escaped) upper-bound value, used only by
                ``InRange``.
            value_type: The value's type (e.g. ``"string"``), used only by
                ``InRange`` to decide between string and numeric comparison.

        Returns:
            The DSS formula expression as a string. If ``filter_type`` is not a
            recognized :class:`FilterType` an ``"Unknown filter type: ..."``
            message string is returned instead.

        """
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
            FilterType.InRange: FilterType._create_range_filter_from_values(
                sanitized_column,
                sanitized_val,
                sanitized_to_val,
                value_type == "string",
            ),
        }
        return filter_map[filter_type]

    @staticmethod
    def _create_range_filter_from_values(
        sanitized_column: str,
        sanitized_val: str,
        sanitized_to_val: str,
        isString: bool,
    ) -> str:
        """Build an ``and(...)`` range expression from lower/upper bounds.

        Args:
            sanitized_column: The (escaped) column name.
            sanitized_val: The (escaped) lower bound; omitted when falsy.
            sanitized_to_val: The (escaped) upper bound; omitted when falsy.
            isString: Whether the bounds should be quoted as strings rather than
                compared numerically.

        Returns:
            A DSS ``and(...)`` formula combining the present bounds.

        """
        expressions = []
        if sanitized_val:
            from_val = f'"{sanitized_val}"' if isString else f"{sanitized_val}"
            expressions.append(f"({sanitized_column} >= {from_val})")
        if sanitized_to_val:
            to_val = f'"{sanitized_to_val}"' if isString else f"{sanitized_to_val}"
            expressions.append(f"({sanitized_column} <= {to_val})")
        expression = ", ".join(expressions)
        return "and(" + expression + ")"


#: Boolean operator used to combine adjacent filters, or ``None`` for the last.
OperatorType = Union[Literal["and", "or"], None]


class CustomFilter(TypedDict):
    """A single column filter as sent by the frontend grid.

    Attributes:
        filterType: The operator to apply.
        value: The comparison value (lower bound for ranges).
        toValue: The upper bound, used only by range filters; ``None`` otherwise.
        operator: How to combine this filter with the next one in a list.

    """

    filterType: FilterType
    value: str
    toValue: Union[None, str]
    operator: OperatorType


class RangeFilter(CustomFilter, TypedDict):
    """A :class:`CustomFilter` specialized for ``InRange`` (two-bound) filters.

    Attributes:
        filterType: Always :attr:`FilterType.InRange`.
        toValue: The upper bound of the range; ``None`` when open-ended.
        valueType: Whether the bounds are compared as ``"string"`` or
            ``"number"``.

    """

    filterType: Literal[FilterType.InRange]
    toValue: Union[None, str]
    valueType: Literal["string", "number"]
