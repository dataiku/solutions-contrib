import dataikuapi
import dataiku
import pandas as pd
import re
import hashlib


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


def switch_managed_dataset_connection_to_sql(project, dataset_name, connection_name, bool_use_project_key_for_table_naming):
    dataset = project.get_dataset(dataset_name)
    dataset_settings = dataset.get_settings()
    dataset_connection_settings = get_dataset_in_connection_settings(connection_name)
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


def change_sql_dataset_table(project, dataset_name, table_name):
    dataset = project.get_dataset( dataset_name )
    dataset_settings = dataset.get_settings()
    dataset_settings.settings["params"]["table"] = table_name
    dataset_settings.save()
    pass


def change_filesystem_dataset_path(project, dataset_name, path):
    dataset = project.get_dataset(dataset_name)
    dataset_settings = dataset.get_settings()
    dataset_settings.settings["params"]["path"] = path
    dataset_settings.save()
    pass
    

def change_folder_path(project, folder_name, path):
    folder_id = get_managed_folder_id_with_folder_name(project, folder_name)
    folder = project.get_managed_folder(folder_id)
    folder_definition = folder.get_definition()
    folder_definition["params"]["path"] = path
    folder.set_definition(folder_definition)
    pass    
    

def change_filesystem_dataset_format(project, dataset_name, new_dataset_format):
    ALLOWED_FORMATS = ["csv", "parquet"]
    if new_dataset_format not in ALLOWED_FORMATS:
        log_message = "File format '{}' is not supported by this function, please "\
        "choose a format in '{}'".format(new_dataset_format, ALLOWED_FORMATS)
        raise Exception(log_message)
    dataset = project.get_dataset(dataset_name)
    dataset_settings = dataset.get_settings()
    previous_format = dataset_settings.settings["formatType"]
    print("Switching dataset '{}' format from '{}' to '{}' ...".format(dataset_name,
                                                                       previous_format,
                                                                       new_dataset_format))
    dataset_settings.settings["formatType"] = new_dataset_format
    dataset_settings.save()
    print("Dataset format '{}' switched".formatdataset_name())
    pass


def switch_not_managed_dataset_connection_to_cloud_storage(project, dataset_name, connection_name, dataset_path_in_connection):
    """
    Change a DSS NOT managed dataset connection toward a clould storage connection.
    Connection must have a type in ['S3', 'Azure'].
    """
    ALLOWED_CLOUD_STORAGES = ["S3", "Azure"]
    dataset = project.get_dataset(dataset_name)
    dataset_settings = dataset.get_settings()
    dataset_is_managed = dataset_settings.settings["managed"]
    
    if dataset_is_managed:
        log_message = "Dataset '{}' is a DSS managed dataset.\n"\
        "You can't use this function to change its connection".format(dataset_name)
        raise Exception(log_message)
        
    dataset_connection_settings = get_dataset_in_connection_settings(connection_name)
    dataset_connection_settings["managed"] = False
    connection_type = dataset_connection_settings["type"]
    
    if connection_type not in ALLOWED_CLOUD_STORAGES:
        log_message = "Connection '{}' is of type '{}' that is not allowed by this function.\n"\
        "Allowed connection types are '{}'".format(connection_name, connection_type, ALLOWED_CLOUD_STORAGES)
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


def get_dataset_in_connection_settings(connection_name):
    project, variables = get_current_project_and_variables()
    tmp_dataset_name = "dataset_for_connection_settings_extraction"
    tmp_recipe_name = "compute_{}".format(tmp_dataset_name)
    print("Creating temporary dataset and with 'dataikuapi' recipes builder...")
    builder = dataikuapi.CodeRecipeCreator(tmp_recipe_name, "python", project)
    builder = builder.with_new_output_dataset(tmp_dataset_name, connection_name)
    #tmp_recipe = builder.build() #fails without "DATA_SCIENTIST" profile
    print("Temporary dataset ! \nExtracting connection settings from temporary dataset...")
    tmp_dataset = project.get_dataset(tmp_dataset_name)
    dataset_in_connection_settings = tmp_dataset.get_settings().settings
    #print("Connection settings extracted from temporary dataset! \nRemoving temporary dataset and recipe...") #fails without "DATA_SCIENTIST" profile
    #tmp_recipe.delete() #fails without "DATA_SCIENTIST" profile
    tmp_dataset.delete()
    print("Temporary dataset removed!")
    return dataset_in_connection_settings


def switch_managed_dataset_connection_to_cloud_storage(project, dataset_name, connection_name):
    """
    Change a DSS managed dataset connection toward a clould storage connection.
    Connection must have a type in ['S3', 'Azure'].
    """
    ALLOWED_CLOUD_STORAGES = ["S3", "Azure"]
    dataset = project.get_dataset(dataset_name)
    dataset_settings = dataset.get_settings()
    dataset_is_managed = dataset_settings.settings["managed"]
    
    if not dataset_is_managed:
        log_message = "Dataset '{}' is not a DSS managed dataset.\n"\
        "You can't use this function to change its connection".format(dataset_name)
        raise Exception(log_message)
        
    dataset_connection_settings = get_dataset_in_connection_settings(connection_name)
    connection_type = dataset_connection_settings["type"]
    
    if connection_type not in ALLOWED_CLOUD_STORAGES:
        log_message = "Connection '{}' is of type '{}' that is not allowed by this function.\n"\
        "Allowed connection types are '{}'".format(connection_name, connection_type, ALLOWED_CLOUD_STORAGES)
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
    Change a DSS managed folder connection toward a clould storage connection.
    Connection must have a type in ['S3', 'Azure'].
    """
    ALLOWED_CLOUD_STORAGES = ["S3", "Azure"]
    
    folder_id = get_managed_folder_id_with_folder_name(project, folder_name)
    folder = project.get_managed_folder(folder_id)
    folder_definition = folder.get_definition()
    
    dataset_connection_settings = get_dataset_in_connection_settings(connection_name)
    connection_type = dataset_connection_settings["type"]
    
    if connection_type not in ALLOWED_CLOUD_STORAGES:
        log_message = "Connection '{}' is of type '{}' that is not allowed by this function.\n"\
        "Allowed connection types are '{}'".format(connection_name, connection_type, ALLOWED_CLOUD_STORAGES)
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


def infer_and_update_dataset_schema(project, dataset_name, connection_name):
    dataset = project.get_dataset(dataset_name)
    dataset_settings = dataset.get_settings()

    tmp_dataset_name = "{}_for_schema_inference".format(dataset_name)
    tmp_recipe_name = "compute_{}".format(tmp_dataset_name)
    
    print("Creating temporary prepare recipe '{}' and dataset '{}'"\
          " for infering dataset '{}' schema ...".format(tmp_recipe_name, tmp_dataset_name, dataset_name))
    tmp_dataset = project.get_dataset(tmp_dataset_name)
    tmp_recipe = dataikuapi.dss.recipe.SingleOutputRecipeCreator('shaker', tmp_recipe_name, project)
    tmp_recipe.with_input(dataset_name)
    tmp_recipe.with_new_output(name=tmp_dataset_name, connection_id=connection_name)
    tmp_recipe.build()
    
    tmp_dataset_infered_schema = get_dataset_schema(project, tmp_dataset_name)
    dataset_settings.settings["schema"]["columns"] = tmp_dataset_infered_schema
    dataset_settings.save()
    print("Dataset '{}' schema successfully inferred!".format(dataset_name))
    print("Removing temporary prepare recipe '{}' and dataset '{}'...".format(tmp_recipe_name, tmp_dataset_name))
    
    project.get_recipe(tmp_recipe_name).delete()
    tmp_dataset.delete()
    print("Temporary prepare recipe '{}' and dataset '{}' removed!".format(tmp_recipe_name, tmp_dataset_name))
    pass


def update_dataset_varchar_limit(project, dataset_name, new_varchar_limit):
    new_dataset_schema_information = []
    dataset = project.get_dataset(dataset_name)
    dataset_settings = dataset.get_settings()
    dataset_schema_information = dataset_settings.settings["schema"]["columns"]
    for schema_information in dataset_schema_information:
        column_datatype = schema_information["type"]
        if column_datatype == "string":
            schema_information["maxLength"] = new_varchar_limit
        new_dataset_schema_information.append(schema_information)
    dataset_settings.settings["schema"]["columns"] = new_dataset_schema_information
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


def change_group_recipe_concatenation(project, recipe_name, column_name, bool_activate_concatenation, separator):
    recipe = project.get_recipe(recipe_name)
    recipe_settings = recipe.get_settings()
    recipe_payload = recipe_settings.get_json_payload()
    recipe_aggregations = recipe_payload["values"]
    
    recipe_new_aggregations = []
    for column_aggregation in recipe_aggregations:
        column_of_interest = column_aggregation["column"]
        if column_of_interest == column_name:
            column_aggregation["concat"] = bool_activate_concatenation
            column_aggregation["concatSeparator"] = separator
        recipe_new_aggregations.append(column_aggregation)
    recipe_payload["values"] = recipe_new_aggregations
    recipe_settings.set_json_payload(recipe_payload)
    recipe_settings.save()
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
    dataset_connection_type = get_dataset_connection_type(project, dataset_name)
    dataset = project.get_dataset(dataset_name)
    dataset_settings = dataset.get_settings()
    dataset_settings.settings["managed"] = bool_should_be_managed_state
    
    if bool_should_be_managed_state:
        if dataset_connection_type == "Redshift":
            dataset_settings.settings["params"]["distributionStyle"] = "AUTO" #["AUTO", "EVEN", "ALL"]
            dataset_settings.settings["params"]["sortKey"] = "NONE" #["NONE", "COMPOUND", "INTERLEAVED"]
            dataset_settings.settings["params"]["sortKeyColumns"] = [] #Should be a list of dataset columns if 'sortKey' != None
            
    dataset_settings.save()
    pass


def compute_sql_table_name(project, connection_type, dataset_name):    
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
        log_message = "connection_type '{}' is not usable in this function. Allowed connection types are: {}".format(connection_type, list(CONNECTIONS_TABLE_NAMES_LIMIT.keys()))
        raise Exception(log_message)
    return sql_table_name


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


def get_all_project_folders_names(project):
    project_folders_data = project.list_managed_folders()
    project_folders_names = [folder_information["name"] for folder_information in project_folders_data]
    return project_folders_names


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
    print("Trying to detect dataset '{}' schema ...".format(dataset_name))
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


def sync_dataset_to_connection(project, recipe_input_dataset_name, connection_name):
    recipe_name = "compute_{}_synced".format(recipe_input_dataset_name)
    recipe_output_dataset_name = "{}_synced".format(recipe_input_dataset_name)
    project_recipe_output_dataset = project.get_dataset(recipe_output_dataset_name)
    sync_recipe_has_not_been_created = not project_recipe_output_dataset.exists()
    if sync_recipe_has_not_been_created:
        print("Recipe syncing dataset '{}' in connection '{}' does not exists and will be created ...".format(recipe_input_dataset_name, connection_name))
        builder = dataikuapi.SyncRecipeCreator(recipe_name, project)
        builder = builder.with_input(recipe_input_dataset_name)
        builder = builder.with_new_output(recipe_output_dataset_name, connection_name)
        recipe = builder.build()
        print("Recipe '{}' created!".format(recipe_name))
    else:
        print("Recipe syncing dataset '{}' in connection '{}' already exists!".format(recipe_input_dataset_name, connection_name))
    pass


def update_and_run_sync_recipe(project, recipe_name):
    sync_recipe = project.get_recipe(recipe_name)
    recipe = project.get_recipe(recipe_name)
    recipe_settings = recipe.get_settings()

    recipe_input_dataset_name = recipe_settings.get_flat_input_refs()[0]
    recipe_output_dataset_name = recipe_settings.get_flat_output_refs()[0]

    recipe_input_dataset = project.get_dataset(recipe_input_dataset_name)
    recipe_input_dataset_settings = recipe_input_dataset.get_settings()
    recipe_input_dataset_schema_columns = recipe_input_dataset_settings.settings["schema"]["columns"]

    recipe_output_dataset_name = project.get_dataset(recipe_output_dataset_name)
    recipe_output_dataset_name_settings = recipe_output_dataset_name.get_settings()
    recipe_output_dataset_name_settings.settings["schema"]["columns"] = recipe_input_dataset_schema_columns
    recipe_output_dataset_name_settings.save()
    sync_recipe.run()
    pass


class FlowConnectionsHandler:
    # SQL storages:
    ALLOWED_SQL_STORAGES = ["Snowflake", "PostgreSQL"]
    ALLOWED_CLOUD_PROVIDERS_SQL_STORAGES = ["Redshift"]
    # Filesystem storages:
    ALLOWED_CLOUD_PROVIDERS_FILESYSTEM_STORAGES = ["S3", "Azure"]
    DEFAULT_FILESYSTEM_STORAGES_FORMAT_TYPE = "csv"
    CLOUD_PROVIDERS_SQL_DATABASES_FILESYSTEM_STORAGES = {"Redshift": "S3", "Synapse": "Azure"}
    # All allowed storages:
    ALL_ALLOWED_SQL_STORAGES = ALLOWED_SQL_STORAGES + ALLOWED_CLOUD_PROVIDERS_SQL_STORAGES
    ALL_ALLOWED_CONNECTIONS = ALLOWED_SQL_STORAGES + ALLOWED_CLOUD_PROVIDERS_SQL_STORAGES + \
                              ALLOWED_CLOUD_PROVIDERS_FILESYSTEM_STORAGES + ALLOWED_CLOUD_PROVIDERS_FILESYSTEM_STORAGES
    CONNECTIONS_VARCHAR_LIMITS = {
        "Snowflake": 419000,
        "Redshift": 65000,
        "S3": 65000,
        "PostgreSQL": 419000,
        "SQLServer": 419000,
        "Filesystem": 419000,
        "Azure": 4000
    }

    def __init__(self, project, main_connection_name, fallback_connection_name, input_datasets,
                 input_datasets_to_preserve, fallback_connection_datasets,
                 fallback_connection_datasets_downstream_recipes, input_folders, input_folders_connection,
                 project_folders_to_preserve):
        """connections_scenario"""
        self.project = project
        self.main_connection_name = main_connection_name
        self.main_connection_settings = None
        self.main_connection_type = None
        self.main_connection_varchar_limit = None
        if fallback_connection_name is not None:
            self.fallback_connection_name = fallback_connection_name
        else:
            self.fallback_connection_name = None
        self.fallback_connection_settings = None
        self.fallback_connection_type = None
        self.fallback_connection_varchar_limit = None
        self.flow_should_be_adapted_to_fast_path = False
        
        self.input_folders = input_folders
        self.flow_has_input_folders = (len(input_folders) > 0)
        self.input_folders_connection_name = input_folders_connection
        self.input_folders_connection_settings = None
        self.input_folders_connection_type = None
        
        self.load_connections_information()
        self.check_connections_compatibility()

        self.fallback_connection_datasets = fallback_connection_datasets
        self.fallback_connection_datasets_downstream_recipes = fallback_connection_datasets_downstream_recipes

        project_datasets = get_all_projects_datasets(project)
        self.dataset_with_connections_to_be_changed = \
        [dataset for dataset in project_datasets if dataset not in input_datasets_to_preserve]
        
        self.datasets_that_should_be_not_managed = \
        [dataset for dataset in input_datasets if dataset not in input_datasets_to_preserve]
        
        self.datasets_that_should_be_managed = \
        [dataset for dataset in self.dataset_with_connections_to_be_changed if dataset not in self.datasets_that_should_be_not_managed]
        
        all_project_folders = get_all_project_folders_names(project)
        main_connection_from_a_cloud_provider =\
        ((self.main_connection_type in self.ALLOWED_CLOUD_PROVIDERS_SQL_STORAGES) or
         (self.main_connection_type in self.ALLOWED_CLOUD_PROVIDERS_FILESYSTEM_STORAGES))
        
        if main_connection_from_a_cloud_provider:
            self.bool_change_folders_connections = True
        else:
            self.bool_change_folders_connections = False
        
        self.folders_with_connections_to_be_changed = \
            [folder for folder in all_project_folders if folder not in project_folders_to_preserve]
        pass

    def load_connections_information(self):
        print("Loading connections information ...")
        if self.main_connection_name is None:
            log_message = "You can't use FlowConnectionsHandler without defining 'main_connection_name'"
            raise Exception(log_message)
        else:
            self.main_connection_settings = get_dataset_in_connection_settings(self.main_connection_name)
            self.main_connection_type = self.main_connection_settings["type"]
            self.main_connection_varchar_limit = self.CONNECTIONS_VARCHAR_LIMITS[self.main_connection_type]

        if self.fallback_connection_name is not None:
            self.fallback_connection_settings = \
                get_dataset_in_connection_settings(self.fallback_connection_name)
            self.fallback_connection_type = self.fallback_connection_settings["type"]
            self.fallback_connection_varchar_limit = \
                self.CONNECTIONS_VARCHAR_LIMITS[self.fallback_connection_type]
        
        if self.flow_has_input_folders:
            self.input_folders_connection_settings = get_dataset_in_connection_settings(self.input_folders_connection_name)
            self.input_folders_connection_type = self.input_folders_connection_settings["type"]
        pass

    def check_connections_compatibility(self):
        print("Checking connections compatibility ...")
        connection_names = [self.main_connection_name, self.fallback_connection_name, self.input_folders_connection_name]
        connection_types = [self.main_connection_type, self.fallback_connection_type, self.input_folders_connection_type]
        for connection_name, connection_type in zip(connection_names, connection_types):
            if connection_type is not None:
                if connection_type not in self.ALL_ALLOWED_CONNECTIONS:
                    log_message = "Connection '{}' is of type '{}' that is not compatible with FlowConnectionsHandler,"\
                                  " please use a connection in '{}'".format(connection_name, connection_type,
                                                                            self.ALL_ALLOWED_CONNECTIONS)
                    raise Exception(log_message)
        if self.main_connection_type in self.ALLOWED_CLOUD_PROVIDERS_SQL_STORAGES:
            compatible_fallback_connection_type = \
                self.CLOUD_PROVIDERS_SQL_DATABASES_FILESYSTEM_STORAGES[self.main_connection_type]
            if compatible_fallback_connection_type != self.fallback_connection_type:
                log_message = "Your main connection ('{}') being of type '{}', you must have a fallback filesystem " \
                              "connection of type '{}'.\n Actual fallback filesystem connection ('{}') is of type '{}'"\
                    .format(self.main_connection_name, self.main_connection_type,
                            compatible_fallback_connection_type, self.fallback_connection_name,
                            self.fallback_connection_type)
                raise Exception(log_message)
        print("Connections compatibility checked !")
        pass

    def switch_flow_datasets_connections(self, managed_datasets_writing_format=None):
        print("Switching all flow datasets connections ...")

        for dataset_name in self.dataset_with_connections_to_be_changed:
            # First all datasets are set to 'managed' state:
            change_dataset_managed_state(self.project, dataset_name, True)
            print("Currently changing dataset '{}' connection ...".format(dataset_name))
            if self.main_connection_type in self.ALLOWED_SQL_STORAGES:
                adapt_table_namings = True
                switch_managed_dataset_connection_to_sql(self.project, dataset_name, self.main_connection_name,
                                                         adapt_table_namings)
                update_dataset_varchar_limit(self.project, dataset_name, self.main_connection_varchar_limit)
                pass

            elif self.main_connection_type in self.ALLOWED_CLOUD_PROVIDERS_SQL_STORAGES:
                if dataset_name not in self.fallback_connection_datasets:
                    adapt_table_namings = True
                    switch_managed_dataset_connection_to_sql(self.project, dataset_name, self.main_connection_name,
                                                             adapt_table_namings)
                    update_dataset_varchar_limit(self.project, dataset_name, self.main_connection_varchar_limit)
                else:
                    switch_managed_dataset_connection_to_cloud_storage(self.project, dataset_name,
                                                                       self.fallback_connection_name)
                    update_dataset_varchar_limit(self.project, dataset_name, self.fallback_connection_varchar_limit)

            elif self.main_connection_type in self.ALLOWED_CLOUD_PROVIDERS_FILESYSTEM_STORAGES:
                switch_managed_dataset_connection_to_cloud_storage(self.project, dataset_name,
                                                                   self.main_connection_name)
                update_dataset_varchar_limit(self.project, dataset_name, self.main_connection_varchar_limit)
                if managed_datasets_writing_format is not None:
                    if dataset_name in self.datasets_that_should_be_managed:
                        change_filesystem_dataset_format(self.project, dataset_name, managed_datasets_writing_format)
            else:
                log_message = "Your main connection ('{}') has connection type '{}' that is not compatible with" \
                              " FlowConnectionsHandler.".format(self.main_connection_name, self.main_connection_type)
                raise Exception(log_message)
        print("Flow datasets connections switched !")
        pass

    def switch_flow_folders_connections(self):
        if self.bool_change_folders_connections:
            folders_connection_should_be_changed = False
            folders_connection = None
            if self.main_connection_type in self.ALLOWED_CLOUD_PROVIDERS_SQL_STORAGES:
                computed_folders_connection_should_be_changed = True
                computed_folders_connection = self.fallback_connection_name
            elif self.main_connection_type in self.ALLOWED_CLOUD_PROVIDERS_FILESYSTEM_STORAGES:
                computed_folders_connection_should_be_changed = True
                computed_folders_connection = self.main_connection_name
            if computed_folders_connection_should_be_changed:
                print("Switching flow folders connections ...")
                for folder_name in self.folders_with_connections_to_be_changed:
                    if folder_name not in self.input_folders:
                        print("Switching computed folder '{}' connection toward '{}' ...".format(folder_name, computed_folders_connection))
                        switch_managed_folder_connection_to_cloud_storage(self.project, folder_name, computed_folders_connection)
                print("All flow computed folders connections switched !")
            
        if self.flow_has_input_folders:
            for folder_name in self.input_folders:
                print("Switching input folder '{}' connection toward '{}' ...".format(folder_name, self.input_folders_connection_name))
                switch_managed_folder_connection_to_cloud_storage(self.project, folder_name, self.input_folders_connection_name)
            print("All flow input folders connections switched !")
        pass

    def switch_input_datasets_to_not_managed_sate(self):
        print("Switching flow input datasets to 'not managed' state. Concerned datasets are: {}"\
              .format(self.datasets_that_should_be_not_managed))
        for dataset_name in self.datasets_that_should_be_not_managed:
            change_dataset_managed_state(self.project, dataset_name, False)
        print("Flow input dataset switched to not managed state !")
        pass

    def adapt_flow_to_fast_path(self):
        for fallback_connection_dataset in self.fallback_connection_datasets:
            use_fast_path =\
                ((fallback_connection_dataset in self.fallback_connection_datasets_downstream_recipes.keys())
                 and (self.main_connection_type in self.ALLOWED_CLOUD_PROVIDERS_SQL_STORAGES))
            if use_fast_path:
                sync_dataset_to_connection(self.project, fallback_connection_dataset, self.main_connection_name)
                synced_dataset_name = "{}_synced".format(fallback_connection_dataset)
                downstream_recipe_names =\
                    self.fallback_connection_datasets_downstream_recipes[fallback_connection_dataset]
                for downstream_recipe_name in downstream_recipe_names:
                    downstream_project_recipe = self.project.get_recipe(downstream_recipe_name)
                    downstream_project_recipe_settings = downstream_project_recipe.get_settings()
                    if self.main_connection_type in self.ALLOWED_CLOUD_PROVIDERS_SQL_STORAGES:
                        print("Adapting flow structure to fast path ..." \
                              " Datasets '{}' will be synced using path  '{}' ('{}') -->  '{}' ('{}') !" \
                              .format(self.fallback_connection_datasets, self.fallback_connection_name,
                                      self.fallback_connection_type, self.main_connection_name,
                                      self.main_connection_type))
                        downstream_project_recipe_settings.replace_input(fallback_connection_dataset,
                                                                         synced_dataset_name)

                        update_dataset_varchar_limit(self.project, fallback_connection_dataset,
                                                     self.fallback_connection_varchar_limit)
                        update_dataset_varchar_limit(self.project, synced_dataset_name,
                                                     self.main_connection_varchar_limit)
                    else:
                        downstream_project_recipe_settings.replace_input(synced_dataset_name,
                                                                         fallback_connection_dataset)
                    downstream_project_recipe_settings.save()
                    pass
                pass
            pass
        pass

    def ingest_flow_input_datasets(self, datasets_to_tables_or_paths_mapping, input_datasets_reading_format=None):
        print("Ingesting flow datasources ...")
        for dataset_name in self.datasets_that_should_be_not_managed:
            if dataset_name in datasets_to_tables_or_paths_mapping.keys():
                table_or_path_associated_with_dataset = datasets_to_tables_or_paths_mapping[dataset_name]
                if len(table_or_path_associated_with_dataset) > 0:
                    if self.main_connection_type in self.ALL_ALLOWED_SQL_STORAGES:
                        change_sql_dataset_table(self.project, dataset_name, table_or_path_associated_with_dataset)
                        try:
                            autodetect_sql_dataset_schema(self.project, dataset_name)
                        except:
                            log_message = "Please check the syntax of the table associated to dataset'{}'. "\
                                .format(dataset_name)
                            log_message += "\nGet name '{}' that seems to not exist in your connection).".format(
                                table_or_path_associated_with_dataset)
                            raise Exception(log_message)

                    elif self.main_connection_type in self.ALLOWED_CLOUD_PROVIDERS_FILESYSTEM_STORAGES:
                        change_filesystem_dataset_path(self.project, dataset_name, table_or_path_associated_with_dataset)
                        if input_datasets_reading_format is not None:
                            change_filesystem_dataset_format(self.project, dataset_name, input_datasets_reading_format)
                        try:
                            infer_and_update_dataset_schema(self.project, dataset_name, self.main_connection_name)
                        except:
                            log_message = "Please check the syntax of the path associated to dataset '{}'. " \
                                .format(dataset_name)
                            log_message += "\nGet name '{}' that seems to not exist in your connection).".format(
                                table_or_path_associated_with_dataset)
                            raise Exception(log_message)

                else:
                    log_message = "Please fill the name of the table/path associated to dataset'{}': "\
                        "It is currently empty".format(dataset_name)
                    raise Exception(log_message)
        print("Flow input datasets ingested !")
        pass
    
    def ingest_flow_input_folders(self, folders_names_to_paths_mapping):
        for folder_name in folders_names_to_paths_mapping.keys():
            folder_path = folders_names_to_paths_mapping[folder_name]
            if len(folder_path) > 0:
                change_folder_path(self.project, folder_name, folder_path)
            else:
                log_message = "Please fill the name of the path associated to folder'{}': "\
                "It is currently empty".format(folder_name)
                raise Exception(log_message)
                
        print("Flow input folders ingested !")
        pass
    pass
