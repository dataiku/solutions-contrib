def compute_prepare_rename_step(column_to_rename, new_column_name):
    """
    Computes the JSON associated with a prepare 'rename' step.

    :param column_to_rename: str: Name of the column to rename.
    :param new_column_name: str: New name the column to rename should have. 
    
    :returns: rename_step: dict: JSON of the prepare 'rename' step.
    """
    rename_step = {"preview": False,
                   "metaType": "PROCESSOR",
                   "disabled": False,
                   "type": "ColumnRenamer",
                   "params": {"renamings": [
                       {"from": "{}".format(column_to_rename),
                        "to": "{}".format(new_column_name)}]},
                   "alwaysShowComment": False}
    return rename_step


def compute_prepare_formula_step(column_name, formula_expression):
    """
    Computes the JSON associated with a column applying a prepare recipe formula.

    :param column_to_rename: str: Name of the column to generate.
    :param formula_expression: str: Expression of the formula leading to the computed column, following the 
        DSS formula language (https://doc.dataiku.com/dss/latest/formula/index.html).
    
    :returns: formula_step: dict: JSON of the prepare 'formula' step.
    """
    formula_step = {'preview': False,
                    'metaType': 'PROCESSOR',
                    'disabled': False,
                    'type': 'CreateColumnWithGREL',
                    'params': {
                        'expression': formula_expression,
                        'column': column_name
                        },
                    'alwaysShowComment': False}
    return formula_step


def compute_prepare_keep_or_delete_step(columns_of_interest, bool_keep_columns):
    """
    Computes the JSON associated with a keep/delete prepare recipe step.

    :param columns_of_interest: list: Name of the column to generate.
    :param bool_keep_columns: bool: Parameter precising if the columns mentioned in 
        'columns_of_interest' should be kept (if it is equal to 'True')
        or deleted (if it is equal to 'False').
    
    :returns: formula_step: dict: JSON of the prepare 'keep/delete' step.
    """
    formula_step = {'preview': False,
                    'metaType': 'PROCESSOR',
                    'disabled': False,
                    'type': 'ColumnsSelector',
                    'params': {'columns': columns_of_interest,
                     'keep': bool_keep_columns,
                     'appliesTo': 'COLUMNS'},
                    'alwaysShowComment': False}

    return formula_step
