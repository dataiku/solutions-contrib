import dataikuapi
from ..datasets.dataset_commons import create_dataset_in_connection


def instantiate_stack_recipe(project, recipe_name, recipe_input_datasets,
                             recipe_output_dataset_name, connection_name):
    """
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
