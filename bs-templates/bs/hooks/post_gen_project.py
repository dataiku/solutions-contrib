import os
import json


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
                os.path.join(
                    instance_host, "public/packages/dataiku-internal-client.tar.gz"
                )
            )

    except Exception as err:
        return


if __name__ == "__main__":
    read_dss_instance_config()
