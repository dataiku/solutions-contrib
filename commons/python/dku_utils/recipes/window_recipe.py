from .recipe_commons import (get_recipe_input_datasets,
                             get_recipe_settings_and_dictionary)
from ..datasets.dataset_commons import (get_dataset_schema,
                                        extract_dataset_schema_information)

def define_window_recipe_aggregations(project, recipe_name, column_aggregations_mapping):
    """
    Updates the aggregations set in a window recipe.

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param recipe_name: str: Name of the recipe.
    :param column_aggregations_mapping: dict: Mapping between the columns and the list of aggregations to apply to each one.
        - Example: {'column_1': ['value', 'min', 'max'], 'column_2': ['value', 'avg', 'sum']} 
        - NOTE: use the aggregation 'value', from WINDOW_POSSIBLE_AGGREGATIONS if you want the column value to be retrieved.
            <-> Equivalent of the 'Retrieve' in the visual recipe.
        - NOTE: All columns not present in column_aggregations_mapping.keys() will:
            - Have their aggregations disabled. 
            - Not have their values retrieved --> set at least the aggregation 'column_xyz': ['value']
                if you want to keep the column 'column_xyz' values.
    """
    WINDOW_POSSIBLE_AGGREGATIONS = ["last", "lagDiff", "max", "column", "count", "$idx", "sum",
                              "concat", "type",  "lead", "concatDistinct",  "min", "avg",
                              "lag", "$selected", "stddev", "value", "leadDiff", "first"]
    WINDOW_DEFAULT_AGGREGATIONS = ["column", "$idx", "type"]
    WINDOW_AGGREGATIONS_TO_CHANGE = [aggregation for aggregation in WINDOW_POSSIBLE_AGGREGATIONS
                                     if aggregation not in WINDOW_DEFAULT_AGGREGATIONS]
    
    recipe_settings, __ = get_recipe_settings_and_dictionary(project, recipe_name, False)
    recipe_payload = recipe_settings.get_json_payload()
    recipe_input_dataset_name = get_recipe_input_datasets(project, recipe_name)[0]
    recipe_input_dataset_schema = get_dataset_schema(project, recipe_input_dataset_name)
    recipe_input_columns, recipe_input_column_datatypes = extract_dataset_schema_information(recipe_input_dataset_schema)
    column_indexes = range(len(recipe_input_columns))
    column_with_aggregations = column_aggregations_mapping.keys()
    window_new_aggregations = []
    for column_index, column_name, column_datatype in zip(column_indexes, recipe_input_columns, recipe_input_column_datatypes):
        column_aggregation_settings = {
            "column": column_name,
            "$idx": column_index,
            "type": column_datatype
        }
        if column_name in column_with_aggregations:
            column_aggregations_to_enable = column_aggregations_mapping[column_name]
            for aggregation in WINDOW_AGGREGATIONS_TO_CHANGE:
                if aggregation in column_aggregations_to_enable:
                    column_aggregation_settings[aggregation] = True
                else:
                    column_aggregation_settings[aggregation] = False
        else:
            for aggregation in WINDOW_AGGREGATIONS_TO_CHANGE:
                column_aggregation_settings[aggregation] = False            
        window_new_aggregations.append(column_aggregation_settings)
    
    recipe_payload["values"] = window_new_aggregations
    recipe_settings.set_json_payload(recipe_payload)
    recipe_settings.save()
    print("Window recipe '{}' successfully updated !".format(recipe_name))
    pass


def generate_window_recipe_orders(column_names, columns_bool_descending_mapping):
    """
    Computes the order payload part of a single window recipe's window.

    :param column_names: list: List of columns.
        Example: ['column_1', 'column_2', 'column_3']
    :param columns_bool_descending_mapping: list: List of boolean indicating if each column
        present in 'column_names' should be ordered descending  or not.
        Example: [True, False, True]

    :returns: window_orders: list: List containing window orders 
    """
    window_orders = []
    for column_name, bool_descending_mapping in zip(column_names, columns_bool_descending_mapping):
        window_orders.append({'column': column_name, 'desc': bool_descending_mapping})
    return window_orders


def set_window_orders(project, recipe_name, column_names, columns_bool_descending_mapping, window_id=0):
    """
    Updates the order section of a single window recipe's window.

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param recipe_name: str: Name of the recipe.
    :param column_names: list: List of columns.
        Example: ['column_1', 'column_2', 'column_3']
    :param columns_bool_descending_mapping: list: List of boolean indicating if each column
        present in 'column_names' should be ordered descending  or not.
        Example: [True, False, True]
    """
    recipe_settings, __ = get_recipe_settings_and_dictionary(project, recipe_name, False)
    recipe_payload = recipe_settings.get_json_payload()
    window_orders = generate_window_recipe_orders(column_names, columns_bool_descending_mapping)
    recipe_payload["windows"][window_id]["orders"] = window_orders
    recipe_settings.set_json_payload(recipe_payload)
    recipe_settings.save()
    pass
