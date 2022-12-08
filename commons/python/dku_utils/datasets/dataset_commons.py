import dataikuapi
import pandas as pd


def get_dataset_settings_and_dictionary(project, dataset_name, bool_get_settings_dictionary):
    """
    Retrieves the settings of a project dataset.
    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param dataset_name: str: Name of the dataset.
    :param bool_get_settings_dictionary: bool: Precise if you to rerieve the dataset settings dictionary.
    :returns: 
        - dataset_settings: dataikuapi.dss.dataset.[DatasetType]DatasetSettings: Settings for a dataset. 
        - dataset_settings_dict: dict: Dictionary containing dataset settings.
    """
    dataset_settings = project.get_dataset(dataset_name).get_settings()
    if bool_get_settings_dictionary:
        dataset_settings_dict = dataset_settings.settings
    else:
        dataset_settings_dict = None
    return dataset_settings, dataset_settings_dict
   
    
def get_dataset_schema(project, dataset_name):
    """
    Retrieves a project dataset schema. 
    
    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param dataset_name: str: Name of the dataset.
    :returns: dataset_schema: list: The schema of the dataset, with format: 
        [{'name': 'column_1', 'type': 'column_1_datatype'}, 
        {'name': 'column_2', 'type': 'column_2_datatype'}| 
    """
    dataset_schema = project.get_dataset(dataset_name).get_settings().settings["schema"]["columns"]
    return dataset_schema


def set_dataset_schema(project, dataset_name, new_dataset_schema):
    """
    Updates a dataset's schema.
    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param dataset_name: str: Name of the dataset.
    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param new_dataset_schema: list: The new schema the dataset must have, with format: 
        [{'name': 'column_1', 'type': 'column_1_datatype'}, 
        {'name': 'column_2', 'type': 'column_2_datatype'}| 
    """
    dataset_settings, dataset_settings_dict = get_dataset_settings_and_dictionary(project, dataset_name, True)
    dataset_settings_dict["schema"]["columns"] = new_dataset_schema
    dataset_settings.settings = dataset_settings_dict
    dataset_settings.save()
    pass


def extract_dataset_schema_information(dataset_schema):
    """
    Extracts all schema information as lists from a 'dataset_schema'.
    :param dataset_schema: list: Schema of the dataset, with format: 
            [{'name': 'column_1', 'type': 'column_1_datatype'}, 
             {'name': 'column_2', 'type': 'column_2_datatype'}| 
        'dataset_schema' can be get as the output of :function:`get_dataset_schema`
        
    :returns: dataset_columns: list: List of all dataset column names.
    :returns: dataset_datatypes: list: List of all dataset column datatypes.
    """
    dataset_columns = [parameter["name"] for parameter in dataset_schema]
    dataset_column_datatypes = [parameter["type"] for parameter in dataset_schema]
    return dataset_columns, dataset_column_datatypes


def change_dataset_column_datatype(project, dataset_name, column_name, new_datatype):
    """
    Updates the datatype of one project dataset column, it its settings.
    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param dataset_name: str: Name of the dataset.
    """
    print("Updating column {} datatype (from dataset {}) to '{}' ...".format(column_name, dataset_name, new_datatype))
    dataset_schema = get_dataset_schema(project, dataset_name)
    dataset_settings, dataset_settings_dict = get_dataset_settings_and_dictionary(project, dataset_name, True)
    new_dataset_schema = []

    for entity in dataset_schema:
        if entity['name']==column_name:
            entity['type']=new_datatype
        new_dataset_schema.append(entity)
        
    dataset_settings_dict['schema']['columns'] = new_dataset_schema
    dataset_settings.settings = dataset_settings_dict
    dataset_settings.save()
    print("Column {} datataype (from dataset {}) successfully updated !".format(column_name, dataset_name))
    pass


def get_dataset_column_datatype(project, dataset_name, column_name):
    """
    Retrieves the datatype of one project dataset column.
    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param dataset_name: str: Name of the dataset.
    :returns: column_datatype: str: Resquested dataset column datatype.
    """
    dataset_schema = get_dataset_schema(project, dataset_name)
    dataset_columns, dataset_column_datatypes = extract_dataset_schema_information(dataset_schema)
    
    try:
        column_index = dataset_columns.index(column_name)
        column_datatype = dataset_column_datatypes[column_index]
        return column_datatype
    except ValueError:
        log_message = "Column '{}' does not exist in dataset '{}' !"\
            "\nExisting columns are '{}'"\
            .format(column_name, dataset_name, dataset_columns)
        raise Exception(log_message)
        pass
    pass
    

def clear_dataset(project, dataset_name):
    """
    Clears a project dataset.
    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param dataset_name: str: Name of the dataset.
    """
    print("Clearing dataset {}.{}".format(project.project_key, dataset_name))
    project.get_dataset(dataset_name).clear()
    pass


def get_last_dataset_metrics_information(project, dataset_name):
    """
    Retrieves all the last metrics information of a project dataset. 
    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param dataset_name: str: Name of the dataset.
    :returns: last_metrics_information_df: pandas.core.frame.DataFrame: DataFrame containing all last dataset metrics information.
    """
    dataset = project.get_dataset(dataset_name)
    dataset_metrics = dataset.get_last_metric_values()
    dataset_metrics_ids = dataset_metrics.get_all_ids()
    metrics_information = []
    metric_ids_splitted = []
    for metric_id in dataset_metrics_ids:
        metric_information = dataset_metrics.get_global_data(metric_id)
        metrics_information.append(metric_information)
        metric_id = str(metric_id)
        metric_id_splitted = metric_id.split(":")
        metric_ids_splitted.append(metric_id_splitted)
    
    last_metrics_information_df = pd.DataFrame(metric_ids_splitted, columns=["metric_category", "metric_name", "metric_column_or_scope"])
    last_metrics_information_df["metric_information"] = metrics_information
    return last_metrics_information_df


def get_dataset_connection_type(project, dataset_name):
    """
    Retrieves the connection type of a project dataset.
    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param dataset_name: str: Name of the dataset.
    :returns: dataset_connection_type: str: Dataset's connection type.
    """
    __, dataset_settings_dict = get_dataset_settings_and_dictionary(project, dataset_name, True)
    dataset_connection_type = dataset_settings_dict["type"]
    return dataset_connection_type


def create_dataset_in_connection(project, dataset_name, connection_name):
    """
    Creates a dataset in a given connection.
    
    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param dataset_name: str: Name of the dataset.
    :param connection_name: str: Name of the connection.
    """
    builder = dataikuapi.CodeRecipeCreator("TMP_RECIPE", "python", project)
    builder = builder.with_new_output_dataset(dataset_name, connection_name)
    print("Dataset '{}' has been successfully created in connection '{}'.".format(dataset_name, connection_name))
    pass


def get_dataset_in_connection_settings(project, connection_name):
    """
    Retrieves the connection settings of a project dataset in connection 'connection_name'.
    This process is done by:
        - Creating a temporary python recipe in the flow.
            - It has no input.
            - Output is a temporary dataset in connection 'connection_name'.
        - Looking at the settings of the temporary dataset outputed by the recipe.
    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param connection_name: str: Name of the connection.
    :returns: dataset_in_connection_settings: dict: Settings of a project dataset in connection 'connection_name'.
    """
    TMP_DATASET_NAME = "dataset_for_connection_settings_extraction"
    TMP_RECIPE_NAME = "compute_{}".format(TMP_DATASET_NAME)
    print("Creating temporary dataset and with 'dataikuapi' recipes builder...")
    builder = dataikuapi.CodeRecipeCreator(TMP_RECIPE_NAME, "python", project)
    builder = builder.with_new_output_dataset(TMP_DATASET_NAME, connection_name)
    #tmp_recipe = builder.build() #fails without "DATA_SCIENTIST" profile
    print("Temporary dataset ! \nExtracting connection settings from temporary dataset...")
    tmp_dataset = project.get_dataset(TMP_DATASET_NAME)
    dataset_in_connection_settings = tmp_dataset.get_settings().settings
    #print("Connection settings extracted from temporary dataset! \nRemoving temporary dataset and recipe...") #fails without "DATA_SCIENTIST" profile
    #tmp_recipe.delete() #fails without "DATA_SCIENTIST" profile
    tmp_dataset.delete()
    print("Temporary dataset removed!")
    return dataset_in_connection_settings

 
def infer_and_update_dataset_schema(project, dataset_name, connection_name):
    """
    Infer and updates a project dataset's schema. 
    This process is done by:
        - Creating a temporary prepare recipe in the flow.
            - Input is 'dataset_name'
            - Output is a temporary dataset.
        - Looking at the schema of the temporary dataset outputed by the recipe. 
    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param dataset_name: str: Name of the dataset.
    :param connection_name: str: Name of the connection.
    """
    dataset_settings, __ = get_dataset_settings_and_dictionary(project, dataset_name, False)
    TMP_DATASET_NAME = "{}_for_schema_inference".format(dataset_name)
    TMP_RECIPE_NAME = "compute_{}".format(TMP_DATASET_NAME)
    print("Creating temporary prepare recipe '{}' and dataset '{}'"\
          " for infering dataset '{}' schema ...".format(TMP_RECIPE_NAME, TMP_DATASET_NAME, dataset_name))
    tmp_dataset = project.get_dataset(TMP_DATASET_NAME)
    tmp_recipe = dataikuapi.dss.recipe.SingleOutputRecipeCreator('shaker', TMP_RECIPE_NAME, project)
    tmp_recipe.with_input(dataset_name)
    tmp_recipe.with_new_output(name=TMP_DATASET_NAME, connection_id=connection_name)
    tmp_recipe.build()
    tmp_dataset_infered_schema = get_dataset_schema(project, TMP_DATASET_NAME)
    dataset_settings.settings["schema"]["columns"] = tmp_dataset_infered_schema
    dataset_settings.save()
    print("Dataset '{}' schema successfully inferred!".format(dataset_name))
    print("Removing temporary prepare recipe '{}' and dataset '{}'...".format(TMP_RECIPE_NAME, TMP_DATASET_NAME))
    project.get_recipe(TMP_RECIPE_NAME).delete()
    tmp_dataset.delete()
    print("Temporary prepare recipe '{}' and dataset '{}' removed!".format(TMP_RECIPE_NAME, TMP_DATASET_NAME))
    pass


def update_dataset_varchar_limit(project, dataset_name, new_varchar_limit):
    """
    Updates a project dataset varchar limit to avoid connection issues while writing data.
    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param dataset_name: str: Name of the dataset.
    :param new_varchar_limit: int: New dataset varchar limit.
    """
    new_dataset_schema_information = []
    dataset_settings, __ = get_dataset_settings_and_dictionary(project, dataset_name, False)
    dataset_schema_information = dataset_settings.settings["schema"]["columns"]
    for schema_information in dataset_schema_information:
        column_datatype = schema_information["type"]
        if column_datatype == "string":
            schema_information["maxLength"] = new_varchar_limit
        new_dataset_schema_information.append(schema_information)
    dataset_settings.settings["schema"]["columns"] = new_dataset_schema_information
    dataset_settings.save()
    pass


def get_dataset_managed_state(project, dataset_name):
    """
    Retrieves the information of a dataset 'managed state', between 'managed' or 'not_managed'.
    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param dataset_name: str: Name of the dataset.
    :returns: dataset_managed_state: str: String informing about the dataset 'managed state'.
    """
    dataset_connection_type = get_dataset_connection_type(project, dataset_name)
    dataset_settings, __ = get_dataset_settings_and_dictionary(project, dataset_name, False)
    if dataset_settings.settings["managed"]:
        dataset_managed_state = "managed"
    else:
        dataset_managed_state = "not_managed"
    return dataset_managed_state


def change_dataset_managed_state(project, dataset_name, bool_should_be_managed_state):
    """
    Changes the state a project dataset so that it becomes a 'managed' or a 'not managed' one.
    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param dataset_name: str: Name of the dataset.
    :param bool_should_be_managed_state: bool: Precise if you want the dataset to be managed.
    """
    dataset_connection_type = get_dataset_connection_type(project, dataset_name)
    dataset_settings, __ = get_dataset_settings_and_dictionary(project, dataset_name, False)
    dataset_settings.settings["managed"] = bool_should_be_managed_state
    if bool_should_be_managed_state:
        if dataset_connection_type == "Redshift":
            dataset_settings.settings["params"]["distributionStyle"] = "AUTO" #["AUTO", "EVEN", "ALL"]
            dataset_settings.settings["params"]["sortKey"] = "NONE" #["NONE", "COMPOUND", "INTERLEAVED"]
            dataset_settings.settings["params"]["sortKeyColumns"] = [] #Should be a list of dataset columns if 'sortKey' != None
            
    dataset_settings.save()
    pass
