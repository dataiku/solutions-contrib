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
    Generates a column applying a prepare recipe formula.

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
