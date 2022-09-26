from textwrap import dedent
from flask import Response
from .config_bs import ConfigBs, EnvMode
from os.path import join, exists
import json


def make_vite_header_tag(lib_url):
    mode = ConfigBs.mode()
    if mode == EnvMode.LOCAL.value:
        return dedent(
            """
                <!-- FLASK_VITE_HEADER -->
                <script type="module" src="http://localhost:5173/@vite/client"></script>
                <script type="module" src="http://localhost:5173/main.js"></script>
            """
        ) 
    else:
        dir_path = ConfigBs.static_folder()
        project_name = ConfigBs.get_project_name()
        json_manifest_path = join(dir_path,"project","dist","manifest.json")
        if exists(json_manifest_path):
            with open(json_manifest_path,"r") as f:
                manifest_obj = json.load(f)
                main_js = manifest_obj['main.js']['file']
                main_css = manifest_obj['main.css']['file']
                main_js_path_str = f"{lib_url}/" + project_name +"/dist/" + main_js
                main_css_path_str = f"{lib_url}/" + project_name +"/dist/" + main_css


            return  dedent(
                f"""
                    <!-- Production -->
                    <link rel="stylesheet" href="{main_css_path_str}" />
                    <script type="module" src="{main_js_path_str}"></script>
                    
                """
            )
        return ""
