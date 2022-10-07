import pandas as pd 


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