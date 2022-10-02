from .recipe_commons import get_recipe_settings_and_dictionary


def change_python_recipe_input_datasets(project, recipe_name, new_input_datasets):
    """
    Updates the datasets a python recipe uses as inputs.

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param recipe_name: str: Name of the recipe.
    :param new_input_datasets: list: List of the project dataset names the python recipe should use as inputs.
    """
    print("Updating python recipe '{}' inputs ... Its new inputs will be :'{}'".format(recipe_name, new_input_datasets))
    recipe_settings, __ = get_recipe_settings_and_dictionary(project, recipe_name, False)
    recipe_inputs_parameters = []
    for dataset_name in new_input_datasets:
        recipe_inputs_parameters.append({'ref': dataset_name, 'deps': []})
    recipe_settings.get_recipe_raw_definition()["inputs"]["main"]["items"] = recipe_inputs_parameters
    recipe_settings.save()
    print("Recipe '{}' inputs updated !".format(recipe_name))
    pass