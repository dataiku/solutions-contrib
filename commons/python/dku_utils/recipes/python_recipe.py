import pandas as pd
from .recipe_commons import get_recipe_settings_and_dictionary
from ..python_utils.python_scripts import load_python_string_imports_dataframe


def set_python_recipe_inputs(project, recipe_name, recipe_inputs):
    """
    Sets the inputs of a python recipe. 
    
    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param recipe_name: str: Name of the recipe.
    :param recipe_inputs: list: List containing all recipe inputs.
    """
    print("Setting datasets '{}' as python recipe '{}' inputs ...".format(recipe_inputs, recipe_name))
    recipe_settings, recipe_settings_dict = get_recipe_settings_and_dictionary(project, recipe_name, True)
    new_python_recipe_input_settings = []
    for dataset_name in recipe_inputs:
        new_python_recipe_input_settings.append({'ref': dataset_name, 'deps': []})
    recipe_settings_dict["inputs"]["main"]["items"] = new_python_recipe_input_settings
    recipe_settings.recipe_settings = recipe_settings_dict
    recipe_settings.save()
    print("Python recipe '{}' inputs successfully set!".format(recipe_inputs, recipe_name))
    pass



def set_python_recipe_outputs(project, recipe_name, recipe_outputs):
    """
    Sets the outputs of a python recipe. 
    
    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param recipe_name: str: Name of the recipe.
    :param recipe_outputs: list: List containing all recipe output dataset names.
    """
    print("Setting datasets '{}' as python recipe '{}' outputs ...".format(recipe_outputs, recipe_name))
    recipe_settings, recipe_settings_dict = get_recipe_settings_and_dictionary(project, recipe_name, True)
    new_python_recipe_output_settings = []
    for dataset_name in recipe_outputs:
        new_python_recipe_output_settings.append({'ref': dataset_name, 'deps': []})
    recipe_settings_dict["outputs"]["main"]["items"] = new_python_recipe_output_settings
    recipe_settings.recipe_settings = recipe_settings_dict
    recipe_settings.save()
    print("Python recipe '{}' outputs successfully set!".format(recipe_outputs, recipe_name))
    pass


def get_python_recipe_python_dependencies_dataframe(project, recipe_name):
    """
    Retrieves a DataFrame containing all python modules dependencies for a project's recipe.
        DISCLAIMER: Does not retrieves import done within functions.
    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param recipe_name: str: Name of the recipe.
    :returns: python_dependencies_dataframe: pandas.core.frame.DataFrame: Pandas DataFrame
        containing information about all the imports done in the scenario python scripts.
    """
    print("Retrieving recipe '{}.{}' python dependencies ...".format(project.project_key, recipe_name))
    PYTHON_DEPENDENCIES_SCHEMA = ["recipe_name", "imported_from",
                                  "imported", "all_import_information"]
    recipe_settings, __ = get_recipe_settings_and_dictionary(project, recipe_name, False)
    recipe_python_script = recipe_settings.data["payload"]
    python_dependencies_dataframe = load_python_string_imports_dataframe(recipe_python_script)
    python_dependencies_dataframe["recipe_name"] = recipe_name

    if len(python_dependencies_dataframe) == 0:
        python_dependencies_dataframe = pd.DataFrame(columns=PYTHON_DEPENDENCIES_SCHEMA)
    else: 
        python_dependencies_dataframe = python_dependencies_dataframe[PYTHON_DEPENDENCIES_SCHEMA]
    print("Recipe '{}.{}' python dependencies successfully retrieved!".format(project.project_key, recipe_name))
    return python_dependencies_dataframe
