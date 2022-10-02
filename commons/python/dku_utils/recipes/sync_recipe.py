import dataikuapi


def sync_dataset_to_connection(project, recipe_input_dataset_name, connection_name):
    """
    Creates a sync recipe synchronizing a dataset toward another connection.
    DISCLAIMER: this function needs a 'DATA_SCIENTIST' profile to use the 'builder.build()' method.

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param recipe_input_dataset_name: str: Name of the dataset that we want to synchronize in another connection.
    :param connection_name: str: Name of the connection where we want to synchronize the data.
    """
    recipe_name = "compute_{}_synced".format(recipe_input_dataset_name)
    recipe_output_dataset_name = "{}_synced".format(recipe_input_dataset_name)
    project_recipe_output_dataset = project.get_dataset(recipe_output_dataset_name)
    sync_recipe_has_not_been_created = not project_recipe_output_dataset.exists()
    if sync_recipe_has_not_been_created:
        print("Recipe syncing dataset '{}' in connection '{}' does not exists and will be created ...".format(recipe_input_dataset_name, connection_name))
        print("DISCLAIMER: this function needs a 'DATA_SCIENTIST' profile to use the 'builder.build()' method.")
        builder = dataikuapi.SyncRecipeCreator(recipe_name, project)
        builder = builder.with_input(recipe_input_dataset_name)
        builder = builder.with_new_output(recipe_output_dataset_name, connection_name)
        recipe = builder.build()
        print("Recipe '{}' created!".format(recipe_name))
    else:
        print("Recipe syncing dataset '{}' in connection '{}' already exists!".format(recipe_input_dataset_name, connection_name))
    pass


def update_and_run_sync_recipe(project, recipe_name):
    """
    Updates a sync recipe so that its output schema matches its input schema. Then runs this recipe

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param recipe_name: str: Name of the sync recipe.
    """
    sync_recipe = project.get_recipe(recipe_name)
    recipe = project.get_recipe(recipe_name)
    recipe_settings = recipe.get_settings()

    recipe_input_dataset_name = recipe_settings.get_flat_input_refs()[0]
    recipe_output_dataset_name = recipe_settings.get_flat_output_refs()[0]

    recipe_input_dataset = project.get_dataset(recipe_input_dataset_name)
    recipe_input_dataset_settings = recipe_input_dataset.get_settings()
    recipe_input_dataset_schema_columns = recipe_input_dataset_settings.settings["schema"]["columns"]

    recipe_output_dataset_name = project.get_dataset(recipe_output_dataset_name)
    recipe_output_dataset_name_settings = recipe_output_dataset_name.get_settings()
    recipe_output_dataset_name_settings.settings["schema"]["columns"] = recipe_input_dataset_schema_columns
    recipe_output_dataset_name_settings.save()
    sync_recipe.run()
    pass