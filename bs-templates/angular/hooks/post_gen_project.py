import json
import os

### if code studio template ###
dss_env_var = "DIP_HOME"
dss_code_studio_env_var = "DKU_CODE_STUDIO_BROWSER_PATH"
is_code_studio = dss_env_var in os.environ and dss_code_studio_env_var in os.environ

if is_code_studio and os.getenv("{{ cookiecutter.__code_studio_href_env }}"):
    with open("angular.json", "r") as file:
        angular_json = json.load(file)

    angular_json["projects"]["{{ cookiecutter.__project_slug }}"]["architect"]["build"][
        "options"
    ]["baseHref"] = (os.getenv("{{ cookiecutter.__code_studio_href_env }}") + "/")

    with open("angular.json", "w") as file:
        json.dump(angular_json, file, indent=2)
