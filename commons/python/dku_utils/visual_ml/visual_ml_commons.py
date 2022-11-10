import pandas as pd 
from ..datasets.dataset_commons import (get_dataset_schema,
                                        extract_dataset_schema_information)
import time
import re


def get_ml_task_and_settings(project, visual_analysis_id, ml_task_id):
    """
    Retrieves the settings of a project recipe

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param visual_analysis_id: str: ID of the LAB visual analysis.
    :param visual_analysis_id: str: ID of the LAB visual analysis.

    :returns: ml_task: dataikuapi.dss.ml.DSSMLTask: DSS MLTask object. 
    :returns: ml_task_settings: dataikuapi.dss.ml.DSS[MLTaskType]MLTaskSettings: DSS MLTask settings object.
        '[MLTaskType]' varies depending on the type of MLTask (Regression, Classification, Clustering).
    """
    visual_analysis = project.get_analysis(visual_analysis_id)
    ml_task = visual_analysis.get_ml_task(ml_task_id)
    ml_task_settings = ml_task.get_settings()
    return ml_task, ml_task_settings


def remove_unavailable_features_from_ml_task_features_handling(project, ml_task_settings, ml_task_dataset_name):
    """
    Updates a ML task features handling so that it does not contains settings for the features
        that are not anymore present in a dataset.

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param: ml_task_settings: dataikuapi.dss.ml.DSS[MLTaskType]MLTaskSettings: DSS MLTask settings object.
        '[MLTaskType]' varies depending on the type of MLTask (Regression, Classification, Clustering).
    :param ml_task_dataset_name: str: Name of the dataset linked with the ML task.
    """
    ml_task_dataset_schema = get_dataset_schema(project, ml_task_dataset_name)
    ml_task_dataset_columns, __ = extract_dataset_schema_information(ml_task_dataset_schema)
    print("Removing unavailable features handling from ml_task")
    new_per_feature_handling = {}
    previous_per_feature_handling = ml_task_settings.get_raw()["preprocessing"]["per_feature"]
    previously_handled_features = list(previous_per_feature_handling.keys())
    
    for column in ml_task_dataset_columns:
        if column in previously_handled_features:
            new_per_feature_handling[column] = previous_per_feature_handling[column]
    
    ml_task_settings.get_raw()["preprocessing"]["per_feature"] = new_per_feature_handling
    ml_task_settings.save()
    pass


def enable_features_in_ml_task_settings(ml_task_settings, list_of_features_to_enable):
    """
    Enables the use of a set of features within a ML task.

    :param: ml_task_settings: dataikuapi.dss.ml.DSS[MLTaskType]MLTaskSettings: DSS MLTask settings object.
        '[MLTaskType]' varies depending on the type of MLTask (Regression, Classification, Clustering).
    :param list_of_features_to_enable: list: List of the ML task features to enable.
    """
    for feature in list_of_features_to_enable:
        ml_task_settings.use_feature(feature)
    ml_task_settings.save()
    pass


def reject_features_from_ml_task_settings(ml_task_settings, list_of_features_to_reject):
    """
    Rejects the use of a set of features within a ML task.

    :param: ml_task_settings: dataikuapi.dss.ml.DSS[MLTaskType]MLTaskSettings: DSS MLTask settings object.
        '[MLTaskType]' varies depending on the type of MLTask (Regression, Classification, Clustering).
    :param list_of_features_to_reject: list: List of the ML task features to reject.
    """
    for feature in list_of_features_to_reject:
        ml_task_settings.reject_feature(feature)
    ml_task_settings.save()
    pass


def get_models_metrics_dataframe(ml_task, list_of_model_ids):
    if len(list_of_model_ids) == 0:
        log_message = "Not any model set in variable '{}'! Please check its content "\
        "or if ml_task has some trained models.".format(list_of_model_ids)
        raise Exception(log_message)
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
    ml_task_settings.save()
    pass


def get_last_session_trained_model_ids(ml_task):
    """
    Retrieves the IDs of the models trained during the last ML task session.
        
    :param: ml_task_settings: dataikuapi.dss.ml.DSS[MLTaskType]MLTaskSettings: DSS MLTask settings object.
        '[MLTaskType]' varies depending on the type of MLTask (Regression, Classification, Clustering).
    :returns: last_session_trained_model_ids: list: List of all models IDs trained in the last ML task session.
    """
    models_per_sessions_dataframe = get_models_per_sessions_dataframe(ml_task)
    models_per_sessions_dataframe = models_per_sessions_dataframe\
    [models_per_sessions_dataframe["session_id_numerical"] ==\
     models_per_sessions_dataframe["last_session_id_numerical"]]
    last_session_trained_model_ids = list(models_per_sessions_dataframe["model_id"])
    return last_session_trained_model_ids


def train_models_then_deploy_best_from_last_session(ml_task, metric_name, bool_greater_metric_is_better,
                                                    bool_compute_sub_population_analysis,
                                                    sub_population_analysis_variables,
                                                    sub_population_analysis_test_set_fraction_to_sample,
                                                    bool_compute_partial_dependencies,
                                                    partial_dependencies_variables,
                                                    partial_dependencies_test_set_fraction_to_sample,
                                                    flow_training_recipe_name, flow_saved_model_id):
    """
    Train models defined in a ML task in a new training session. 
    Then the model that get the bests performances in the training session is deployed on an existing flow model. 
    (DISCLAIMER: the model deployed can be different from the one previously deployed in the flow).
        
    :param: ml_task: dataikuapi.dss.ml.DSSMLTask: DSS MLTask object.
    :param metric_name: str: Name of the metric against which models are compared.
        Some of the native DSS metrics are:
        - Regression: {'EVS': 'Explained Variance Score',
            'MAPE': 'Mean Absolute Percentage Error',
            'MAE': 'Mean Absolute Error',
            'MSE': 'Mean Squared Error',
            'RMSE': 'Root Mean Square Error',
            'RMSLE': 'Root Mean Square Logarithmic Error',
            'R2': 'R2 Score',
            'CUSTOM': 'Custom code'}
        - Classification: {'F1': 'F1 score', 
            'ACCURACY': 'Accuracy',
            'PRECISION': 'Precision',
            'RECALL': 'Recall',
            'COST_MATRIX': 'Cost matrix',
            'AUC': 'Area Under the Curve',
            'LOG_LOSS': 'Log loss',
            'CUMULATIVE_LIFT': 'Cumulative lift',
            'CUSTOM': 'Custom code'}
        - Clustering: {'silhouette': 'Silhouette coefficient'}
    :param bool_greater_metric_is_better: bool: Boolean parameter to precise if having a greater metric is beter.
    :param: bool_compute_sub_population_analysis: bool: Parameter precising if a Subpopulation analysis must be
        computed on the model test set, before it is deployed.
    :param: sub_population_analysis_variables: list: List of the features on which the subpopulation analysis
        must be computed.
    :param: sub_population_analysis_test_set_fraction_to_sample: double: Fraction/percent (Value must be in ]0, 1] !)
        of the trained model test set to use in the Subpopulation analysis computation.
    :param: bool_compute_partial_dependencies: bool: Parameter precising if a Partial dependencies must be
        computed on the model test set, before it is deployed.
    :param: partial_dependencies_variables: list: List of the features on which the partial dependencies
        must be computed.
    :param: partial_dependencies_test_set_fraction_to_sample: double: Fraction/percent (Value must be in ]0, 1] !)
        of the trained model test set to use in the Partial dependencies computation.
    :param flow_training_recipe_name: str: Name of the flow model training recipe associated with the ML task.
    :param flow_saved_model_id: str: ID of the flow deployed model associated with the ML task.
    """
    # Model retrain:
    print("Models training ...")
    previously_trained_models_ids = ml_task.get_trained_models_ids()
    train_start_time = time.time()
    ml_task.train()
    train_end_time = time.time()
    print("Models trained !")
    models_training_duration = (train_end_time - train_start_time) / 60.0
    print("Models train duration : {} min ...\n".format(models_training_duration))
    all_trained_models_ids = ml_task.get_trained_models_ids()
    print("Looking for the model having the best performances among the last trained models ...")
    last_session_models_ids = [model_id for model_id in all_trained_models_ids
                               if model_id not in previously_trained_models_ids]
    models_metrics_dataframe = get_models_metrics_dataframe(ml_task, last_session_models_ids)
    if bool_greater_metric_is_better:
        sort_metrics_ascending = False
    else:
        sort_metrics_ascending = True
    try:
        models_metrics_dataframe.sort_values(by=metric_name, ascending=sort_metrics_ascending,
                                             axis=0, inplace=True)
    except KeyError:
        models_metrics_dataframe.sort_values(by=metric_name.lower(), ascending=sort_metrics_ascending,
                                             axis=0, inplace=True)
        
    models_metrics_dataframe.index = range(len(models_metrics_dataframe))
    best_model_in_last_session = models_metrics_dataframe["model_id"][0]
    print("Best model is '{}'!".format(best_model_in_last_session))
    if bool_compute_sub_population_analysis:
        if len(sub_population_analysis_variables) > 0:
            compute_sub_population_analysis(ml_task, best_model_in_last_session, sub_population_analysis_variables,
                                            sub_population_analysis_test_set_fraction_to_sample)
        else:
            print("Subpopulation analysis has not been computed because no variables were set in 'sub_population_analysis_variables'!")

    if bool_compute_partial_dependencies:
        if len(partial_dependencies_variables) > 0:
            compute_partial_dependencies(ml_task, best_model_in_last_session, partial_dependencies_variables,
                                         partial_dependencies_test_set_fraction_to_sample)
        else:
            print("Partial dependencies has not been computed because no variables were set in 'partial_dependencies_variables'!")
    print("Deploying the best model ...")
    ml_task.redeploy_to_flow(model_id=best_model_in_last_session,
                             recipe_name=flow_training_recipe_name,
                             saved_model_id=flow_saved_model_id,
                             activate=True)
    print("Model with the best performances has been deployed!")
    pass


def get_models_per_sessions_dataframe(ml_task):
    """
    Retrieves a pandas DataFrame containing relations between trained models and their sessions IDs.
        
    :param: ml_task_settings: dataikuapi.dss.ml.DSS[MLTaskType]MLTaskSettings: DSS MLTask settings object.
        '[MLTaskType]' varies depending on the type of MLTask (Regression, Classification, Clustering).
    :returns: models_per_sessions_dataframe: pandas.core.frame.DataFrame: Pandas DataFrame
        containing relations between trained models and their sessions IDs.
    """
    SESSION_INDEX_IN_MODEL_ID = 4
    all_trained_model_ids = ml_task.get_trained_models_ids()
    all_sessions_data = []
    all_session_ids_numerical = []
    for model_id in all_trained_model_ids:
        model_session_id = model_id.split('-')[SESSION_INDEX_IN_MODEL_ID]
        model_session_id_numerical = int(re.sub('s', '', model_session_id))
        all_session_ids_numerical.append(model_session_id_numerical)
        all_sessions_data.append({"session_id": model_session_id,
                                  "session_id_numerical": model_session_id_numerical,
                                  "model_id": model_id})
    if len(all_session_ids_numerical) > 0:
        last_session_id_numerical = max(all_session_ids_numerical)
        models_per_sessions_dataframe = pd.DataFrame(all_sessions_data)
        models_per_sessions_dataframe.sort_values(by="session_id_numerical", axis=0, ascending=False, inplace=True)
        models_per_sessions_dataframe["last_session_id_numerical"] = last_session_id_numerical
        models_per_sessions_dataframe.index = range(len(models_per_sessions_dataframe))
    else:
        models_per_sessions_dataframe = pd.DataFrame(columns=["session_id", "session_id_numerical",
                                                              "model_id", "last_session_id_numerical"])
    return models_per_sessions_dataframe


def get_ml_task_best_model_id(ml_task, list_of_model_ids, metric_name, bool_greater_metric_is_better):
    """
    Retrieves the model ID that get the best performance in the ML task.
    
    :param: ml_task_settings: dataikuapi.dss.ml.DSS[MLTaskType]MLTaskSettings: DSS MLTask settings object.
        '[MLTaskType]' varies depending on the type of MLTask (Regression, Classification, Clustering).
    :param: list_of_model_ids: list: List of trained model IDs.
    :param metric_name: str: Name of the metric against which models are compared.
        Some of the native DSS metrics are:
        - Regression: {'EVS': 'Explained Variance Score',
            'MAPE': 'Mean Absolute Percentage Error',
            'MAE': 'Mean Absolute Error',
            'MSE': 'Mean Squared Error',
            'RMSE': 'Root Mean Square Error',
            'RMSLE': 'Root Mean Square Logarithmic Error',
            'R2': 'R2 Score',
            'CUSTOM': 'Custom code'}
        - Classification: {'F1': 'F1 score', 
            'ACCURACY': 'Accuracy',
            'PRECISION': 'Precision',
            'RECALL': 'Recall',
            'COST_MATRIX': 'Cost matrix',
            'AUC': 'Area Under the Curve',
            'LOG_LOSS': 'Log loss',
            'CUMULATIVE_LIFT': 'Cumulative lift',
            'CUSTOM': 'Custom code'} 
        - Clustering: {'silhouette': 'Silhouette coefficient'}
    :param bool_greater_metric_is_better: bool: Boolean parameter to precise if having a greater metric is beter.
    :returns: ml_task_best_model str: Model ID from 'list_of_model_ids' that get the best performance in the ML task.
    """
    models_metrics_dataframe = get_models_metrics_dataframe(ml_task, list_of_model_ids)
    if bool_greater_metric_is_better:
        sort_metrics_ascending = False
    else:
        sort_metrics_ascending = True
    models_metrics_dataframe.sort_values(by=metric_name,
                                         ascending=sort_metrics_ascending,
                                         axis=0,
                                         inplace=True)
    models_metrics_dataframe.index = range(len(models_metrics_dataframe))
    ml_task_best_model = models_metrics_dataframe["model_id"][0]
    return ml_task_best_model


def get_trained_model_test_set_size(ml_task, trained_model_id):
    """
    Retrieves the test set size of a ML task trained model.

    :param: ml_task: dataikuapi.dss.ml.DSSMLTask: DSS MLTask object.
    :param: trained_model_id: str: ID of the ML task trained model.
    :returns: model_test_set_size int: Model's test set size.
    """
    model_details = ml_task.get_trained_model_details(trained_model_id)
    model_test_set_size = model_details.details["splitDesc"]["testRows"]
    return model_test_set_size


def compute_sub_population_analysis(ml_task, trained_model_id, sub_population_analysis_variables,
                                    test_set_fraction_to_sample):
    """
    Computes a Subpopulation analysis on a ML task trained model test set.

    :param: ml_task: dataikuapi.dss.ml.DSSMLTask: DSS MLTask object.
    :param: trained_model_id: str: ID of the ML task trained model.
    :param: sub_population_analysis_variables: list: List of the features on which the subpopulation analysis
        must be computed.
    :param: test_set_fraction_to_sample: double: Fraction/percent (Value must be in ]0, 1] !)
        of the trained model test set to use in the Subpopulation analysis computation.
    """
    if (test_set_fraction_to_sample < 0) or (test_set_fraction_to_sample > 1):
        log_message = "Parameter '{}' must be in ]0, 1] ! Please update it.".format(test_set_fraction_to_sample)
        raise Exception(log_message)
    print("Computing the subpopulation analysis (model_id = '{}') on the test set, with variables '{}'\n"\
        .format(trained_model_id, sub_population_analysis_variables))
    sub_population_analysis_start_time = time.time()
    model_test_set_size = get_trained_model_test_set_size(ml_task, trained_model_id)
    sample_size_in_sub_population_analysis = int(model_test_set_size * test_set_fraction_to_sample)
    model_details = ml_task.get_trained_model_details(trained_model_id)
    model_details.compute_subpopulation_analyses(split_by=sub_population_analysis_variables,
                                                 wait=True,
                                                 sample_size=sample_size_in_sub_population_analysis,
                                                 n_jobs=-1)
    sub_population_analysis_end_time = time.time()
    print("Subpopulation analysis computed!\n")
    sub_population_analysis_duration = (sub_population_analysis_end_time - sub_population_analysis_start_time) / 60.0
    print("Subpopulation analysis computation time : {} min ...\n".format(sub_population_analysis_duration))
    pass


def compute_partial_dependencies(ml_task, trained_model_id, partial_dependencies_variables,
                                 test_set_fraction_to_sample):
    """
    Computes a Partial dependencies on a ML task trained model test set.

    :param: ml_task: dataikuapi.dss.ml.DSSMLTask: DSS MLTask object.
    :param: trained_model_id: str: ID of the ML task trained model.
    :param: partial_dependencies_variables: list: List of the features on which the partial dependencies
        must be computed.
    :param: test_set_fraction_to_sample: double: Fraction/percent (Value must be in ]0, 1] !)
        of the trained model test set to use in the Subpopulation analysis computation.
    """
    if (test_set_fraction_to_sample < 0) or (test_set_fraction_to_sample > 1):
        log_message = "Parameter '{}' must be in ]0, 1] ! Please update it.".format(test_set_fraction_to_sample)
        raise Exception(log_message)
    print("Computing the partial depencencies (model_id = '{}') on the test set, with variables '{}'\n"\
          .format(trained_model_id, partial_dependencies_variables))
    partial_dependencies_start_time = time.time()
    model_test_set_size = get_trained_model_test_set_size(ml_task, trained_model_id)
    sample_size_in_partial_dependencies = int(model_test_set_size * test_set_fraction_to_sample)
    model_details = ml_task.get_trained_model_details(trained_model_id)
    model_details.compute_partial_dependencies(partial_dependencies_variables,
                                               wait=True,
                                               sample_size=sample_size_in_partial_dependencies,
                                               n_jobs=-1)
    partial_dependencies_end_time = time.time()
    print("Partial depencencies computed!\n")
    partial_dependencies_duration = (partial_dependencies_end_time - partial_dependencies_start_time) / 60.0
    print("Partial depencencies computation time : {} min ...\n".format(partial_dependencies_duration))
    pass
  
  
  def get_deployed_model_active_version_id(project, deployed_model_id):
    """
    Retrieves the ID of the active model within a deployed model .
    
    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param: deployed_model_id: str: ID of the deployed model.
    :returns model_active_version_id: str: ID of the active version within the deployed model.
    """
    deployed_model = project.get_saved_model(deployed_model_id)
    model_active_version_id = model.get_active_version()["id"]
    return model_active_version_id
