import pandas as pd
from ..scenarios.scenario_commons import get_scenario_python_dependencies_dataframe
from ..recipes.python_recipe import get_python_recipe_python_dependencies_dataframe


def get_all_flow_dataset_names(project):
    """
    Retrieves all project dataset names. 

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.

    :returns: project_dataset_names: list: List of all project dataset names.
    """
    flow_datasets = project.list_datasets()
    project_dataset_names = [dataset_information["name"] for dataset_information in flow_datasets]
    return project_dataset_names


def get_flow_input_dataset_names(project):
    """
    Retrieves all project input dataset names. 

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.

    :returns: project_dataset_names: list: List of all project input dataset names.
    """
    flow = project.get_flow()
    flow_graph = flow.get_graph()
    flow_inputs = flow_graph.get_source_datasets()
    project_input_dataset_names = [dataiku_dataset.name for dataiku_dataset in flow_inputs]
    return project_input_dataset_names


def get_all_flow_recipe_names(project):
    """
    Retrieves all project recipe names.
    
    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    
    :returns: project_recipe_names: list: List of all project recipe names.
    """
    flow_recipes = project.list_recipes()
    project_recipe_names = [recipe_information["name"] for recipe_information in flow_recipes]
    return project_recipe_names


def get_all_flow_folder_names(project):
    """
    Retrieves all project folder names. 

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.

    :returns: project_folder_names: list: List of all project folder names.
    """
    project_folders_data = project.list_managed_folders()
    project_folder_names = [folder_information["name"] for folder_information in project_folders_data]
    return project_folder_names


def move_dataset_in_flow_zone(project, dataset_name, flow_zone_name):
    """
    Moves a project dataset in a flow zone. 

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param dataset_name: string: Name of the dataset.
    :param flow_zone_name: string: Name of the flow zone.
    """
    flow_zone_exists = check_if_flow_zone_exists(project, flow_zone_name)
    if flow_zone_exists:
        flow_zone_id = get_flow_zone_id(project, flow_zone_name)
        project_dataset = project.get_dataset(dataset_name)
        project_dataset.move_to_zone(flow_zone_id)
        print("Dataset '{}' successfully moved in flow zone '{}'!".format(dataset_name, flow_zone_name))
        pass
    pass


def share_dataset_in_flow_zone(project, dataset_name, flow_zone_name):
    """
    Shares a project dataset in a flow zone. 

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param dataset_name: string: Name of the dataset.
    :param flow_zone_name: string: Name of the flow zone.
    """
    flow_zone_exists = check_if_flow_zone_exists(project, flow_zone_name)
    if flow_zone_exists:
        flow_zone_id = get_flow_zone_id(project, flow_zone_name)
        project_dataset = project.get_dataset(dataset_name)
        project_dataset.share_to_zone(flow_zone_id)
        print("Dataset '{}' successfully shared with flow zone '{}'!".format(dataset_name, flow_zone_name))
        pass
    pass


def unshare_dataset_from_flow_zone(project, dataset_name, flow_zone_name):
    """
    Unshares a project dataset from a flow zone. 

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param dataset_name: string: Name of the dataset.
    :param flow_zone_name: string: Name of the flow zone.
    """
    flow_zone_exists = check_if_flow_zone_exists(project, flow_zone_name)
    if flow_zone_exists:
        flow_zone_id = get_flow_zone_id(project, flow_zone_name)
        project_dataset = project.get_dataset(dataset_name)
        project_dataset.unshare_from_zone(flow_zone_id)
        print("Dataset '{}' successfully unshared from flow zone '{}'!".format(dataset_name, flow_zone_name))
        pass
    pass


def move_recipe_in_flow_zone(project, recipe_name, flow_zone_name):
    """
    Moves a project recipe in a flow zone. 
    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param recipe_name: string: Name of the recipe.
    :param flow_zone_name: string: Name of the flow zone.
    """
    flow_zone_exists = check_if_flow_zone_exists(project, flow_zone_name)
    if flow_zone_exists:
        flow_zone_id = get_flow_zone_id(project, flow_zone_name)
        project_recipe = project.get_recipe(recipe_name)
        project_recipe.move_to_zone(flow_zone_id)
        print("Recipe '{}' successfully moved in flow zone '{}'!".format(recipe_name, flow_zone_name))
        pass
    pass


def check_if_flow_zone_exists(project, flow_zone_name):
    """
    Checks whether a flow zone exists or not. 

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param flow_zone_name: string: Name of the flow zone.

    :returns: flow_zone_exists: bool: Boolean indicating if the flow zone exists or not.
    """
    flow = project.get_flow()
    print("Checking if flow zone '{}' exists ...".format(flow_zone_name))
    try:
        flow_zone_id = get_flow_zone_id(project, flow_zone_name)
        flow.get_zone(flow_zone_id)
        flow_zone_exists = True
        print("Flow zone '{}' exists".format(flow_zone_name))
        pass
    except:
        print("Flow zone '{}' does not exist".format(flow_zone_name))
        flow_zone_exists = False
        pass
    return flow_zone_exists


def drop_flow_zone_if_exists(project, flow_zone_name):
    """
    Drops a project flow zone if it exists. 

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param flow_zone_name: string: Name of the flow zone.
    """
    flow_zone_exists = check_if_flow_zone_exists(project, flow_zone_name)
    if flow_zone_exists:
        flow = project.get_flow()
        flow_zone_id = get_flow_zone_id(project, flow_zone_name)
        flow_zone = flow.get_zone(flow_zone_id)
        print("Dropping flow zone '{}'...".format(flow_zone_name))
        flow_zone.delete()
        print("Flow zone '{}' Deleted !".format(flow_zone_name))
        pass
    pass


def create_flow_zone_if_not_exists(project, flow_zone_name, flow_zone_color):
    """
    Creates a project flow zone if it does not exists. 

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param flow_zone_name: string: Name of the flow zone.
    :param flow_zone_color: string: Flow zone hexadecimal color code.
    """
    if flow_zone_color in ["", None]:
        flow_zone_color = "#C82423"
        pass
    flow_zone_exists = check_if_flow_zone_exists(project, flow_zone_name)
    if not flow_zone_exists:
        flow = project.get_flow()
        print("Creating flow zone '{}'...".format(flow_zone_name))
        flow.create_zone(flow_zone_name, color=flow_zone_color)
        flow_zone_id = get_flow_zone_id(project, flow_zone_name)
        print("Flow zone '{}' created with id '{}' !".format(flow_zone_name, flow_zone_id))
        pass
    pass


def get_flow_zone_id(project, flow_zone_name):
    """
    Retrieves the id associated with a project flow zone . 

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param flow_zone_name: str: Name of the flow zone.

    :returns: flow_zone_id: str: The ID associated with 'flow_zone_name'.
    """
    flow = project.get_flow()
    flow_zones_data = flow.list_zones()
    flow_zone_id = None
    for flow_zone_data in flow_zones_data:
        if flow_zone_data.name == flow_zone_name:
            flow_zone_id = flow_zone_data.id
            pass
        pass
    if flow_zone_id == None:
        log_message = "Flow zone '{}' does not exist! "\
            "Please use the computed 'flow_zones_data' to use a valid flow zone name."\
            "flow_zones_data = '{}'".format(flow_zone_name, flow_zones_data)
        raise Exception(log_message)
    return flow_zone_id


def get_all_flow_scenarios_ids(project):
    """
    Retrieves all the scenarios IDs defined in a project.
    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :returns: all_project_scenarios_ids: list: List of all scenarios IDs defined in the project.
    """
    print("Retrieving all project '{}' scenario IDs...".format(project.project_key))
    project_scenarios_information = project.list_scenarios()
    all_project_scenarios_ids = [scenario_information["id"] for scenario_information in project_scenarios_information]
    print("All project '{}' scenario IDs successfully retrieved!".format(project.project_key))
    return all_project_scenarios_ids


def get_all_flow_scenarios_python_dependencies_dataframe(project):
    """
    Retrieves a DataFrame containing all python modules dependencies for a all project's scenarios.
        DISCLAIMER: Does not retrieves import done within functions.
    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :returns: all_flow_scenarios_python_dependencies_dataframe: pandas.core.frame.DataFrame: Pandas DataFrame
        containing information about all the imports done in all the scenario python scripts.
    """
    print("Retrieving project '{}' all 'scenarios' python dependencies ...".format(project.project_key))
    PYTHON_DEPENDENCIES_SCHEMA = ["scenario_id", "scenario_step_index", "imported_from",
                                            "imported", "all_import_information"]
    all_flow_scenarios_ids = get_all_flow_scenarios_ids(project)
    all_flow_scenarios_python_dependencies = []
    for scenario_id in all_flow_scenarios_ids:
        scenario_python_dependencies_dataframe = get_scenario_python_dependencies_dataframe(project, scenario_id)
        all_flow_scenarios_python_dependencies.append(scenario_python_dependencies_dataframe)
    
    if len(all_flow_scenarios_python_dependencies) > 0:
        all_flow_scenarios_python_dependencies_dataframe = pd.concat(all_flow_scenarios_python_dependencies).reset_index()
    else:
        all_flow_scenarios_python_dependencies_dataframe = pd.DataFrame(columns=PYTHON_DEPENDENCIES_SCHEMA)
    print("All project '{}' 'scenarios' python dependencies successfully retrieved!".format(project.project_key))   
    return all_flow_scenarios_python_dependencies_dataframe


def get_all_flow_python_recipes_python_dependencies_dataframe(project):
    """
    Retrieves a DataFrame containing all python modules dependencies for a all project recipes.
        DISCLAIMER: Does not retrieves import done within functions.
    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :returns: all_flow_python_recipes_python_dependencies_dataframe: pandas.core.frame.DataFrame: Pandas DataFrame
        containing information about all the imports done in all the scenario python scripts.
    """
    print("Retrieving project '{}' all 'python recipes' python dependencies ...".format(project.project_key))
    PYTHON_DEPENDENCIES_SCHEMA = ["recipe_name", "imported_from",
                                  "imported", "all_import_information"]
    all_flow_python_recipe_names = [recipe["name"] for recipe in project.list_recipes() if recipe["type"] == "python"]
    all_flow_python_recipe_python_dependencies = []
    for recipe_name in all_flow_python_recipe_names:
        recipe_python_dependencies_dataframe = get_python_recipe_python_dependencies_dataframe(project, recipe_name)
        all_flow_python_recipe_python_dependencies.append(recipe_python_dependencies_dataframe)
    
    if len(all_flow_python_recipe_python_dependencies) > 0:
        all_flow_python_recipes_python_dependencies_dataframe = pd.concat(all_flow_python_recipe_python_dependencies).reset_index()
    else:
        all_flow_python_recipes_python_dependencies_dataframe = pd.DataFrame(columns=PYTHON_DEPENDENCIES_SCHEMA)    
    print("All project '{}' 'python recipes' python dependencies successfully retrieved!".format(project.project_key))   
    return all_flow_python_recipes_python_dependencies_dataframe


def get_all_project_python_dependencies_dataframe(project, feature_scopes=["SCENARIOS", "PYTHON_RECIPES"]):
    """
    Retrieves a DataFrame containing all python modules dependencies for scenarios and/or recipes.
        DISCLAIMER: Does not retrieves import done within functions.
    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param: feature_scopes: list: List of all dataiku features ("SCENARIOS", "PYTHON_RECIPES") where to look python
        modules dependencies.
    :returns: all_flow_python_recipes_python_dependencies_dataframe: pandas.core.frame.DataFrame: Pandas DataFrame
        containing information about all the imports done in all the scenario python scripts.
    """
    ALLOWED_FEATURE_SCOPES = ["SCENARIOS", "PYTHON_RECIPES"]
    PYTHON_DEPENDENCIES_SCHEMA = ["feature_scope", "imported_from", "imported", "all_import_information"]
    if len(feature_scopes) == 0:
        log_message = "Not any feature_scope have been provided: please provide at least one feature scope in '{}'!".format(ALLOWED_FEATURE_SCOPES)
        raise Exception(log_message)
    for feature_scope in feature_scopes:
        if feature_scope not in ALLOWED_FEATURE_SCOPES:
            log_message = "Feature score '{}' is not part of the allowed feature scopes: please choose feature scopes present in '{}'!".format(feature_scope, ALLOWED_FEATURE_SCOPES)
            raise Exception(log_message)
    project_python_dependencies_dataframes = []
    if "PYTHON_RECIPES" in feature_scopes:
        all_flow_python_recipes_python_dependencies_dataframe = get_all_flow_python_recipes_python_dependencies_dataframe(project)
        all_flow_python_recipes_python_dependencies_dataframe["feature_scope"] = "PYTHON_RECIPE"
        project_python_dependencies_dataframes.append(all_flow_python_recipes_python_dependencies_dataframe)
        PYTHON_DEPENDENCIES_SCHEMA.append("recipe_name")
    if "SCENARIOS" in feature_scopes:
        all_flow_scenarios_python_dependencies_dataframe = get_all_flow_scenarios_python_dependencies_dataframe(project)
        all_flow_scenarios_python_dependencies_dataframe["feature_scope"] = "SCENARIO"
        project_python_dependencies_dataframes.append(all_flow_scenarios_python_dependencies_dataframe)
        for column in ["scenario_id", "scenario_step_index"]:
            PYTHON_DEPENDENCIES_SCHEMA.append(column)
    all_project_python_dependencies_dataframe = pd.concat(project_python_dependencies_dataframes)
    all_project_python_dependencies_dataframe = all_project_python_dependencies_dataframe[PYTHON_DEPENDENCIES_SCHEMA].reset_index()
    return all_project_python_dependencies_dataframe
