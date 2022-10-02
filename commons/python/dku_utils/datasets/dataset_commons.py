import dataikuapi
import pandas as pd


def get_dataset_settings_and_dictionary(project, dataset_name, bool_get_settings_dictionary):
    """
    Retrieves the settings of a project dataset.

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param dataset_name: str: Name of the dataset.

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

    :returns: dataset_schema: list: the schema of the dataset, with format format: 
        [{'name': 'column_1', 'type': 'column_1_datatype'}, 
        {'name': 'column_2', 'type': 'column_2_datatype'}| 
    """
    dataset_schema = project.get_dataset(dataset_name).get_settings().settings["schema"]["columns"]
    return dataset_schema


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