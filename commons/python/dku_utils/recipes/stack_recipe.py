import dataikuapi
from ..datasets.dataset_commons import create_dataset_in_connection
from ..recipes.recipe_commons import get_recipe_settings_and_dictionary


def instantiate_stack_recipe(project, recipe_name, recipe_input_datasets,
                             recipe_output_dataset_name, connection_name):
    """
    Instantiates a stack recipe in the flow.

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param recipe_name: str: Name of the recipe.
    :param recipe_input_datasets: list: List containing all recipe input dataset names. 
    :param recipe_output_dataset_name: str: Name of the dataset that must be the recipe output.
    :param :connection_name: str: Name of the recipe output dataset connection.
    """
    print("Creating stack recipe '{}' ...".format(recipe_name))
    builder = dataikuapi.StackRecipeCreator(recipe_name, project)
    for dataset_name in recipe_input_datasets:
        builder.with_input(dataset_name)
        pass    
    create_dataset_in_connection(project, recipe_output_dataset_name, connection_name)
    builder.with_output(recipe_output_dataset_name)
    builder.build()
    print("Stack recipe '{}' sucessfully created!".format(recipe_name))
    pass


def set_stack_recipe_origin_column(project, recipe_name, origin_column_name,
                                   sorted_labels_for_origin_column):
    """
    Configures the 'Origin column' section of a stack recipe.

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param recipe_name: str: Name of the recipe.
    :param origin_column_name: str: Name of the origin column flagging each row datasource origin.
    :param sorted_labels_for_origin_column: list: List containing the labels to associate rows coming from
        each dataset. Labels should be in the same order as the recipe's input they refer to.
    """
    recipe = project.get_recipe(recipe_name)
    recipe_settings, __ = get_recipe_settings_and_dictionary(project, recipe_name, False)
    recipe_json_payload = recipe_settings.get_json_payload()
    recipe_json_payload["addOriginColumn"] = True
    recipe_json_payload["originColumnName"] = origin_column_name
    
    recipe_new_virtual_inputs = []
    loop_indexes = range(len(sorted_labels_for_origin_column))
    for loop_index, origin_column_label in zip(loop_indexes, sorted_labels_for_origin_column):
        recipe_virtual_input = {'preFilter': {'distinct': False, 'enabled': False},
                                'originLabel': origin_column_label,
                                'index': loop_index}
        recipe_new_virtual_inputs.append(recipe_virtual_input)
    
    recipe_json_payload["virtualInputs"] = recipe_new_virtual_inputs
    recipe_settings.set_json_payload(recipe_json_payload)
    recipe_settings.save()
    recipe.compute_schema_updates()
    pass
