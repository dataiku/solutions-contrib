from webaiku.apis.dataiku.api import DataikuApi


api = DataikuApi(project_key="AMLVGE")

print(api.get_dataset_schema(dataset="Graphs_Meta"))
