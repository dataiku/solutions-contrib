import dataiku
import pandas as pd


def get_current_project_and_variables():
    project_key = dataiku.get_custom_variables()["projectKey"]
    client = dataiku.api_client()
    project = client.get_project(project_key)
    variables = project.get_variables()
    return project, variables


def get_dataset_schema(project, dataset_name):
    dataset = project.get_dataset(dataset_name)
    dataset_definition = dataset.get_definition()
    dataset_schema = dataset_definition['schema']['columns']
    return dataset_schema


def extract_dataset_schema_information(dataset_schema):
    dataset_columns = [parameter["name"] for parameter in dataset_schema]
    dataset_datatypes = [parameter["type"] for parameter in dataset_schema]
    return dataset_columns, dataset_datatypes


def update_one_schema_column(project, dataset_name, column_name, new_datatype):
    dataset = project.get_dataset(dataset_name)
    dataset_definition = dataset.get_definition()
    dataset_schema = dataset_definition['schema']['columns']
    new_dataset_schema = []
    
    for entity in dataset_schema:
        if entity['name']==column_name:
            entity['type']=new_datatype
        new_dataset_schema.append(entity)
        
    dataset_definition['schema']['columns'] = new_dataset_schema
    dataset.set_definition(dataset_definition)
    print("dataset successfully updated ! ")
    pass


def get_column_datatype(project, dataset_name, column_name):
    dataset_schema = get_dataset_schema(project, dataset_name)
    
    for entity in dataset_schema:
        if entity['name'] == column_name:
            column_datatype = entity['type']
    try:
        return column_datatype
    
    except:
        print("Column '{}' is not present in that dataset !")
        return None

    
def switch_recipe_engine(project, recipe_name, new_engine):
    recipe = project.get_recipe(recipe_name)
    recipe_settings = recipe.get_settings()
    recipe_type = recipe_settings.type
    print("Switching recipe '{}' engine | recipe_type : '{}'".format(recipe_name, recipe_type))
    
    if recipe_type in ["prepare", "shaker", "sampling"]:
        recipe_settings.get_recipe_params()["engineType"] = new_engine
        
    elif recipe_type == "split":
        recipe_settings.obj_payload["engineType"] = new_engine
   
    else:
        recipe_settings.get_json_payload()["engineType"] = new_engine
    recipe_settings.save()
    pass


def update_recipe_ouput_schema(project, recipe_name):
    recipe = project.get_recipe(recipe_name)
    required_updates = recipe.compute_schema_updates()
    if required_updates.any_action_required():
        required_updates.apply()
        pass
    pass


def get_dataset_connection_type(project, dataset_name):
    dataset = project.get_dataset(dataset_name)
    dataset_settings = dataset.get_settings()
    dataset_connection_type = dataset_settings.settings["type"]
    return dataset_connection_type


def change_dataset_connection_to_sql(project, dataset_name, new_connection_name, new_connection_type, new_connection_schema, new_connection_database):
    dataset = project.get_dataset(dataset_name)
    dataset_settings = dataset.get_settings()
    dataset_settings.settings["params"]["connection"] = new_connection_name
    dataset_settings.settings["params"]["mode"] = 'table'
    dataset_settings.settings["params"]["schema"] = new_connection_schema
    if new_connection_type == "Snowflake":
        dataset_settings.settings["params"]["catalog"] = new_connection_database
    dataset_settings.settings["type"] = new_connection_type
    dataset_settings.save()
    pass


def get_recipe_available_engines(project, recipe_name):
    available_engines = []
    recipe = project.get_recipe(recipe_name)
    recipe_status = recipe.get_status()
    recipe_engine_details = recipe_status.get_engines_details()
    available_engines = [entity["type"] for entity in recipe_engine_details if (entity["isSelectable"] == True)]
    if len(available_engines) == 0:
        available_engines.append("DSS")
    return available_engines


def change_group_key_in_group_recipe(project, recipe_name, group_key, replace_existing_key):
    """
    'group_key' : list of columns
    'replace_group_key' : boolean : set to true if you want to replace the existing group key 
    ELSE each column in the 'group_key' will be added to the existing group key.
    """
    recipe = project.get_recipe(recipe_name)
    recipe_settings = recipe.get_settings()
    
    if replace_existing_key:
        recipe_settings.clear_grouping_keys()
        
    for column in group_key:
        recipe_settings.add_grouping_key(column)
        
    recipe_settings.save()
    pass


def define_group_recipe_aggregations(project, recipe_name, columns_aggregations_mapping, bool_compute_global_count):
    """
    'columns_aggregations_mapping' : dictionary indicating the list of aggregations to apply to each column.
    """
    print("Updating recipe '{}' aggregations ...".format(recipe_name))
    POSSIBLE_AGGREGATIONS = ["countDistinct", "min", "max", "avg", "sum", "stddev",
                             "count", "first", "last", "concat", "concatDistinct"]
    
    recipe = project.get_recipe(recipe_name)
    recipe_settings = recipe.get_settings()
    recipe_json_payload = recipe_settings.get_json_payload()
    
    recipe_aggregations = []
    for column in columns_aggregations_mapping.keys():
        column_asked_aggregations = columns_aggregations_mapping[column]
        recipe_column_settings = recipe_settings.get_or_create_column_settings(column)
        for aggregation in POSSIBLE_AGGREGATIONS:
            if aggregation in column_asked_aggregations:
                recipe_column_settings[aggregation] = True
            else:
                recipe_column_settings[aggregation] = False
        
        recipe_aggregations.append(recipe_column_settings)
    
    recipe_json_payload["values"] = recipe_aggregations
    recipe_settings.set_json_payload(recipe_json_payload)
    recipe_settings.set_global_count_enabled(bool_compute_global_count)
    recipe_settings.save()
    print("Recipe '{}' aggregations updated !".format(recipe_name))
    pass


def configure_massively_window_recipe(project, window_recipe_name, columns_concerned, window_values_to_enable):
    WINDOW_POSSIBLE_VALUES = [
        "last",
        "lagDiff",
        "max",
        "column",
        "count",
        "$idx",
        "sum",
        "concat",
        "type",
        "lead",
        "concatDistinct",
        "min",
        "avg",
        "lag",
        "$selected",
        "stddev",
        "value",
        "leadDiff",
        "first"
    ]
    WINDOW_BASE_VALUES = [
        "column",
        "$idx",
        "type"
    ]
    WINDOW_VALUES_TO_CHANGE = [value for value in WINDOW_POSSIBLE_VALUES if value not in WINDOW_BASE_VALUES]
    
    recipe = project.get_recipe(window_recipe_name)
    recipe_settings = recipe.get_settings()
    recipe_payload = recipe_settings.get_json_payload()
    recipe_input_dataset_name = get_recipe_input_datasets(project, window_recipe_name)[0]
    recipe_input_dataset_schema = get_dataset_schema(project, recipe_input_dataset_name)
    recipe_input_dataset_columns, recipe_input_dataset_datatypes = extract_dataset_schema_information(recipe_input_dataset_schema)
    column_indexes = range(len(recipe_input_dataset_columns))
    window_new_aggregations = []
    for column_index, column_name, column_datatype in zip(column_indexes, recipe_input_dataset_columns, recipe_input_dataset_datatypes):
        
        column_aggregation_settings = {
            "column": column_name,
            "$idx": column_index,
            "type": column_datatype
        }
        
        for value in WINDOW_VALUES_TO_CHANGE:
            if column_name in columns_concerned:
                if value in window_values_to_enable:
                    column_aggregation_settings[value] = True
                else:
                    column_aggregation_settings[value] = False
        
            else:
                column_aggregation_settings[value] = False
            
        window_new_aggregations.append(column_aggregation_settings)
    
    recipe_payload["values"] = window_new_aggregations
    recipe_settings.set_json_payload(recipe_payload)
    recipe_settings.save()
    print("Window recipe '{}' successfully updated !".format(window_recipe_name))
    pass


def generate_window_recipe_orders(dataset_columns, columns_bool_descending_mapping):
    window_orders = []
    for column, bool_descending_mapping in zip(dataset_columns, columns_bool_descending_mapping):
        window_orders.append({'column': column, 'desc': bool_descending_mapping})
    return window_orders


def clear_dataset(project, dataset_name):
    print("Clearing dataset {}.{}".format(project.project_key, dataset_name))
    project.get_dataset(dataset_name).clear()
    pass


def get_recipe_output_datasets(project, recipe_name):
    recipe = project.get_recipe(recipe_name)
    recipe_settings = recipe.get_settings()
    recipe_output_items = recipe_settings.get_recipe_outputs()["main"]["items"]
    return [item["ref"] for item in recipe_output_items]


def get_recipe_input_datasets(project, recipe_name):
    recipe = project.get_recipe(recipe_name)
    recipe_settings = recipe.get_settings()
    recipe_input_items = recipe_settings.get_recipe_inputs()["main"]["items"]
    return [item["ref"] for item in recipe_input_items]


def get_all_projects_datasets(project):
    project_datasets = project.list_datasets()
    return [metadata["name"] for metadata in project_datasets]


def copy_sql_dataset_connection_settings(project, dataset_to_update_name, reference_dataset_name, default_table_name):
    dataset_to_update = project.get_dataset(dataset_to_update_name)
    dataset_to_update_definition = dataset_to_update.get_definition()
    
    reference_dataset = project.get_dataset(reference_dataset_name)
    reference_dataset_definition = reference_dataset.get_definition()
    
    dataset_to_update_definition["params"]["table"] = default_table_name
    dataset_to_update_definition["params"]["mode"] = reference_dataset_definition["params"]["mode"]
    dataset_to_update_definition["params"]["schema"] = reference_dataset_definition["params"]["schema"]
    dataset_to_update.set_definition(dataset_to_update_definition)
    pass


def change_dataset_managed_state(project, dataset_name, bool_should_be_managed_state):
    dataset= project.get_dataset(dataset_name)
    dataset_definition = dataset.get_definition()
    dataset_definition["managed"] = bool_should_be_managed_state
    dataset.set_definition(dataset_definition)
    pass


def change_sql_dataset_table_naming_strategy(project, dataset_name):
    project_key = project.project_key
    dataset = project.get_dataset(dataset_name)
    dataset_definition = dataset.get_definition()
    dataset_definition["params"]["table"] = "{}_{}".format(project_key, dataset_name)
    dataset.set_definition(dataset_definition)
    pass


def get_scenario_settings(project, scenario_id):
    return project.get_scenario(scenario_id).get_settings()


def switch_scenario_auto_trigger_state(project, scenario_id, bool_activate_auto_trigger):
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
    scenario_settings = get_scenario_settings(project, scenario_id)
    triggers_definition = scenario_settings.get_raw()["triggers"]
    new_triggers_definition = []
    triggers_states = {}
    for trigger_definition, bool_trigger_activation in zip(triggers_definition, list_bool_trigger_activations):
        trigger_name = trigger_definition["name"]
        triggers_states[trigger_name] = "ACTIVATED" if bool_trigger_activation else "DESACTIVATED"
        trigger_definition["active"] = bool_trigger_activation
        new_triggers_definition.append(trigger_definition)
    scenario_settings.get_raw()["triggers"] = new_triggers_definition
    scenario_settings.save()
    print("Scenario triggers states successfully switched to : {}".format(triggers_states))
    pass


def get_managed_folder_info(project, managed_folder_name):
    managed_folders = project.list_managed_folders()
    for index, folder in enumerate(managed_folders):
        if folder['name'] == managed_folder_name:
            folder_index = index
    folder_info = managed_folders[folder_index]
    return folder_info


def get_managed_folder_id_with_folder_name(project, managed_folder_name):
    folder_info = get_managed_folder_info(project, managed_folder_name)
    return folder_info["id"]


def remove_pickle_extension(pickle_name):
    import re
    return re.sub("\.p$", "", pickle_name)


def write_pickle_in_dss_folder(data, pickle_name, folder_id):
    import io
    import pickle
    
    dss_folder = dataiku.Folder(folder_id)
    pickle_bytes = io.BytesIO()
    pickle.dump(data, pickle_bytes)
    pickle_name = remove_pickle_extension(pickle_name)
    with dss_folder.get_writer(f"{pickle_name}.p") as w:
        w.write(pickle_bytes.getvalue())
        pass
    pass


def read_pickle_from_dss_folder(pickle_name, folder_id):
    import pickle
    
    dss_folder = dataiku.Folder(folder_id)
    pickle_name = remove_pickle_extension(pickle_name)
    with dss_folder.get_download_stream(f"{pickle_name}.p") as f:
        data = f.read()
        pickle_data = pickle.loads(data)
    f.close()
    return pickle_data


def get_flow_zone_id(project, flow_zone_name):
    flow = project.get_flow()
    flow_zones = flow.list_zones()
    n_flow_zones = len(flow_zones)
    
    for index, flow_zone in enumerate(flow_zones):
        if flow_zone.name == flow_zone_name:
            return flow_zone.id
        else:
            if index == n_flow_zones-1:
                return None
    pass


def move_dataset_in_flow_zone(project, dataset_name, flow_zone_name):
    flow_zone_exists = check_if_flow_zone_exists(project, flow_zone_name)
    if flow_zone_exists:
        flow_zone_id = get_flow_zone_id(project, flow_zone_name)
        project_dataset = project.get_dataset(dataset_name)
        project_dataset.move_to_zone(flow_zone_id)
        print("Dataset '{}' moved in flow zone '{}'".format(dataset_name, flow_zone_name))
        pass
    pass


def share_dataset_in_flow_zone(project, dataset_name, flow_zone_name):
    flow_zone_exists = check_if_flow_zone_exists(project, flow_zone_name)
    if flow_zone_exists:
        flow_zone_id = get_flow_zone_id(project, flow_zone_name)
        project_dataset = project.get_dataset(dataset_name)
        project_dataset.share_to_zone(flow_zone_id)
        print("Dataset '{}' shared with flow zone '{}'".format(dataset_name, flow_zone_name))
        pass
    pass


def unshare_dataset_from_flow_zone(project, dataset_name, flow_zone_name):
    flow_zone_exists = check_if_flow_zone_exists(project, flow_zone_name)
    if flow_zone_exists:
        flow_zone_id = get_flow_zone_id(project, flow_zone_name)
        project_dataset = project.get_dataset(dataset_name)
        project_dataset.unshare_from_zone(flow_zone_id)
        print("Dataset '{}' unshared from flow zone '{}'".format(dataset_name, flow_zone_name))
        pass
    pass


def check_if_flow_zone_exists(project, flow_zone_name):
    flow = project.get_flow()
    print("Checking if flow zone '{}' exists ...".format(flow_zone_name))
    try:
        flow_zone_id = get_flow_zone_id(project, flow_zone_name)
        flow.get_zone(flow_zone_id)
        flow_zone_exists = True
        print("Flow zone '{}' exists".format(flow_zone_name))
    
    except:
        print("Flow zone '{}' does not exist".format(flow_zone_name))
        flow_zone_exists = False
    
    return flow_zone_exists


def drop_flow_zone_if_exists(project, flow_zone_name):
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
    if flow_zone_color in ["", None]:
        flow_zone_color = " #C82423"
    flow_zone_exists = check_if_flow_zone_exists(project, flow_zone_name)
    if not flow_zone_exists:
        flow = project.get_flow()
        print("Creating flow zone '{}'...".format(flow_zone_name))
        flow.create_zone(flow_zone_name, color=flow_zone_color)
        flow_zone_id = get_flow_zone_id(project, flow_zone_name)
        print("Flow zone '{}' created with id '{}' !".format(flow_zone_name, flow_zone_id))
        pass
    pass


def get_models_metrics_df(ml_task, list_of_model_ids):
    models_metrics = []
    
    for model_id in list_of_model_ids:
        model_details = ml_task.get_trained_model_details(model_id)
        model_metrics = model_details.get_performance_metrics()
        models_metrics.append(model_metrics)
    
    models_metrics_df = pd.DataFrame(models_metrics)
    models_metrics_columns = list(models_metrics_df.columns)
    models_metrics_df["model_id"] = list_of_model_ids
    models_metrics_df = models_metrics_df[["model_id"]+models_metrics_columns]
    return models_metrics_df


def update_ml_task_feature_preprocessing(ml_task_settings, column, new_preprocessing_parameters):
    """
    new_preprocessing_parameters [dict] : A dictionary having parameters we would with a
        ml_task_settings.get_feature_preprocessing("COLUMN_NAME")
    """
    try:
        current_preprocessing_parameters = ml_task_settings.get_feature_preprocessing(column)
        current_preprocessing_parameters_labels = list(current_preprocessing_parameters.keys())
        new_preprocessing_parameters_labels = list(new_preprocessing_parameters.keys())
        print("Updating feature '{}' preprocessing with parameters '{}'".format(column, new_preprocessing_parameters))

        for label in current_preprocessing_parameters_labels:
            ml_task_settings.get_feature_preprocessing(column).pop(label)

        for label in new_preprocessing_parameters_labels:
            ml_task_settings.get_feature_preprocessing(column).update({label: new_preprocessing_parameters[label]})
    except KeyError:
        ml_task_settings.get_raw()["preprocessing"]["per_feature"][column] = new_preprocessing_parameters
    print("Feature '{}' preprocessing Updated !\n".format(column, new_preprocessing_parameters))
    return ml_task_settings


def update_ml_task_regression_metric(ml_task_settings, regression_metric):
    """
    regression_metric : sting in {
    "EVS": "Explained Variance Score",
    "MAPE": "Mean Absolute Percentage Error",
    "MAE": "Mean Absolute Error",
    "MSE": "Mean Squared Error",
    "RMSE": "Root Mean Square Error",
    "RMSLE": "Root Mean Square Logarithmic Error",
    "R2": "R2 Score",
    "CUSTOM": "Custom code"
    }
    """
    ml_task_settings.set_metric(metric=regression_metric)
    return ml_task_settings


def get_dataset_last_metrics_information(project, dataset_name):
    """
    KNOWN_METRICS = [
    "COUNT_RECORDS", "MAX", "MIN", "SUM", "MEAN", "STDDEV", "COUNT", "COUNT_DISTINCT", "COUNT_NULL",
    "MODE", "HISTOGRAM", "BUILD_START_DATE", "BUILD_DURATION", "WARNING_COUNT", "BUILD_SUCCESS",
    "METRICS_COMPUTATION_DURATION", "COUNT_COLUMNS", "P25", "P50", "P75", "IQR", "QUARTILES",
    "TOP10", "TOP10_WITH_COUNTS"]
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


def autodetect_sql_dataset_schema(project, dataset_name):
    print("Trying to detect dataset '{}' schema ...")
    dataset = project.get_dataset(dataset_name)
    dataset_settings = dataset.get_settings()
    
    dataset_detected_settings = dataset.test_and_detect()
    dataset_detected_schema = dataset_detected_settings["schemaDetection"]["detectedSchema"]["columns"]
    dataset_settings.get_raw()["schema"]["columns"] = dataset_detected_schema
    dataset_settings.save()
    print("Dataset '{}' schema detected and replaced !")
    pass


def change_python_recipe_input_datasets(project, python_recipe_name, new_input_datasets):
    print("Updating python recipe '{}' inputs ... Its new inputs will be :'{}'".format(python_recipe_name, new_input_datasets))
    recipe = project.get_recipe(python_recipe_name)
    recipe_settings = recipe.get_settings()
    
    recipe_inputs_parameters = []
    for dataset_name in new_input_datasets:
        recipe_inputs_parameters.append({'ref': dataset_name, 'deps': []})

    recipe_settings.get_recipe_raw_definition()["inputs"]["main"]["items"] = recipe_inputs_parameters
    recipe_settings.save()
    print("Updating python recipe '{}' inputs updated !".format(python_recipe_name))
    pass