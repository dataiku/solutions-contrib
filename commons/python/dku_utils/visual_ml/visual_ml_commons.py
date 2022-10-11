import pandas as pd 
from ..datasets.dataset_commons import (get_dataset_schema,
                                        extract_dataset_schema_information)
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

    :returns: ml_task_settings: dataikuapi.dss.ml.DSS[MLTaskType]MLTaskSettings: DSS MLTask settings object.
        '[MLTaskType]' varies depending on the type of MLTask (Regression, Classification, Clustering).
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
    return ml_task_settings


def enable_features_in_ml_task_settings(ml_task_settings, list_of_features_to_enable):
    """
    Enables the use of a set of features within a ML task.

    :param: ml_task_settings: dataikuapi.dss.ml.DSS[MLTaskType]MLTaskSettings: DSS MLTask settings object.
        '[MLTaskType]' varies depending on the type of MLTask (Regression, Classification, Clustering).
    :param list_of_features_to_enable: list: List of the ML task features to enable.

    :returns: ml_task_settings: dataikuapi.dss.ml.DSS[MLTaskType]MLTaskSettings: DSS MLTask settings object.
        '[MLTaskType]' varies depending on the type of MLTask (Regression, Classification, Clustering).
    """
    for feature in list_of_features_to_enable:
        ml_task_settings.use_feature(feature)
    ml_task_settings.save()
    return ml_task_settings


def reject_features_from_ml_task_settings(ml_task_settings, list_of_features_to_reject):
    """
    Rejects the use of a set of features within a ML task.

    :param: ml_task_settings: dataikuapi.dss.ml.DSS[MLTaskType]MLTaskSettings: DSS MLTask settings object.
        '[MLTaskType]' varies depending on the type of MLTask (Regression, Classification, Clustering).
    :param list_of_features_to_reject: list: List of the ML task features to reject.

    :returns: ml_task_settings: dataikuapi.dss.ml.DSS[MLTaskType]MLTaskSettings: DSS MLTask settings object.
        '[MLTaskType]' varies depending on the type of MLTask (Regression, Classification, Clustering).
    """
    for feature in list_of_features_to_reject:
        ml_task_settings.reject_feature(feature)
    ml_task_settings.save()
    return ml_task_settings


def get_models_metrics_dataframe(ml_task, list_of_model_ids):
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
    return ml_task_settings


def retrain_models_then_deploy_best_from_last_session(ml_task, metric_name, bool_greater_metric_is_better,
                                                      flow_training_recipe_name, flow_saved_model_id):
    """
    Retain models defined in a ML task in a new training session. 
        Then the model that get the bests performances in the training session is deployed 
        (DISCLAIMER: the model deployed can be different from the one already deployed in the flow).
        
    :param: ml_task_settings: dataikuapi.dss.ml.DSS[MLTaskType]MLTaskSettings: DSS MLTask settings object.
        '[MLTaskType]' varies depending on the type of MLTask (Regression, Classification, Clustering).
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
        - Classification: 
        - Clustering: {'silhouette': 'Silhouette coefficient'}
    :param bool_greater_metric_is_better: bool: Boolean parameter to precise if having a greater metric is beter.
    :param flow_training_recipe_name: str: Name of the flow model training recipe associated with the ML task.
    :param flow_saved_model_id: str: ID of the flow deployed model associated with the ML task.
    """
    # Model retrain:
    print("Model retraining ...")
    previously_trained_models_ids = ml_task.get_trained_models_ids()
    ml_task.train()
    print("Model retrained !")
    all_trained_models_ids = ml_task.get_trained_models_ids()
    print("Deploying the model having the best performances among the last trained models ...")
    last_session_models_ids = [model_id for model_id in all_trained_models_ids
                               if model_id not in previously_trained_models_ids]
    models_metrics_dataframe = get_models_metrics_dataframe(ml_task, last_session_models_ids)
    if bool_greater_metric_is_better:
        sort_metrics_ascending = False
    else:
        sort_metrics_ascending = True
    models_metrics_dataframe.sort_values(by=metric_name,
                                         ascending=sort_metrics_ascending,
                                         axis=0,
                                         inplace=True)
    models_metrics_dataframe.index = range(len(models_metrics_dataframe))
    best_model_in_last_session = models_metrics_dataframe["model_id"][0]
    
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
    last_session_id_numerical = max(all_session_ids_numerical)
    models_per_sessions_dataframe = pd.DataFrame(all_sessions_data)
    models_per_sessions_dataframe.sort_values(by="session_id_numerical", axis=0, ascending=False, inplace=True)
    models_per_sessions_dataframe["last_session_id_numerical"] = last_session_id_numerical
    models_per_sessions_dataframe.index = range(len(models_per_sessions_dataframe))
    return models_per_sessions_dataframe
