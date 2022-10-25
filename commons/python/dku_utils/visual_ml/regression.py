def update_ml_task_regression_metric(ml_task_settings, regression_metric):
    """
    Updates the optimization metric set in a ml_task regression model.
    :param ml_task_settings: dataikuapi.dss.ml.DSSRegressionMLTaskSettings: DSS MLTask settings object.
    :param regression_metric: str: Regression metric to set. It must be in 
        ["EVS", "MAPE", "MAE", "MSE", "RMSE", "RMSLE", "R2", "CUSTOM"]
        With: 
        - "EVS": "Explained Variance Score"
        - "MAPE": "Mean Absolute Percentage Error",
        - "MAE": "Mean Absolute Error"
        - "MSE": "Mean Squared Error"
        - "RMSE": "Root Mean Square Error"
        - "RMSLE": "Root Mean Square Logarithmic Error"
        - "R2": "R2 Score"
        - "CUSTOM": "Custom code"
    """
    ALLOWED_REGRESSION_METRICS = ["EVS", "MAPE", "MAE", "MSE", "RMSE", "RMSLE", "R2", "CUSTOM"]
    if regression_metric not in ALLOWED_REGRESSION_METRICS:
        log_message = "You can't use metric '{}' in this function! Allowed metrics are '{}'"\
        .format(regression_metric, ALLOWED_REGRESSION_METRICS)
        raise Exception(log_message)
    ml_task_settings.set_metric(metric=regression_metric)
    ml_task_settings.save()
    pass
