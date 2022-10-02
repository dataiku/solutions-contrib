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