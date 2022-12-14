from .filesystem.connection_change import (
    switch_managed_dataset_connection_to_cloud_storage,
    change_filesystem_dataset_format,
    change_filesystem_dataset_path,
    change_folder_path,
    switch_managed_folder_connection, 
    switch_managed_dataset_connection_to_local_filesytem_storage,
)
from .sql.connection_change import (
    switch_managed_dataset_connection_to_sql,
    change_sql_dataset_table,
    autodetect_sql_dataset_schema,
)
from ..datasets.dataset_commons import (
    get_dataset_in_connection_settings,
    infer_and_update_dataset_schema,
    update_dataset_varchar_limit,
    change_dataset_managed_state,
)
from ..flow.flow_commons import get_all_flow_dataset_names, get_all_flow_folder_names
from ..recipes.sync_recipe import sync_dataset_to_connection


class FlowConnectionsHandler:
    """
    Handles flow connection changes for both datasets and folders.
    """

    # SQL storages:
    ALLOWED_SQL_STORAGES = ["PostgreSQL", "Snowflake", "SQLServer"]
    ALLOWED_CLOUD_PROVIDERS_SQL_STORAGES = ["Redshift", "BigQuery"]
    # Filesystem storages:
    ALLOWED_CLOUD_PROVIDERS_FILESYSTEM_STORAGES = ["Azure", "S3", "GCS"]
    CLOUD_PROVIDERS_SQL_DATABASES_FILESYSTEM_STORAGES = {"Redshift": "S3", "Synapse": "Azure", "BigQuery": "GCS"}
    # All allowed storages:
    ALL_ALLOWED_SQL_STORAGES = ALLOWED_SQL_STORAGES + ALLOWED_CLOUD_PROVIDERS_SQL_STORAGES
    ALL_ALLOWED_FILESYSTEM_STORAGES = ["Filesystem"] + ALLOWED_CLOUD_PROVIDERS_FILESYSTEM_STORAGES
    ALL_ALLOWED_CONNECTIONS = ALL_ALLOWED_SQL_STORAGES + ALL_ALLOWED_FILESYSTEM_STORAGES
    CONNECTIONS_VARCHAR_LIMITS = {
        "Azure": 4000,
        "BigQuery":419000,
        "Filesystem": 419000,
        "GCS": 419000,
        "PostgreSQL": 419000,
        "Redshift": 65000,
        "Snowflake": 419000,
        "SQLServer": 419000,
        "S3": 65000,
    }
    # File formats:
    ALLOWED_FILESYSTEM_STORAGES_FILE_FORMATS = ["csv", "parquet"]
    DEFAULT_FILESYSTEM_STORAGES_FILE_FORMAT = "csv"

    def __init__(
        self,
        project,
        main_connection_name,
        fallback_connection_name,
        input_datasets,
        input_datasets_to_preserve,
        fallback_connection_datasets,
        fallback_connection_datasets_downstream_recipes,
        input_folders,
        bool_change_computed_folders_connections,
        folders_connection_name,
        project_folders_to_preserve,
    ):
        """
        :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
        
        
        :param main_connection_name: str: Name of the main connection to use in the flow.
        
        :param fallback_connection_name: str: Name of the fallback connection to use in the flow.
            Fallback connection is only used when 'main_connection_name' has a type in ['Redshift', 'Synapse', or 'BigQuery']
        
        :param input_datasets: list: List of all dataset names that are the flow inputs. All datasets within this list
            that are not in 'input_datasets_to_preserve' will have their connection changed toward 'main_connection_name'.
        
        :param input_datasets_to_preserve: list: List of all dataset names that are the flow inputs and should NOT 
            have their connections changed.
        
        :param fallback_connection_datasets: list: List of all dataset names that need to be stored in the 'fallback_connection_name'
            dued to DSS performances when writing in 'main_connection_name'.
            All datasets resulting from python processes (python recipes, score/evaluate/apply) should by default be in this list. 
            Datasets in this list that need downstream recipes to leverage 'main_connection_name' engine will be automatically 
            connected to sync recipes that will synchronize them from 'fallback_connection_name' toward 'main_connection_name'.
        
        :param fallback_connection_datasets_downstream_recipes: dict: Mapping of all recipes connected to datasets mentioned in 
            'fallback_connection_datasets' that need downstream recipes to leverage 'main_connection_name'. 
            This mapping allows to replace original datasets (stored in 'fallback_connection_name') 
            by datasets resulting from the sync recipes (stored in 'main_connection_name').

            Example: fallback_connection_datasets_downstream_recipes =  {'dataset_x': ['recipe_with_dataset_x_as_input_1', 'recipe_with_dataset_x_as_input_2'],
                                                                         'dataset_y': ['recipe_with_dataset_y_as_input'],
                                                                         'dataset_z': ['recipe_with_dataset_z_as_input_1', 'recipe_with_dataset_z_as_input_2', recipe_with_dataset_z_as_input_3]}
        
        
        :param input_folders: list: List of all folder names that are the flow inputs. All folder within this list
            that are not in 'project_folders_to_preserve' will have their connection changed toward 'folders_connection'.
        
        :param bool_change_computed_folders_connections: bool: Precise if computed folders need to have their connection changed.

        :param folders_connection: str: Name of the connection to use in the flow for folders.
        
        :param project_folders_to_preserve: list: List of all folder names that should NOT have their connections changed.
        """
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
        self.flow_has_input_folders = len(input_folders) > 0
        self.bool_change_computed_folders_connections = bool_change_computed_folders_connections
        self.folders_connection_name = folders_connection_name
        self.folders_connection_settings = None
        self.folders_connection_type = None

        self.load_connections_information()
        self.check_connections_compatibility()

        self.fallback_connection_datasets = fallback_connection_datasets
        self.fallback_connection_datasets_downstream_recipes = fallback_connection_datasets_downstream_recipes

        project_datasets = get_all_flow_dataset_names(project)
        self.dataset_with_connections_to_be_changed = [
            dataset for dataset in project_datasets if dataset not in input_datasets_to_preserve
        ]

        self.datasets_that_should_be_not_managed = [
            dataset for dataset in input_datasets if dataset not in input_datasets_to_preserve
        ]

        self.datasets_that_should_be_managed = [
            dataset
            for dataset in self.dataset_with_connections_to_be_changed
            if dataset not in self.datasets_that_should_be_not_managed
        ]

        all_project_folders = get_all_flow_folder_names(project)
        main_connection_from_a_cloud_provider = (
            self.main_connection_type in self.ALLOWED_CLOUD_PROVIDERS_SQL_STORAGES
        ) or (self.main_connection_type in self.ALLOWED_CLOUD_PROVIDERS_FILESYSTEM_STORAGES)

        if main_connection_from_a_cloud_provider:
            self.bool_change_computed_folders_connections = True

        self.folders_with_connections_to_be_changed = [
            folder for folder in all_project_folders if folder not in project_folders_to_preserve
        ]
        pass

    def load_connections_information(self):
        """
        Loads all connection information:
            - Connection types.
            - Connection settings.
            - Connection varchar limits. 
        """
        print("Loading connections information ...")
        if self.main_connection_name is None:
            log_message = "You can't use FlowConnectionsHandler without defining 'main_connection_name'"
            raise Exception(log_message)
        else:
            self.main_connection_settings = get_dataset_in_connection_settings(self.project, self.main_connection_name)
            self.main_connection_type = self.main_connection_settings["type"]
            self.main_connection_varchar_limit = self.CONNECTIONS_VARCHAR_LIMITS[self.main_connection_type]

        if self.fallback_connection_name is not None:
            self.fallback_connection_settings = get_dataset_in_connection_settings(
                self.project, self.fallback_connection_name
            )
            self.fallback_connection_type = self.fallback_connection_settings["type"]
            self.fallback_connection_varchar_limit = self.CONNECTIONS_VARCHAR_LIMITS[self.fallback_connection_type]

        if self.flow_has_input_folders:
            self.folders_connection_settings = get_dataset_in_connection_settings(
                self.project, self.folders_connection_name
            )
            self.folders_connection_type = self.folders_connection_settings["type"]
        pass

    def check_connections_compatibility(self):
        """
        Checks that connections can be used.
        """
        print("Checking connections compatibility ...")
        connection_names = [self.main_connection_name, self.fallback_connection_name, self.folders_connection_name]
        connection_types = [self.main_connection_type, self.fallback_connection_type, self.folders_connection_type]
        for connection_name, connection_type in zip(connection_names, connection_types):
            if connection_type is not None:
                if connection_type not in self.ALL_ALLOWED_CONNECTIONS:
                    log_message = (
                        "Connection '{}' is of type '{}' that is not compatible with FlowConnectionsHandler,"
                        " please use a connection in '{}'".format(
                            connection_name, connection_type, self.ALL_ALLOWED_CONNECTIONS
                        )
                    )
                    raise Exception(log_message)
        if self.main_connection_type in self.ALLOWED_CLOUD_PROVIDERS_SQL_STORAGES:
            compatible_fallback_connection_type = self.CLOUD_PROVIDERS_SQL_DATABASES_FILESYSTEM_STORAGES[
                self.main_connection_type
            ]
            if compatible_fallback_connection_type != self.fallback_connection_type:
                log_message = (
                    "Your main connection ('{}') being of type '{}', you must have a fallback filesystem "
                    "connection of type '{}'.\n Actual fallback filesystem connection ('{}') is of type '{}'".format(
                        self.main_connection_name,
                        self.main_connection_type,
                        compatible_fallback_connection_type,
                        self.fallback_connection_name,
                        self.fallback_connection_type,
                    )
                )
                raise Exception(log_message)
        print("Connections compatibility checked !")
        pass

    def switch_flow_datasets_connections(self, managed_datasets_write_file_format=None):
        """
        Changes flow datasets connections, based on the parameters set in:
            - 'main_connection_name'
            - 'fallback_connection_name'
            - 'input_datasets'
            - 'input_datasets_to_preserve'
            - 'fallback_connection_datasets'
        
        :param managed_datasets_write_file_format: str: File format of the managed datasets, with a value in 
            'ALLOWED_FILESYSTEM_STORAGES_FILE_FORMATS'.
        """
        print("Switching all flow datasets connections ...")
        if managed_datasets_write_file_format is None:
            managed_datasets_write_file_format = self.DEFAULT_FILESYSTEM_STORAGES_FILE_FORMAT
        for dataset_name in self.dataset_with_connections_to_be_changed:
            # First all datasets are set to 'managed' state:
            change_dataset_managed_state(self.project, dataset_name, True)
            print("Currently changing dataset '{}' connection ...".format(dataset_name))
            if self.main_connection_type in self.ALLOWED_SQL_STORAGES:
                adapt_table_namings = True
                switch_managed_dataset_connection_to_sql(
                    self.project, dataset_name, self.main_connection_name, adapt_table_namings
                )
                update_dataset_varchar_limit(self.project, dataset_name, self.main_connection_varchar_limit)
                pass

            elif self.main_connection_type in self.ALLOWED_CLOUD_PROVIDERS_SQL_STORAGES:
                if dataset_name not in self.fallback_connection_datasets:
                    adapt_table_namings = True
                    switch_managed_dataset_connection_to_sql(self.project, dataset_name, self.main_connection_name, adapt_table_namings)
                    update_dataset_varchar_limit(self.project, dataset_name, self.main_connection_varchar_limit)
                else:
                    switch_managed_dataset_connection_to_cloud_storage(self.project, dataset_name, self.fallback_connection_name)
                    update_dataset_varchar_limit(self.project, dataset_name, self.fallback_connection_varchar_limit)

            elif self.main_connection_type in self.ALLOWED_CLOUD_PROVIDERS_FILESYSTEM_STORAGES:
                switch_managed_dataset_connection_to_cloud_storage(self.project, dataset_name, self.main_connection_name)
                update_dataset_varchar_limit(self.project, dataset_name, self.main_connection_varchar_limit)
                if dataset_name in self.datasets_that_should_be_managed:
                    change_filesystem_dataset_format(self.project, dataset_name, managed_datasets_write_file_format)
            
            elif self.main_connection_type == "Filesystem":
                switch_managed_dataset_connection_to_local_filesytem_storage(self.project, dataset_name, self.main_connection_name)
                update_dataset_varchar_limit(self.project, dataset_name, self.main_connection_varchar_limit)
                if dataset_name in self.datasets_that_should_be_managed:
                    change_filesystem_dataset_format(self.project, dataset_name, managed_datasets_write_file_format)
                    
            else:
                log_message = ("Your main connection ('{}') has connection type '{}' that is not compatible with"
                " 'FlowConnectionsHandler'.".format(self.main_connection_name, self.main_connection_type))
                raise Exception(log_message)
        print("Flow datasets connections switched !")
        pass

    def switch_flow_folders_connections(self):
        """
        Changes flow folders connections, based on the parameters set in:
            - 'input_folders'
            - 'bool_change_computed_folders_connections'
            - 'folders_connection_name'
            - 'project_folders_to_preserve'
        """
        if self.bool_change_computed_folders_connections:
            if self.main_connection_type in self.ALLOWED_CLOUD_PROVIDERS_SQL_STORAGES:
                computed_folders_connection = self.fallback_connection_name
            elif self.main_connection_type in self.ALLOWED_CLOUD_PROVIDERS_FILESYSTEM_STORAGES:
                computed_folders_connection = self.main_connection_name
            else:
                computed_folders_connection = self.folders_connection_name
            print("Switching flow folders connections ...")
            for folder_name in self.folders_with_connections_to_be_changed:
                if folder_name not in self.input_folders:
                    print("Switching computed folder '{}' connection toward '{}' ...".format(folder_name, computed_folders_connection))
                    switch_managed_folder_connection(self.project, folder_name, computed_folders_connection)
            print("All flow computed folders connections switched !")

        if self.flow_has_input_folders:
            for folder_name in self.input_folders:
                print(
                    "Switching input folder '{}' connection toward '{}' ...".format(
                        folder_name, self.folders_connection_name
                    )
                )
                switch_managed_folder_connection(
                    self.project, folder_name, self.folders_connection_name
                )
            print("All flow input folders connections switched !")
        pass

    def switch_input_datasets_to_not_managed_sate(self):
        """
        Forces all flow input datasets to be 'not managed'.
        """
        print(
            "Switching flow input datasets to 'not managed' state. Concerned datasets are: {}".format(
                self.datasets_that_should_be_not_managed
            )
        )
        for dataset_name in self.datasets_that_should_be_not_managed:
            change_dataset_managed_state(self.project, dataset_name, False)
        print("Flow input dataset switched to not managed state !")
        pass

    def adapt_flow_to_fast_path(self):
        """
        Adapts the flow to fast path based on parameters:
        - 'fallback_connection_datasets'
        - 'fallback_connection_datasets_downstream_recipes'

        All datasets present in 'fallback_connection_datasets' and with a reference in
        'fallback_connection_datasets_downstream_recipes' will be used as input of sync recipes synchronizing them 
        toward 'main_connection'. Then, recipes that used these dataset as inputs will be connected to the outputs of the sync recipes.
        """
        for fallback_connection_dataset in self.fallback_connection_datasets:
            use_fast_path = (
                fallback_connection_dataset in self.fallback_connection_datasets_downstream_recipes.keys()
            ) and (self.main_connection_type in self.ALLOWED_CLOUD_PROVIDERS_SQL_STORAGES)
            if use_fast_path:
                sync_dataset_to_connection(self.project, fallback_connection_dataset, self.main_connection_name)
                synced_dataset_name = "{}_synced".format(fallback_connection_dataset)
                downstream_recipe_names = self.fallback_connection_datasets_downstream_recipes[
                    fallback_connection_dataset
                ]
                for downstream_recipe_name in downstream_recipe_names:
                    downstream_project_recipe = self.project.get_recipe(downstream_recipe_name)
                    downstream_project_recipe_settings = downstream_project_recipe.get_settings()
                    if self.main_connection_type in self.ALLOWED_CLOUD_PROVIDERS_SQL_STORAGES:
                        print(
                            "Adapting flow structure to fast path ..."
                            " Datasets '{}' will be synced using path  '{}' ('{}') -->  '{}' ('{}') !".format(
                                self.fallback_connection_datasets,
                                self.fallback_connection_name,
                                self.fallback_connection_type,
                                self.main_connection_name,
                                self.main_connection_type,
                            )
                        )
                        downstream_project_recipe_settings.replace_input(
                            fallback_connection_dataset, synced_dataset_name
                        )

                        update_dataset_varchar_limit(
                            self.project, fallback_connection_dataset, self.fallback_connection_varchar_limit
                        )
                        update_dataset_varchar_limit(
                            self.project, synced_dataset_name, self.main_connection_varchar_limit
                        )
                    else:
                        downstream_project_recipe_settings.replace_input(
                            synced_dataset_name, fallback_connection_dataset
                        )
                    downstream_project_recipe_settings.save()
                    pass
                pass
            pass
        pass

    def connect_flow_input_datasets(self, datasets_to_tables_or_paths_mapping, input_datasets_read_file_format=None):
        """
        Connects all flow input datasets to the tables or paths where to find their data.

        :param datasets_to_tables_or_paths_mapping: dict: Mapping between project dataset names and the table/path of their datasource, 
            in the 'main_connection'.
            Examples:
                - {'input_dataset_1': 'table_1', 'input_dataset_2': 'table_2'}
                - {'input_dataset_1': 'path/to/input_dataset_1_data', 'input_dataset_2': 'path/to/input_dataset_2_data'}
        
        :param input_datasets_read_file_format: str: File format of the input datasets, with a value in 
            'ALLOWED_FILESYSTEM_STORAGES_FILE_FORMATS'.
        """

        if input_datasets_read_file_format is None:
            input_datasets_read_file_format = self.DEFAULT_FILESYSTEM_STORAGES_FILE_FORMAT
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
                            log_message = "Please check the syntax of the table associated to dataset'{}'. ".format(
                                dataset_name
                            )
                            log_message += "\nGet name '{}' that seems to not exist in your connection).".format(
                                table_or_path_associated_with_dataset
                            )
                            raise Exception(log_message)

                    elif self.main_connection_type in self.ALL_ALLOWED_FILESYSTEM_STORAGES:
                        change_filesystem_dataset_path(self.project, dataset_name, table_or_path_associated_with_dataset)
                        change_filesystem_dataset_format(self.project, dataset_name, input_datasets_read_file_format)
                        try:
                            infer_and_update_dataset_schema(self.project, dataset_name, self.main_connection_name)
                        except:
                            log_message = "Please check the syntax of the path associated to dataset '{}'. ".format(
                                dataset_name
                            )
                            log_message += "\nGet name '{}' that seems to not exist in your connection).".format(
                                table_or_path_associated_with_dataset
                            )
                            raise Exception(log_message)

                else:
                    log_message = (
                        "Please fill the name of the table/path associated to dataset'{}': "
                        "It is currently empty".format(dataset_name)
                    )
                    raise Exception(log_message)
        print("Flow input datasets ingested !")
        pass

    def connect_flow_input_folders(self, folders_names_to_paths_mapping):
        """
        Connects all flow input folders to the paths where to find their data.

        :param folders_names_to_paths_mapping: dict: Mapping between project folder names and the paths of their datasource, 
            in the 'folders_connection_name'.
            Example: {'input_folder_1': 'path/to/input_folder_1_data', 'input_folder_2': 'path/to/input_folder_2_data'}
        """
        for folder_name in folders_names_to_paths_mapping.keys():
            folder_path = folders_names_to_paths_mapping[folder_name]
            if len(folder_path) > 0:
                change_folder_path(self.project, folder_name, folder_path)
            else:
                log_message = (
                    "Please fill the name of the path associated to folder'{}': "
                    "It is currently empty".format(folder_name)
                )
                raise Exception(log_message)

        print("Flow input folders ingested !")
        pass
    pass
