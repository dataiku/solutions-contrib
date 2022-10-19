import dataikuapi
from ..datasets.dataset_commons import create_dataset_in_connection
from ..datasets.dataset_commons import get_dataset_column_datatype


def instantiate_join_recipe(project, recipe_name, recipe_input_datasets,
                            recipe_output_dataset_name, connection_name):
    """
    Instantiates a join recipe in the flow.
    
    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param recipe_name: str: Name of the recipe.
    :param recipe_input_datasets: list: List containing all recipe input dataset names. 
    :param recipe_output_dataset_name: str: Name of the dataset that must be the recipe output.
    :param :connection_name: str: Name of the recipe output dataset connection.
    """
    print("Creating join recipe '{}' ...".format(recipe_name))
    builder = dataikuapi.JoinRecipeCreator(recipe_name, project)
    for dataset_name in recipe_input_datasets:
        builder.with_input(dataset_name)
        pass    
    create_dataset_in_connection(project, recipe_output_dataset_name, connection_name)
    builder.with_output(recipe_output_dataset_name)
    builder.build()
    print("Join recipe '{}' sucessfully created!".format(recipe_name))
    pass


def compute_join_recipe_computed_column_settings(computed_column_name, computed_column_datatype, formula_expression):
    """
    Computes the settings of a join recipe computed column, using DSS formula expressions.

    :param computed_column_name: str: Name of the computed column.
    :param computed_column_datatype: str: Datatype of the computed column.
    :param formula_expression: str: Expression of the formula leading to the computed column, following the 
        DSS formula language (https://doc.dataiku.com/dss/latest/formula/index.html).

    :returns: join_recipe_computed_column_settings: dict: Join recipe computed column settings.

    Example: 
        >>> res = compute_join_recipe_computed_column_settings('hello_world_column', 'string', 'Helloworld')
        >>> res
        {'expr': 'Helloworld',
         'mode': 'GREL',
         'name': 'hello_world_column',
         'type': 'string'}
    """
    join_recipe_computed_column_settings = {'expr': '{}'.format(formula_expression),
                                                    'mode': 'GREL',
                                                    'name': computed_column_name,
                                                    'type': computed_column_datatype}
    return join_recipe_computed_column_settings


class programmaticJoinHandler:
    """
    This class allows to programatically update DSS 'join' recipes.
    """

    def __init__(self, project, recipe_name, main_dataset_name, main_dataset_columns_to_select, main_dataset_columns_to_select_alias, main_dataset_computed_columns):
        """        
        :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
        :param recipe_name: str: Name of the recipe.
        :param main_dataset_name: str: Name of the recipe's main dataset (<-> The first dataset selected in the recipe).
        :param main_dataset_columns_to_select: list: List of the columns to retrieve from the main dataset. 
        :param main_dataset_columns_to_select_alias: dict: Can be an empty dict. Mapping between columns present in 'main_dataset_columns_to_select'
            and the alias they should have post join.
        :param main_dataset_computed_columns: list: Settings associated with the dataset's computed columns.
        """
        self.project = project
        self.recipe_settings = project.get_recipe(recipe_name).get_settings()
        self.recipe_payload = self.recipe_settings.get_json_payload()
        self.recipe_input_dataset_names = []
        self.recipe_input_datasets_virtual_input_ids = {}
        self.recipe_last_virtual_input_id = 0 # Refers to the table associated with the recipe's inputs (<-> Input dataset unique identifier). 
        self.recipe_last_join_input_id = 0 # Refers to the inputs as we see them in the "Join" and "Selected columns" (<-> The same dataset can be added several time in a join).
        self.main_dataset_name = main_dataset_name
        self.main_dataset_columns_to_select = main_dataset_columns_to_select
        self.main_dataset_columns_to_select_alias = main_dataset_columns_to_select_alias
        self.main_dataset_computed_columns = main_dataset_computed_columns
        self.initialize_recipe_settings()
        pass
    

    def initialize_recipe_inputs(self):
        """
        Initializes the recipe's inputs settings by adding its main dataset.
        """
        self.recipe_settings.data["recipe"]["inputs"]["main"]["items"] = []
        self.add_input_in_recipe(self.main_dataset_name)
        pass
    
    def initialize_recipe_virtual_inputs(self):
        """
        Initializes the recipe's virtual inputs with the virtual input associated with the main dataset.
        """
        join_recipe_virtual_input = self.compute_virtual_input(None,
                                                               False,
                                                               None,
                                                               self.main_dataset_name,
                                                               self.recipe_last_virtual_input_id,
                                                               self.main_dataset_computed_columns)
        self.recipe_input_datasets_virtual_input_ids = {self.main_dataset_name: self.recipe_last_virtual_input_id}
        self.recipe_payload["virtualInputs"] = [join_recipe_virtual_input]
        pass
    
    def initialize_joins(self):
        """
        Initializes the recipe's joins with an empty list.
        """
        self.recipe_payload["joins"] = []
    
    def initialize_selected_columns(self):
        """
        Initializes the recipe's selected columns with an empty list.
        """
        selected_columns_settings =\
        self.compute_recipe_selected_columns_settings(self.main_dataset_name,
                                                      self.main_dataset_columns_to_select,
                                                      self.main_dataset_columns_to_select_alias
                                                      )
        self.recipe_payload["selectedColumns"] = selected_columns_settings
        pass

    def initialize_post_join_computed_columns(self):
        self.recipe_payload["computedColumns"] = []
        pass

    def initialize_post_join_filter_expression(self):
        self.recipe_payload["postFilter"] = {}
        self.recipe_payload["postFilter"]["uiData"] = {}
        self.recipe_payload["postFilter"]["uiData"]["conditions"] = []
        self.recipe_payload["postFilter"]["expression"] = ""
        self.recipe_payload["postFilter"]["enabled"] = False
        pass

    def initialize_recipe_settings(self):
        """
        Initializes all recipe's settings based on the main dataset.
        """
        self.initialize_recipe_inputs()
        self.initialize_recipe_virtual_inputs()
        self.initialize_joins()
        self.initialize_selected_columns()
        self.initialize_post_join_computed_columns()
        self.initialize_post_join_filter_expression()
        pass
    
    def compute_virtual_input(self, pre_filter, bool_auto_select_columns, prefix,
                              dataset_name, virtual_index, computed_columns):
        """
        Computes the settings associated with a join recipe virtual inputs. 
            Virtual inputs directly refers to the table associated with the recipe's inputs.
        
        :param pre_filter: dict: Pre filter applied on the virtual input.
        :param bool_auto_select_columns: bool: Precise if you want to auto select join columns.
        :param prefix: str: Prefix to add to the columns of the dataset to join.
        :param dataset_name: str: Name of the dataset to join.
        :param virtual_index: int: Dataset virtual index.
        :param computed_columns: list: Settings associated with the dataset's computed columns.

        :returns: join_recipe_virtual_input: dict: A join recipe virtual input.
        """
        if (pre_filter == None) or (pre_filter == {}):
            pre_filter = {'distinct': False, 'enabled': False}
        if computed_columns == None:
            computed_columns = []
        if prefix == None:
            prefix = ''
        join_recipe_virtual_input = {'preFilter': pre_filter,
                                     'autoSelectColumns': bool_auto_select_columns,
                                     'prefix': prefix,
                                     'originLabel': dataset_name,
                                     'index': virtual_index,
                                     'computedColumns': computed_columns}
        return join_recipe_virtual_input
    
    def check_if_recipe_input_dataset_exists(self, dataset_name):
        """
        Checks if a dataset is already defined in the recipe settings inputs.

        :param dataset_name: str: Name of the dataset.

        :returns: recipe_input_dataset_exists: bool: Boolean precising if the dataset
            is already among the recipe inputs.
        """
        recipe_input_dataset_exists = (dataset_name in self.recipe_input_dataset_names)
        return recipe_input_dataset_exists

    def add_input_in_recipe(self, dataset_name):
        """
        Adds a dataset to the inputs of a recipe 

        :param dataset_name: str: Name of the dataset.
        """
        self.recipe_input_dataset_names.append(dataset_name)
        self.recipe_settings.data["recipe"]["inputs"]["main"]["items"].append(
            {'deps': [], 'ref': dataset_name}
        )
        pass

    def check_if_virtual_input_dataset_exists(self, dataset_name):
        """
        Checks if a dataset is associated with a recipe virtual input/

        :param dataset_name: str: Name of the dataset.

        :returns: recipe_virtual_input_dataset_exists: bool: Boolean precising if the dataset
            already has a virtual input.
        """
        recipe_virtual_input_dataset_exists = (dataset_name in self.recipe_input_datasets_virtual_input_ids.keys())
        return recipe_virtual_input_dataset_exists

    def update_virtual_input_ids(self, dataset_name):
        """
        Updates the class virtual input IDs. 
            Virtual inputs directly refers to the table associated with the recipe's inputs.
        
        :param dataset_name: str: Name of the dataset.
        """
        self.recipe_last_virtual_input_id += 1
        self.recipe_input_datasets_virtual_input_ids[dataset_name] = self.recipe_last_virtual_input_id
        pass

    def update_virtual_inputs(self, dataset_name, dataset_computed_columns, virtual_input_prefix):
        """
        Updates recipe virtual input settings.
        
        :param dataset_name: str: Name of the dataset.
        :param virtual_input_prefix: str: Prefix to add to the columns of the dataset to join.
        """
        dataset_virtual_input_id = self.recipe_input_datasets_virtual_input_ids[dataset_name]
        join_recipe_virtual_input = self.compute_virtual_input(None,
                                                               False,
                                                               virtual_input_prefix,
                                                               dataset_name,
                                                               dataset_virtual_input_id,
                                                               dataset_computed_columns)
        self.recipe_payload["virtualInputs"].append(join_recipe_virtual_input)
        pass

    def update_join_input_ids(self):
        """
        Updates the class join input IDs.
            Join input IDs refers to the inputs as we see them in the "Join" and "Selected columns"
            (<-> The same dataset can be added several time in a join).
        """
        self.recipe_last_join_input_id += 1
        pass

    def compute_recipe_selected_columns_settings(self, dataset_name, columns_to_select_in_dataset, columns_to_select_alias):
        """
        Computes the join settings associated with the columns we want to select 
            from a dataset to join with the main dataset.
        
        :param dataset_name: str: Name of a dataset to join.
        :param columns_to_select_in_dataset: list: List of the columns to select from the main dataset.
        :param columns_to_select_alias: dict: Can be an empty dict. Mapping between columns present in 'columns_to_select_in_dataset'
            and the alias they should have post join.

        :returns: selected_columns_settings: list: Settings defining the columns
            to select from the dataset to join.
        """
        alias_are_defined =  not ((columns_to_select_alias == {}) or (columns_to_select_alias == None))
        selected_columns_settings = []
        for column_name in columns_to_select_in_dataset:
            column_datatype = get_dataset_column_datatype(self.project,
                                                          dataset_name,
                                                          column_name)
            column_settings =  {'name': column_name,
                                'table': self.recipe_last_join_input_id,
                                'type': column_datatype}    
            if alias_are_defined:
                if column_name in columns_to_select_alias.keys():
                    column_settings['alias'] = columns_to_select_alias[column_name]
                    pass
                pass
            selected_columns_settings.append(column_settings)
        return selected_columns_settings
    
    def update_recipe_selected_columns_settings(self, selected_columns_settings):
        """
        Updates the recipe's selected columns with new settings.

        :param: selected_columns_settings: list: Settings defining the columns
            to select from a dataset to join.
        """
        self.recipe_payload["selectedColumns"] += selected_columns_settings
        pass
    
    def configure_basic_join_parameters(self, join_type, left_table_index_in_join, right_table_index_in_join,
                                        left_join_key, right_join_key):
        """
        Computes a basic join parameters.
            We talk about 'basic' parameters as we only look for a strict equality between left and right join keys.

        :param: join_type: str: Type of the join. It should be in ['LEFT', 'RIGHT'].
        :param: left_table_index_in_join: int: Index of the left table, among all the recipe joins (This is not a virtual index).
        :param: right_table_index_in_join: int: Index of the right table, among all the recipe joins (This is not a virtual index).
        :param: left_join_key: list: List containing all the columns of the left table join key.
        :param: right_join_key: list: List containing all the columns of the right table join key.

        :returns: join_parameters: dict: Settings defining the join to apply. 
        """
        ALLOWED_JOINS = ['LEFT', 'RIGHT']
        if not join_type in ALLOWED_JOINS:
            log_message = "You selected a 'join_type' equals to '{}'. Please choose a join type in '{}'.".format(join_type, ALLOWED_JOINS)
            raise Exception(log_message)
        
        n_columns_in_left_join_key = len(left_join_key)
        n_columns_in_right_join_key = len(right_join_key)
        if n_columns_in_left_join_key != n_columns_in_right_join_key:
            log_message = "Left and right join keys must have the same length.\n"\
                "Current left key contains {} columns :{}.\n"\
                "Current right key contains {} columns :{}.".format(n_columns_in_left_join_key, left_join_key,
                                                                     n_columns_in_right_join_key, right_join_key)
            raise Exception(log_message)

        join_parameters = {'conditionsMode': 'AND',
                        'rightLimit': {'maxMatches': 1, 'type': 'KEEP_LARGEST', 'enabled': False},
                        'type': join_type,
                        'outerJoinOnTheLeft': True}
        join_parameters["table1"] = left_table_index_in_join
        join_parameters["table2"] = right_table_index_in_join
        join_match_conditions = []
        for left_column, right_column in zip(left_join_key, right_join_key):
            join_match_condition = {'column1': {'name': left_column, 'table': left_table_index_in_join},
                                    'dateDiffUnit': 'DAY',
                                    'column2': {'name': right_column, 'table': right_table_index_in_join},
                                    'maxMatches': 1,
                                    'caseInsensitive': False,
                                    'maxDistance': 0,
                                    'normalizeText': False,
                                    'type': 'EQ',
                                    'strict': False}
            join_match_conditions.append(join_match_condition)
        join_parameters["on"] = join_match_conditions
        return join_parameters

    def add_one_join(self, join_type, left_join_key, right_join_key):
        """
        Adds one join in the recipe settings.
        
        :param: join_type: str: Type of the join. It should be in ['LEFT', 'RIGHT'].
        :param: left_join_key: list: List containing all the columns of the 'main/left dataset' join key.
        :param: right_join_key: list: List containing all the columns of the 'right dataset' join key.
        """
        MAIN_DATASET_JOIN_INPUT_ID = 0 # Join is all the time done on the recipe's 'main dataset'.
        join_parameters = self.configure_basic_join_parameters(join_type,
                                                               MAIN_DATASET_JOIN_INPUT_ID,
                                                               self.recipe_last_join_input_id,
                                                               left_join_key,
                                                               right_join_key)
        self.recipe_payload["joins"].append(join_parameters)
        pass    
        
    def update_recipe_definition(self):
        """
        Updates and save the join recipe's definition.
        """
        self.recipe_settings.set_json_payload(self.recipe_payload)
        self.recipe_settings.save()
        pass
    
    def add_one_join_on_main_dataset(self,
                                     dataset_to_join_name,
                                     dataset_to_join_columns_to_select,
                                     columns_to_select_alias,
                                     dataset_computed_columns,
                                     join_type,
                                     columns_prefix,
                                     left_join_key,
                                     right_join_key):
        """
        Applies all recipe settings updates in order to programatically set a join on the recipe.

        :param: dataset_to_join_name: str: Name of a dataset to join on the recipe's 'main dataset'.
        :param: dataset_to_join_columns_to_select: list: List of the columns to select from the dataset to join.
        :param: dataset_computed_columns: list: List of the computed columns for the join, as we can get using the
            function ''. 
        :param: join_type: str: Type of the join. It should be in ['LEFT', 'RIGHT'].
        :param columns_prefix: str: Prefix to add to the columns of the dataset to join.
        :param: left_join_key: list: List containing all the columns of the 'main/left dataset' join key.
        :param: right_join_key: list: List containing all the columns of the 'right dataset' join key.
        
        """
        recipe_input_dataset_exists = self.check_if_recipe_input_dataset_exists(dataset_to_join_name)
        if not recipe_input_dataset_exists:
            self.add_input_in_recipe(dataset_to_join_name)
        recipe_virtual_input_dataset_exists = self.check_if_virtual_input_dataset_exists(dataset_to_join_name)
        if not recipe_virtual_input_dataset_exists:
            self.update_virtual_input_ids(dataset_to_join_name)
        self.update_virtual_inputs(dataset_to_join_name, dataset_computed_columns, columns_prefix)
        self.update_join_input_ids()
        selected_columns_settings =\
        self.compute_recipe_selected_columns_settings(dataset_to_join_name,
                                                      dataset_to_join_columns_to_select,
                                                      columns_to_select_alias)
        self.update_recipe_selected_columns_settings(selected_columns_settings)
        self.add_one_join(join_type, left_join_key, right_join_key)
        self.update_recipe_definition()
        pass
    
    def add_post_join_computed_column(self, join_recipe_computed_column_settings):
        """
        Adds post join computed columns to the recipe's settings.

        :param: join_recipe_computed_column_settings: dict: Join recipe computed column settings,
            as we can get when using the function 'compute_join_recipe_computed_column_settings'.
        """
        self.recipe_payload["computedColumns"].append(join_recipe_computed_column_settings)
        self.update_recipe_definition()
        pass
    
    def set_post_join_filter_expression(self, post_join_filter_formula_expression):
        """
        Sets the post join rows filtering expression, with a DSS formula.
        
        :param post_join_filter_formula_expression: str: Expression of the formula leading to the computed column, following the 
        DSS formula language (https://doc.dataiku.com/dss/latest/formula/index.html).
        """
        self.recipe_payload["postFilter"]["expression"] = post_join_filter_formula_expression
        self.update_recipe_definition()
        pass
    pass
