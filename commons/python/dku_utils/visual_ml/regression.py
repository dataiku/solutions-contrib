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
