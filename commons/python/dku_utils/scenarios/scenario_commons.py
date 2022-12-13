import pandas as pd
from ..python_utils.python_scripts import load_python_string_imports_dataframe


def get_scenario_settings(project, scenario_id):
    """
    Retrieves the settings of a project scenario.

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param scenario_id: str: ID of the scenario.

    :returns: scenario_settings: dataikuapi.dss.scenario.StepBasedScenarioSettings: Settings of a scenario.
    """
    scenario_settings = project.get_scenario(scenario_id).get_settings()
    return scenario_settings


def switch_scenario_auto_trigger_state(project, scenario_id, bool_activate_auto_trigger):
    """
    Activates or desactivates a project scenario 'Auto-triggers'.

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param scenario_id: str: ID of the scenario.
    :param bool_activate_auto_trigger: bool: Boolean precising if you want to activate the scenario auto trigger.
    """
    scenario_settings = get_scenario_settings(project, scenario_id)
    if bool_activate_auto_trigger:
        scenario_settings.active = True
        auto_trigger_state = "ACTIVATED"
    else:
        scenario_settings.active = False
        auto_trigger_state = "DESACTIVATED"
    scenario_settings.save()
    print("Scenario auto-trigger state successfully switched to '{}'".format(auto_trigger_state))
    pass


def switch_scenario_triggers_state(project, scenario_id, list_bool_trigger_activations):
    """
    Activates or desactivates a project scenario 'Triggers'.

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param scenario_id: str: ID of the scenario.
    :param list_bool_trigger_activations: list: List of booleans precising if you want to activate the scenario triggers.
        This list should have the length equals to the number of triggers existing in the scenario.
    """
    scenario_settings = get_scenario_settings(project, scenario_id)
    triggers_definition = scenario_settings.get_raw()["triggers"]
    new_triggers_definition = []
    triggers_states = {}
    n_triggers = len(triggers_definition)
    n_boolean_instructions = len(list_bool_trigger_activations)
    if n_triggers != n_boolean_instructions:
        log_message = "It seems that scenario '{}' has '{}' defined but you provided '{}' "\
            "boolean instructions in parameter 'list_bool_trigger_activations' ! "\
            "Prease provide as many boolean instructions as there are triggers"\
            .format(scenario_id, n_triggers, n_boolean_instructions)
        raise Exception(log_message)
    for trigger_definition, bool_trigger_activation in zip(triggers_definition, list_bool_trigger_activations):
        trigger_name = trigger_definition["name"]
        triggers_states[trigger_name] = "ACTIVATED" if bool_trigger_activation else "DESACTIVATED"
        trigger_definition["active"] = bool_trigger_activation
        new_triggers_definition.append(trigger_definition)
    scenario_settings.get_raw()["triggers"] = new_triggers_definition
    scenario_settings.save()
    print("Scenario triggers states successfully switched to : {}".format(triggers_states))
    pass


def get_scenario_steps(project, scenario_id):
    """
    Retrieves the steps of a project scenario.
    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param scenario_id: str: ID of the scenario.
    :returns: scenario_steps: list: Steps of a scenario.
    """
    print("Retrieving scenario '{}' steps ...".format(scenario_id))
    scenario_settings = get_scenario_settings(project, scenario_id)
    scenario_steps = scenario_settings.get_raw()["params"]["steps"]
    return scenario_steps


def set_scenario_steps(project, scenario_id, scenario_steps):
    """
    Set the steps of a project scenario.
    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param scenario_id: str: ID of the scenario.
    :param scenario_steps: list: Steps of the scenario.
    """
    print("Setting scenario '{}' steps ...".format(scenario_id))
    scenario_settings = get_scenario_settings(project, scenario_id)
    scenario_settings.get_raw()["params"]["steps"] = scenario_steps
    scenario_settings.save()
    print("Scenario '{}' steps successfully set!".format(scenario_id))
    pass


def get_scenario_python_dependencies_dataframe(project, scenario_id):
    """
    Retrieves a DataFrame containing all python modules dependencies for a project's scenario.
        DISCLAIMER: Does not retrieves import done within functions.
    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param scenario_id: str: ID of the scenario.
    :returns: scenario_python_dependencies_dataframe: pandas.core.frame.DataFrame: Pandas DataFrame
        containing information about all the imports done in the scenario python scripts.
    """
    print("Retrieving scenario '{}.{}' python dependencies ...".format(project.project_key, scenario_id))
    PYTHON_DEPENDENCIES_SCHEMA = ["scenario_id", "scenario_step_index", "imported_from",
                                            "imported", "all_import_information"]
    scenario_steps = get_scenario_steps(project, scenario_id)
    steps_python_dependencies_dataframes = []
    for scenario_step_index, scenario_step in enumerate(scenario_steps):
        if scenario_step.get("type") == "custom_python":
            step_python_script = scenario_step["params"]["script"]
            step_imports_dataframe = load_python_string_imports_dataframe(step_python_script)
            step_imports_dataframe["scenario_id"] = scenario_id
            step_imports_dataframe["scenario_step_index"] = scenario_step_index
            step_imports_dataframe = step_imports_dataframe[PYTHON_DEPENDENCIES_SCHEMA]
            steps_python_dependencies_dataframes.append(step_imports_dataframe)
    if len(steps_python_dependencies_dataframes) > 0:
        scenario_python_dependencies_dataframe = pd.concat(steps_python_dependencies_dataframes).reset_index()
    else:
        scenario_python_dependencies_dataframe = pd.DataFrame(columns=PYTHON_DEPENDENCIES_SCHEMA)
    print("Scenario '{}.{}' python dependencies successfully retrieved!".format(project.project_key, scenario_id))
    return scenario_python_dependencies_dataframe
