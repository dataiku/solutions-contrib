def get_per_clusters_features_distribution_data(ml_task, model_id):
    """
    Retrieves the distribution information of a clustering modeling features, for each learned cluster.
        
    :param: ml_task_settings: dataikuapi.dss.ml.DSSClusteringMLTaskSettings: DSS MLTask settings object.
    :param model_id: str: ID of the model from which we want to retrieve the information, as we get from
        'ml_task.get_trained_models_ids()'.
    
    :returns: per_clusters_features_distribution_data: dict: Dictionary containing
        for each feature, its distribution per cluster data.
        Example: {"feature_1": {"cluster_0": {'min': 45.0, 'max': 99.0, 'median': 53.0, ...},
                                "cluster_1": {'min': 17.0, 'max': 44.0, 'median': 53.0, ...},
                                ....
                                },
                    ...
                }
    """
    model_details = ml_task.get_trained_model_details(model_id)
    features_clusters_profiling_data = model_details.details["clustersProfiling"]
    per_clusters_features_distribution_data = {}
    for feature_profiling_data in features_clusters_profiling_data:
        feature_name = feature_profiling_data["variable"]
        per_clusters_features_distribution_data[feature_name] = {}
        feature_per_clusters_distribution = feature_profiling_data["per_cluster"]
        for cluster_distribution_data in feature_per_clusters_distribution:
            cluster_name = cluster_distribution_data["cluster_name"]
            cluster_distribution_data.pop('cluster_name', None)
            per_clusters_features_distribution_data[feature_name][cluster_name] =\
            cluster_distribution_data
        pass
    pass
    return per_clusters_features_distribution_data


def rename_dss_default_clusters(ml_task, model_id, cluster_renamings):
    """
    Renames default clusters computed by DSS. 
    
    :param: ml_task_settings: dataikuapi.dss.ml.DSS[MLTaskType]MLTaskSettings: DSS MLTask settings object.
        '[MLTaskType]' varies depending on the type of MLTask (Regression, Classification, Clustering).
    :param: clusters_renaming: dict: Dictionary containing the mapping between the default cluster labels 
        and their new names. 
        Example = {'cluster_0': 'new_name_for_cluster_0',
                   'cluster_1': 'new_name_for_cluster_1',
                   'cluster_2': 'new_name_for_cluster_2'}
    
    """
    model_details = ml_task.get_trained_model_details(model_id)
    metadata_set_by_user = model_details.get_user_meta()
    for dss_cluster_name in cluster_renamings.keys():
        model_details.get_user_meta()["clusterMetas"][dss_cluster_name]["name"] = cluster_renamings[dss_cluster_name]
    model_details.save_user_meta()
    pass
