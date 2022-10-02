import hashlib
from ...datasets.dataset_commons import get_dataset_schema, get_dataset_settings_and_dictionary
from ..connection_commons import get_dataset_in_connection_settings


def change_sql_dataset_table(project, dataset_name, table_name):
    """
    Changes the path of a filesystem project dataset

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param dataset_name: str: Name of the dataset.
    :param table_name: str: Name of the table associated with the dataset.
    """
    dataset_settings, __ = get_dataset_settings_and_dictionary(project, dataset_name, False)
    dataset_settings.settings["params"]["table"] = table_name
    dataset_settings.save()
    pass

def switch_managed_dataset_connection_to_sql(project, dataset_name, connection_name, bool_use_project_key_for_table_naming):
    """
    Changes the connection of a managed DSS dataset toward a SQL connection.
    Connection must have a type in ['S3', 'Azure'].

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param dataset_name: str: Name of the dataset.
    :param connection_name: str: Name of the cloud storage connection.
    :param bool_use_project_key_for_table_naming: bool: Precises if we want to use the current project key for naming the
        table associated with the dataset.
    """
    dataset_settings, __ = get_dataset_settings_and_dictionary(project, dataset_name, False)
    dataset_connection_settings = get_dataset_in_connection_settings(project, connection_name)
    connection_type = dataset_connection_settings["type"]
    if bool_use_project_key_for_table_naming:
        sql_table_name = compute_sql_table_name(project, connection_type, dataset_name)
    else:
        sql_table_name = dataset_name
    dataset_connection_settings["params"]["table"] = sql_table_name
    dataset_connection_settings["name"] = dataset_name
    dataset_connection_settings["schema"]["columns"] = get_dataset_schema(project, dataset_name)
    dataset_connection_settings["metrics"] = dataset_settings.settings["metrics"]
    dataset_settings.settings = dataset_connection_settings
    dataset_settings.save()
    pass

def compute_sql_table_name(project, connection_type, dataset_name):
    """
    Computes the name of the table associated with a project managed dataset in a SQL connection.
        Default name is the concatenation of the current 'project_key' and the 'dataset_name'. 
        When this name exceeds the database name length limits, it is hashed and then shortened.

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param connection_type: str: Type of the dataset's connection.
    :param dataset_name: str: Name of the project managed dataset associated with the SQL table.
    """    
    CONNECTIONS_TABLE_NAMES_LIMIT = {
        "Redshift": 127,
        "PostgreSQL": 63,
        "SQLServer": 128,
        "Snowflake": 255
    }
    project_key = project.project_key
    sql_table_name = "{}_{}".format(project_key, dataset_name)
    if connection_type in CONNECTIONS_TABLE_NAMES_LIMIT.keys():
        connection_table_names_limit = CONNECTIONS_TABLE_NAMES_LIMIT[connection_type]
        if len(sql_table_name) > connection_table_names_limit:
            h = hashlib.new('sha256')
            h.update(dataset_name.encode('utf-8'))
            hashed_dataset_name = h.hexdigest()
            sql_table_name = "{}_{}".format(project_key, hashed_dataset_name)
            sql_table_name = sql_table_name[0: connection_table_names_limit]
    else:
        log_message = "connection_type '{}' is not usable in this function ."\
            "Allowed connection types are: {}".format(connection_type, list(CONNECTIONS_TABLE_NAMES_LIMIT.keys()))
        raise Exception(log_message)
    return sql_table_name


def autodetect_sql_dataset_schema(project, dataset_name):
    """
    Detects the schema of a project SQL dataset.

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param dataset_name: str: Name of the project dataset to detect the schema from.
    """
    print("Trying to detect dataset '{}' schema ...".format(dataset_name))
    dataset = project.get_dataset(dataset_name)
    dataset_settings = dataset.get_settings()
    
    dataset_detected_settings = dataset.test_and_detect()
    dataset_detected_schema = dataset_detected_settings["schemaDetection"]["detectedSchema"]["columns"]
    dataset_settings.get_raw()["schema"]["columns"] = dataset_detected_schema
    dataset_settings.save()
    print("Dataset '{}' schema detected and replaced !")
    pass