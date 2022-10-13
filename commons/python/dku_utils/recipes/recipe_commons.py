def get_recipe_settings_and_dictionary(project, recipe_name, bool_get_settings_dictionary):
    """
    Retrieves the settings of a project recipe

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param recipe_name: str: Name of the recipe.
    :param bool_get_settings_dictionary: bool: Precise if you to rerieve the recipe settings dictionary.

    :returns: recipe_settings: dataikuapi.dss.recipe.[RecipeType]Settings: Settings for a recipe. 
    :returns: recipe_settings_dict: dict: Dictionary containing recipe settings.
    """
    recipe = project.get_recipe(recipe_name)
    recipe_settings = recipe.get_settings()

    if bool_get_settings_dictionary:
        recipe_settings_dict = recipe_settings.recipe_settings
    else:
        recipe_settings_dict = None

    return recipe_settings, recipe_settings_dict


def switch_recipe_engine(project, recipe_name, new_engine):
    """
    Switches the engine of a project recipe.
    
    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param recipe_name: str: Name of the recipe.
    :param new_engine: str: Name of the recipe engine.
    """
    recipe = project.get_recipe(recipe_name)
    recipe_settings = recipe.get_settings()
    recipe_type = recipe_settings.type
    print("Switching recipe '{}' engine: recipe_type : '{}'".format(recipe_name, recipe_type))
    
    if recipe_type in ["prepare", "shaker", "sampling"]:
        recipe_settings.get_recipe_params()["engineType"] = new_engine
        
    elif recipe_type == "split":
        recipe_settings.obj_payload["engineType"] = new_engine
   
    else:
        recipe_settings.get_json_payload()["engineType"] = new_engine
    recipe_settings.save()
    pass


def update_recipe_ouput_schema(project, recipe_name):
    """
    Updates the recipe's output dataset schema based on its settings and payload.

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param recipe_name: str: Name of the recipe.
    """
    recipe = project.get_recipe(recipe_name)
    required_updates = recipe.compute_schema_updates()
    if required_updates.any_action_required():
        required_updates.apply()
        pass
    pass


def get_recipe_available_engines(project, recipe_name):
    """
    Retrieves the recipe's available engines.

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param recipe_name: str: Name of the recipe.

    :returns: available_engines: list: List of the recipe's available engines.
    """
    available_engines = []
    recipe = project.get_recipe(recipe_name)
    recipe_status = recipe.get_status()
    recipe_engine_details = recipe_status.get_engines_details()
    available_engines = [entity["type"] for entity in recipe_engine_details if (entity["isSelectable"] == True)]
    if len(available_engines) == 0:
        available_engines.append("DSS")
    return available_engines


def get_recipe_output_datasets(project, recipe_name):
    """
    Retrieves the recipe's outout datasets.

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param recipe_name: str: Name of the recipe.

    :returns: recipe_output_datasets: list: List of the recipe's output datasets.
    """
    recipe_settings, __ = get_recipe_settings_and_dictionary(project, recipe_name, False)
    recipe_output_items = recipe_settings.get_recipe_outputs()["main"]["items"]
    recipe_output_datasets = [item["ref"] for item in recipe_output_items]
    return recipe_output_datasets


def get_recipe_input_datasets(project, recipe_name):
    """
    Retrieves the recipe's input datasets.

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param recipe_name: str: Name of the recipe.

    :returns: recipe_input_datasets: list: List of the recipe's input datasets.
    """
    recipe_settings, __ = get_recipe_settings_and_dictionary(project, recipe_name, False)
    recipe_input_items = recipe_settings.get_recipe_inputs()["main"]["items"]
    recipe_input_datasets = [item["ref"] for item in recipe_input_items]
    return recipe_input_datasets
