from .visual_ml_commons import get_deployed_model_active_version_id


def update_ml_task_classification_metric(ml_task_settings, classification_metric):
    """
    Updates the optimization metric set in a ml_task classification model.
    :param ml_task_settings: dataikuapi.dss.ml.DSSClassificationMLTaskSettings: DSS MLTask settings object.
    :param classification_metric: str: Classification metric to set. It must be in 
        ["F1", "ACCURACY", "PRECISION", "RECALL", "COST_MATRIX", "AUC", "LOG_LOSS", "CUMULATIVE_LIFT", "CUSTOM"]
        With: 
        - "F1": "F1 score"
        - "ACCURACY": "Accuracy",
        - "PRECISION": "Precision"
        - "RECALL": "Recall"
        - "COST_MATRIX": "Cost matrix"
        - "AUC": "Area Under the Curve"
        - "LOG_LOSS": "Log loss"
        - "CUMULATIVE_LIFT": "Cumulative lift"
        - "CUSTOM": "Custom code"
    """
    ALLOWED_CLASSIFICATION_METRICS = ["F1", "ACCURACY", "PRECISION", "RECALL", "COST_MATRIX",
                                      "AUC", "LOG_LOSS", "CUMULATIVE_LIFT", "CUSTOM"]
    if classification_metric not in ALLOWED_CLASSIFICATION_METRICS:
        log_message = "You can't use metric '{}' in this function! Allowed metrics are '{}'"\
        .format(classification_metric, ALLOWED_CLASSIFICATION_METRICS)
        raise Exception(log_message)
    ml_task_settings.set_metric(metric=classification_metric)
    ml_task_settings.save()
    pass


def get_deployed_model_used_threshold(project, deployed_model_id):
    """
    Retrieves the threshold used by the active version of a deployed model .
    
    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param: deployed_model_id: str: ID of the deployed model.
    
    :returns deployed_model_used_threshold: double: Threshold used by the active version of the deployed model.
    """
    deployed_model = project.get_saved_model(deployed_model_id)
    model_active_version_id = get_deployed_model_active_version_id(project, deployed_model_id)
    deployed_model_version_details = deployed_model.get_version_details(model_active_version_id)
    deployed_model_used_threshold = deployed_model_version_details.details["perf"]["usedThreshold"]
    return deployed_model_used_threshold
