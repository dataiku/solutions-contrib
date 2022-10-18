def get_managed_folder_metadata(project, managed_folder_name):
    """
    Retrieves the information associated with a project folder. 

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param managed_folder_name: str: Name of the project managed folder.

    :returns: managed_folder_metadata: dict: The associated with 'flow_zone_name'.
    """
    all_managed_folders_information = project.list_managed_folders()
    managed_folder_metadata = None
    for managed_folder_information in all_managed_folders_information:
        if managed_folder_information['name'] == managed_folder_name:
            managed_folder_metadata = managed_folder_information
            pass
        pass
    if managed_folder_metadata == None:
        log_message = "Folder '{}' does not exist! "\
            "Please use the computed 'all_managed_folders_information' to use a valid folder name."\
            "all_managed_folders_information = '{}'".format(managed_folder_name, all_managed_folders_information)
        raise Exception(log_message)
    return managed_folder_metadata


def get_managed_folder_id(project, managed_folder_name):
    """
    Retrieves the ID of a project managed folder. 

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param managed_folder_name: str: Name of the project managed folder.

    :returns: managed_folder_id: str: The ID associated with 'managed_folder_name'.
    """
    managed_folder_metadata = get_managed_folder_metadata(project, managed_folder_name)
    managed_folder_id = managed_folder_metadata["id"]
    return managed_folder_id


def create_managed_folder_in_connection(project, managed_folder_name, connection_name):
    """
    Creates a managed folder in a given connection.
    
    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param managed_folder_name: str: Name of the project managed folder.
    :param connection_name: str: Name of the connection.
    """
    project.create_managed_folder(managed_folder_name, connection_name=connection_name)
    pass
