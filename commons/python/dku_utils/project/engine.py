from dataikuapi.dss.project import DSSProject


def get_engine_priority(project: DSSProject):
    return project.get_settings().settings["settings"]["recipeEnginesPreferences"]["enginesPreferenceOrder"]
