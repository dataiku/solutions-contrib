import json
import os

def read_dss_instance_config():
    config_path = os.path.expanduser("~/.dataiku/config.json")
    if not os.path.exists(config_path):
        return

    try:
        with open(config_path, "r") as config_file:
            config: dict = json.load(config_file)
        dss_instance_name = "{{ cookiecutter.dss_instance }}"
        dss_instances_creds = config.get("dss_instances", {})
        if dss_instance_name == "default":
            dss_instance_name = config.get("default_instance", "")
        instance_creds = dss_instances_creds.get(dss_instance_name)
        instance_host = instance_creds.get("url")

        with open("requirements.local.txt", "a") as file:
            file.write(
                "\n"
                + os.path.join(
                    instance_host, "public/packages/dataiku-internal-client.tar.gz"
                )
            )

    except Exception as err:
        return

def modify_angular_base_path():
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

if __name__ == "__main__":
    read_dss_instance_config()
    modify_angular_base_path()



