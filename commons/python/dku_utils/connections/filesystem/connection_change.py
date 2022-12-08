import re

from ...datasets.dataset_commons import (
    get_dataset_schema,
    get_dataset_settings_and_dictionary,
    get_dataset_in_connection_settings,
)
from ...folders.folder_commons import get_managed_folder_id


def change_filesystem_dataset_path(project, dataset_name, path):
    """
    Changes the path of a filesystem project dataset

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param dataset_name: str: Name of the dataset.
    :param path: str: New dataset path.
    """
    dataset_settings, __ = get_dataset_settings_and_dictionary(project, dataset_name, False)
    dataset_settings.settings["params"]["path"] = path
    dataset_settings.save()
    pass


def change_folder_path(project, folder_name, path):
    """
    Changes the path of a project folder.

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param folder_name: str: Name of the folder.
    :param path: str: New folder path.
    """
    folder_id = get_managed_folder_id(project, folder_name)
    folder = project.get_managed_folder(folder_id)
    folder_definition = folder.get_definition()
    folder_definition["params"]["path"] = path
    folder.set_definition(folder_definition)
    pass


def change_filesystem_dataset_format(project, dataset_name, new_dataset_format):
    """
    Changes the files format of a filesystem project dataset.

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param dataset_name: str: Name of the dataset.
    :param new_dataset_format: str: New dataset files format.
    """
    ALLOWED_FORMATS = ["csv", "parquet", "avro"]
    if new_dataset_format not in ALLOWED_FORMATS:
        log_message = "File format '{}' is not supported by this function, please " "choose a format in '{}'".format(
            new_dataset_format, ALLOWED_FORMATS
        )
        raise Exception(log_message)
    dataset_settings, __ = get_dataset_settings_and_dictionary(project, dataset_name, False)
    previous_format = dataset_settings.settings["formatType"]
    print(
        "Switching dataset '{}' format from '{}' to '{}' ...".format(dataset_name, previous_format, new_dataset_format)
    )
    dataset_settings.settings["formatType"] = new_dataset_format
    dataset_settings.save()
    print("Dataset format '{}' switched".formatdataset_name())
    pass


def switch_not_managed_dataset_connection_to_cloud_storage(
    project, dataset_name, connection_name, dataset_path_in_connection
):
    """
    Changes the connection of a NOT managed DSS dataset toward a clould storage connection.
    Connection must have a type in ['S3', 'Azure'].

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param dataset_name: str: Name of the dataset.
    :param connection_name: str: Name of the cloud storage connection.
    :param dataset_path_in_connection: str: Dataset path in the cloud storage connection.
    """
    ALLOWED_CLOUD_STORAGES = ["S3", "Azure"]
    dataset_settings, __ = get_dataset_settings_and_dictionary(project, dataset_name, False)
    dataset_is_managed = dataset_settings.settings["managed"]

    if dataset_is_managed:
        log_message = (
            "Dataset '{}' is a DSS managed dataset.\n"
            "You can't use this function to change its connection".format(dataset_name)
        )
        raise Exception(log_message)

    dataset_connection_settings = get_dataset_in_connection_settings(project, connection_name)
    dataset_connection_settings["managed"] = False
    connection_type = dataset_connection_settings["type"]

    if connection_type not in ALLOWED_CLOUD_STORAGES:
        log_message = (
            "Connection '{}' is of type '{}' that is not allowed by this function.\n"
            "Allowed connection types are '{}'".format(connection_name, connection_type, ALLOWED_CLOUD_STORAGES)
        )
        raise Exception(log_message)

    dataset_connection_settings["params"]["path"] = dataset_path_in_connection
    dataset_connection_settings["name"] = dataset_name
    metastore_synchronization_enabled = dataset_connection_settings["params"]["metastoreSynchronizationEnabled"]
    if metastore_synchronization_enabled:
        dataset_connection_settings["params"]["metastoreTableName"] = dataset_name
    else:
        dataset_connection_settings["params"]["metastoreTableName"] = ""

    dataset_settings.settings = dataset_connection_settings
    dataset_settings.save()
    pass


def switch_managed_dataset_connection_to_cloud_storage(project, dataset_name, connection_name):
    """
    Changes the connection of a managed DSS dataset toward a clould storage connection.
    Connection must have a type in ['S3', 'Azure'].

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param dataset_name: str: Name of the dataset.
    :param connection_name: str: Name of the cloud storage connection.
    """
    ALLOWED_CLOUD_STORAGES = ["S3", "Azure"]
    dataset_settings, __ = get_dataset_settings_and_dictionary(project, dataset_name, False)
    dataset_is_managed = dataset_settings.settings["managed"]

    if not dataset_is_managed:
        log_message = (
            "Dataset '{}' is not a DSS managed dataset.\n"
            "You can't use this function to change its connection".format(dataset_name)
        )
        raise Exception(log_message)

    dataset_connection_settings = get_dataset_in_connection_settings(project, connection_name)
    connection_type = dataset_connection_settings["type"]

    if connection_type not in ALLOWED_CLOUD_STORAGES:
        log_message = (
            "Connection '{}' is of type '{}' that is not allowed by this function.\n"
            "Allowed connection types are '{}'".format(connection_name, connection_type, ALLOWED_CLOUD_STORAGES)
        )
        raise Exception(log_message)

    connection_path = dataset_connection_settings["params"]["path"]
    connection_path = re.sub("dataset_for_connection_settings_extraction", "", connection_path)
    new_connection_path = "{}{}".format(connection_path, dataset_name)
    dataset_connection_settings["params"]["path"] = new_connection_path

    dataset_connection_settings["name"] = dataset_name
    metastore_synchronization_enabled = dataset_connection_settings["params"]["metastoreSynchronizationEnabled"]
    if metastore_synchronization_enabled:
        dataset_connection_settings["params"]["metastoreTableName"] = dataset_name
    else:
        dataset_connection_settings["params"]["metastoreTableName"] = ""

    dataset_connection_settings["schema"]["columns"] = get_dataset_schema(project, dataset_name)
    dataset_connection_settings["metrics"] = dataset_settings.settings["metrics"]
    dataset_settings.settings = dataset_connection_settings
    dataset_settings.save()
    pass


def switch_managed_folder_connection_to_cloud_storage(project, folder_name, connection_name):
    """
    Changes the connection of a managed DSS folder toward a clould storage connection.
    Connection must have a type in ['S3', 'Azure'].

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param folder_name: str: Name of the folder.
    :param connection_name: str: Name of the cloud storage connection.
    """
    ALLOWED_CLOUD_STORAGES = ["S3", "Azure"]

    folder_id = get_managed_folder_id(project, folder_name)
    folder = project.get_managed_folder(folder_id)
    folder_definition = folder.get_definition()

    dataset_connection_settings = get_dataset_in_connection_settings(project, connection_name)
    connection_type = dataset_connection_settings["type"]

    if connection_type not in ALLOWED_CLOUD_STORAGES:
        log_message = (
            "Connection '{}' is of type '{}' that is not allowed by this function.\n"
            "Allowed connection types are '{}'".format(connection_name, connection_type, ALLOWED_CLOUD_STORAGES)
        )
        raise Exception(log_message)

    folder_definition["type"] = connection_type
    connection_path = dataset_connection_settings["params"]["path"]
    connection_path = re.sub("dataset_for_connection_settings_extraction", "", connection_path)
    new_connection_path = "{}{}".format(connection_path, "${odbId}")
    folder_definition["params"]["path"] = new_connection_path
    folder_definition["params"]["connection"] = connection_name

    metastore_synchronization_enabled = dataset_connection_settings["params"]["metastoreSynchronizationEnabled"]
    if metastore_synchronization_enabled:
        folder_definition["params"]["metastoreTableName"] = "${odbId}"
    else:
        folder_definition["params"]["metastoreTableName"] = ""

    folder.set_definition(folder_definition)
    pass


def switch_to_filesystem_storage(project, dataset_name, filesystem_connection_name):
    dataset_settings, __ = get_dataset_settings_and_dictionary(project, dataset_name, False)
    dataset_connection_settings = get_dataset_in_connection_settings(project, filesystem_connection_name)

    dataset_connection_settings["name"] = dataset_name
    dataset_connection_settings["schema"]["columns"] = get_dataset_schema(project, "transaction_filtered")
    dataset_connection_settings["metrics"] = dataset_settings.settings["metrics"]
    dataset_settings.settings = dataset_connection_settings
    dataset_settings.save()
