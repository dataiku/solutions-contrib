def get_all_flow_dataset_names(project):
    """
    Retrieves all project dataset names. 

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.

    :returns: project_dataset_names: list: List of all project dataset names.
    """
    flow_datasets = project.list_datasets()
    project_dataset_names = [dataset_information["name"] for dataset_information in flow_datasets]
    return project_dataset_names


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
        print("Dataset '{}' moved in flow zone '{}'".format(dataset_name, flow_zone_name))
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
        print("Dataset '{}' shared with flow zone '{}'".format(dataset_name, flow_zone_name))
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
        print("Dataset '{}' unshared from flow zone '{}'".format(dataset_name, flow_zone_name))
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