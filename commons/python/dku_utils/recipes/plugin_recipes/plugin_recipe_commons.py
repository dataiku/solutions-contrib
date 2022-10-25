from dataikuapi.dss.recipe import SingleOutputRecipeCreator

from ..recipe_commons import get_recipe_settings_and_dictionary
from ...datasets.dataset_commons import create_dataset_in_connection
from ...folders.folder_commons import create_managed_folder_in_connection, get_managed_folder_id


def update_plugin_recipe_parameters(project, recipe_name, recipe_parameters):
    """
    Updates the parameters of a plugin recipe.

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param :recipe_name: str: Name of the plugin recipe.
    :param :recipe_parameters: dict: Parameters of the recipe.
    """
    recipe_settings, recipe_settings_dict = get_recipe_settings_and_dictionary(project, recipe_name, True)
    recipe_settings_dict["params"]["customConfig"] = recipe_parameters
    recipe_settings.recipe_settings = recipe_settings_dict
    recipe_settings.save()
    pass


class PluginRecipeHandler():
    """
    Allows to instanciate plugin recipes programmatically.
    """
    
    ALLOWED_PLUGIN_RECIPE_TYPES = [
        "CustomCode_recommendation-system-auto-collaborative-filtering",
        "CustomCode_timeseries-forecast-1-train-evaluate"
    ]
    
    def __init__(self, project, plugin_recipe_type, recipe_name, plugin_input_references_mapping, plugin_output_references_mapping,
                 input_dataset_names, output_dataset_names, datasets_connection_name, input_folder_names, output_folder_names, folders_connection_name):
        """
        :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
        :param plugin_recipe_type: str: Type of plugin recipe to instanciate, as we can get it with:
            project.get_recipe(RECIPE_NAME).get_settings().recipe_settings["type"]
        :param :recipe_name: str: Name of the recipe to create.
        :param :plugin_input_references_mapping: dict: Dictionary containing the mapping between recipe input datasources (dataset or folder NAMES) and 
            the input references expected by the plugin recipe. Expected plugin recipe input references can be found with: 
            project.get_recipe(RECIPE_NAME).get_settings().recipe_settings["inputs"].
                Example: Use case is a plugin recipe applying dimensionality reduction on input data. 
                    - Plugin recipe expects a 'dataset_to_reduce_dimensionality' as an input reference.
                    - Plugin recipe will be connected to an input dataset from my flow named 'input_dataset_from_my_flow'.
                    --> So we will have plugin_input_references_mapping =  {'input_dataset_from_my_flow': 'dataset_to_reduce_dimensionality'}
        :param :plugin_output_references_mapping: dict: Dictionary containing the mapping between recipe output datasets and 
            the output references expected by the plugin recipe. Expected plugin recipe input references can be found with: 
            project.get_recipe(RECIPE_NAME).get_settings().recipe_settings["outputs"].
                Example: Use case is a plugin recipe applying dimensionality reduction on input data. 
                    - Plugin recipe is supposed to have 'dataset_with_reduced_dimensionality' as an output reference.
                    - Plugin recipe will generate an output dataset in the flow named 'output_dataset_from_my_flow'.
                    --> So we will have plugin_output_references_mapping =  {'output_dataset_from_my_flow': 'dataset_with_reduced_dimensionality'}
        :param :input_dataset_names: list: List containing all recipe input dataset names.
        :param :output_dataset_names: list: List containing all recipe output dataset names.
        :param :datasets_connection_name: str: Name of the recipe output datasets connection.
        :param :input_folder_names: list: List containing all recipe input folder NAMES.
        :param :output_folder_names: list: List containing all recipe output folder NAMES.
        :param :folders_connection_name: str: Name of the recipe output folders connection.
        """
        
        if plugin_recipe_type not in self.ALLOWED_PLUGIN_RECIPE_TYPES:
            log_message = "Plugin recipes of type '{}' are not allowed! Please use a type"\
            " in '{}'".format(plugin_recipe_type, self.ALLOWED_PLUGIN_RECIPE_TYPES)
            raise Exception(log_message)
        
        current_project_recipes = [information['name'] for information in project.list_recipes()]
        if recipe_name in current_project_recipes:
            log_message = "Recipe '{}' already exists! Please change the value of the parameter 'recipe_name'.".format(recipe_name)
            raise Exception(log_message)

        self.project = project
        self.plugin_recipe_type = plugin_recipe_type
        self.recipe_name = recipe_name
        self.plugin_input_references_mapping = plugin_input_references_mapping
        self.plugin_output_references_mapping = plugin_output_references_mapping
        self.input_dataset_names = input_dataset_names
        self.output_dataset_names = output_dataset_names
        self.datasets_connection_name = datasets_connection_name
        self.input_folder_names = input_folder_names
        self.output_folder_names = output_folder_names
        self.folders_connection_name = folders_connection_name
        self.plugin_recipe_builder = None
        self.plugin_recipe = None
        pass
    
    def check_datasources_references_consistency(self):
        """
        Checks that there are no inconsistencies between:
            - 'input_dataset_names' and input dataset referenced in 'plugin_input_references_mapping'.
            - 'output_dataset_names' and input dataset referenced in 'plugin_output_references_mapping'.
            - 'input_folder_names' and folder NAMES referenced in 'plugin_input_references_mapping'.
            - 'output_folder_names' and folder NAMES referenced in 'plugin_output_references_mapping'.
        Raises an exception if any inconsistency is met.
        """
        inconsistency_met = False
        error_message = "Some inconsistencies have been detected during instantiation:\n"
        for input_dataset_name in self.input_dataset_names:
            if input_dataset_name not in self.plugin_input_references_mapping.keys():
                inconsistency_met = True
                error_message += "- Dataset '{}' plugin reference is not defined in parameter 'plugin_input_references_mapping'\n".format(input_dataset_name)
        for input_folder_name in self.input_folder_names:
            if input_folder_name not in self.plugin_input_references_mapping.keys():
                inconsistency_met = True
                error_message += "- Folder '{}' plugin reference is not defined in parameter 'plugin_input_references_mapping'\n".format(input_folder_name)
        for output_dataset_name in self.output_dataset_names:
            if output_dataset_name not in self.plugin_output_references_mapping.keys():
                inconsistency_met = True
                error_message += "- Dataset '{}' plugin reference is not defined in parameter 'plugin_output_references_mapping'\n".format(output_dataset_name)
        for output_folder_name in self.output_folder_names:
            if output_folder_name not in self.plugin_output_references_mapping.keys():
                inconsistency_met = True
                error_message += "- Folder '{}' plugin reference is not defined in parameter 'plugin_output_references_mapping'\n".format(output_folder_name)
        
        for input_datasource_name in self.plugin_input_references_mapping.keys():
            if ((input_datasource_name not in self.input_dataset_names) and (input_datasource_name not in self.input_folder_names)):
                inconsistency_met = True
                error_message += "- Datasource '{}' plugin reference is defined in parameter 'plugin_output_references_mapping' but not in parameters 'input_dataset_names' or 'input_folder_names'.\n".format(input_datasource_name)
        for output_datasource_name in self.plugin_output_references_mapping.keys():
            if ((output_datasource_name not in self.output_dataset_names) and (output_datasource_name not in self.output_folder_names)):
                inconsistency_met = True
                error_message += "- Datasource '{}' plugin reference is defined in parameter 'plugin_output_references_mapping' but not in parameters 'output_dataset_names' or 'output_folder_names'.\n".format(output_datasource_name)
        
        if inconsistency_met:
            error_message += "\nCurrent parameters are:"
            error_message += "\n - input_dataset_names={}".format(self.input_dataset_names)
            error_message += "\n - input_folder_names={}".format(self.input_folder_names)
            error_message += "\n - output_dataset_names={}".format(self.output_dataset_names)
            error_message += "\n - output_folder_names={}".format(self.output_folder_names)
            raise Exception(error_message)
        pass

    def create_plugin_recipe(self):
        """
        Creates the plugin recipe.
        """
        self.plugin_recipe_builder = SingleOutputRecipeCreator(type=self.plugin_recipe_type,
                                                               name=self.recipe_name,
                                                               project=self.project)
        self.plugin_recipe = self.plugin_recipe_builder.build()
        pass

    def load_plugin_settings(self):
        """
        Loads the DSS Settings and settings dictionary associated with the plugin recipe.
        """
        self.plugin_settings, self.plugin_settings_dict = get_recipe_settings_and_dictionary(self.project, self.recipe_name, True)
        pass

    def create_plugin_recipe_flow_outputs(self):
        """
        Creates the plugin recipe's outputs in the flow.
        """
        for dataset_name in self.output_dataset_names:
            create_dataset_in_connection(self.project, dataset_name, self.datasets_connection_name)
            pass
        for managed_folder_name in self.output_folder_names :
            create_managed_folder_in_connection(self.project, managed_folder_name, self.folders_connection_name)
            pass
        pass
    
    def update_plugin_settings(self):
        """
        Updates the plugin recipe's setting.
        """
        self.plugin_settings.recipe_settings = self.plugin_settings_dict
        self.plugin_settings.save()
        pass

    def connect_recipe_to_flow_inputs(self):
        """
        Connects the plugin recipe with its flow inputs.
        """
        recipe_input_settings = {}
        for dataset_name in self.input_dataset_names:
            plugin_reference = self.plugin_input_references_mapping[dataset_name]
            recipe_input_settings[plugin_reference] = {'items': [{'ref': dataset_name, 'deps': []}]}
        
        for managed_folder_name in self.input_folder_names:
            plugin_reference = self.plugin_input_references_mapping[managed_folder_name]
            managed_folder_id = get_managed_folder_id(self.project, managed_folder_name)
            recipe_input_settings[plugin_reference] = {'items': [{'ref': managed_folder_id, 'deps': []}]}
        self.plugin_settings_dict["inputs"] = recipe_input_settings
        self.update_plugin_settings()
        pass

    def connect_recipe_to_flow_outputs(self):
        """
        Connects the plugin recipe with its flow outputs.
        """
        recipe_output_settings = {}
        for dataset_name in self.output_dataset_names:
            plugin_reference = self.plugin_output_references_mapping[dataset_name]
            recipe_output_settings[plugin_reference] = {'items': [{'ref': dataset_name, 'appendMode': False}]}
        
        for managed_folder_name in self.output_folder_names:
            plugin_reference = self.plugin_output_references_mapping[managed_folder_name]
            managed_folder_id = get_managed_folder_id(self.project, managed_folder_name)
            recipe_output_settings[plugin_reference] = {'items': [{'ref': managed_folder_id, 'appendMode': False}]}
        self.plugin_settings_dict["outputs"] = recipe_output_settings
        self.update_plugin_settings()
        pass

    def instantiate_plugin_recipe(self):
        """
        Instantiates the plugin recipe and connects it to its flow dependencies.
        """
        print("Creating plugin recipe '{}' (recipe of type '{}')...".format(self.recipe_name, self.plugin_recipe_type))
        self.check_datasources_references_consistency()
        self.create_plugin_recipe()
        self.load_plugin_settings()
        self.create_plugin_recipe_flow_outputs()
        self.connect_recipe_to_flow_inputs()
        self.connect_recipe_to_flow_outputs()
        print("Plugin recipe '{}' sucessfully created!".format(self.recipe_name))
        print("Please don't forget to set its parameters with method 'PluginRecipeInstantiator.set_recipe_parameters()'.")
        pass

    def set_recipe_parameters(self, recipe_parameters):
        """
        Set the parameters used by the plugin recipe.
        :param :recipe_parameters: dict: Dictionary containing the mapping between plugin recipe parameters and the values they must have.
            Parameters can be get on a plugin recipe with project.get_recipe(RECIPE_NAME).get_settings().recipe_settings["params"]["customConfig"]
            format = {
                'plugin_first_parameter_name': PLUGIN_FIRST_PARAMETER_VALUE,
                'plugin_second_parameter_name': PLUGIN_SECOND_PARAMETER_VALUE
                }
        """
        self.plugin_settings_dict["params"]["customConfig"] = recipe_parameters
        self.update_plugin_settings()
        pass
