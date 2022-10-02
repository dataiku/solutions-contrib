import dataiku


def get_current_project_and_variables():
    """
    Retrieves current dataiku DSS project and its variables.

    :returns: project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :returns: variables: dict: Variables of the project
    """
    project = dataiku.api_client().get_project(dataiku.get_custom_variables()["projectKey"])
    variables = project.get_variables()
    return project, variables


def get_project_and_variables(project_key):
    """
    Retrieves any dataiku DSS project and its variables.

    :returns: project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :returns: variables: dict: Variables of the project
    """
    dataiku.set_default_project_key(project_key)
    project = dataiku.api_client().get_project(project_key)
    variables = project.get_variables()
    return project, variables