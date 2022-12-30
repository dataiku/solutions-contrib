from textwrap import dedent
from flask import Response
from .config_bs import ConfigBs, EnvMode
from os.path import join, exists
import os
import json


def make_vite_header_tag(lib_url):
    mode = ConfigBs.mode()
    if mode == EnvMode.CODESTUDIO.value:
        code_studio_path = f'{os.environ.get("DKU_CODE_STUDIO_BROWSER_PATH_5173","")}/'
        return dedent(
            f"""
            <!-- FLASK_VITE_HEADER -->
            <script type="module" src="{code_studio_path}@vite/client"></script>
            <script type="module" src="{code_studio_path}main.js"></script>
            """
        )
    elif mode == EnvMode.LOCAL.value:
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
        json_manifest_dir_path = join(dir_path,project_name,"dist")
        json_manifest_path = join(json_manifest_dir_path,"manifest.json")
        if exists(json_manifest_path):
            with open(json_manifest_path,"r") as f:
                manifest_obj = json.load(f)
                main_js = manifest_obj['main.js']['file']
                main_css = manifest_obj['main.css']['file']
                main_assets = manifest_obj['main.js']['assets'] if 'assets' in manifest_obj['main.js'] else []
                main_js_path_str = f"{lib_url}/" + project_name +"/dist/" + main_js
                main_css_path_str = f"{lib_url}/" + project_name +"/dist/" + main_css
                new_css = None
                if len(main_assets) > 0:
                    if exists(join(json_manifest_dir_path,main_css)):
                        with open(join(json_manifest_dir_path,main_css),"r") as f:
                            new_css = f.read()
                            for asset in main_assets:
                                asset_name = asset.split("/")[-1]
                                new_asset_url = "url(" + f"{lib_url}/" + project_name +"/dist/" + 'assets/' + asset_name + ")"
                                new_css = new_css.replace(f"url(/assets/{asset_name})",new_asset_url)
            if new_css is None:
                return  dedent(
                    f"""
                        <!-- Production -->
                        <link rel="stylesheet" href="{main_css_path_str}" />
                        <script type="module" src="{main_js_path_str}"></script>
                        
                    """
                )
            else:
                return dedent(
                    f"""
                        <!-- Production -->
                        <style>{new_css}</style>
                        <script type="module" src="{main_js_path_str}"></script>
                        
                    """
                )
        return ""

def get_prod_resources(lib_url):
    dir_path = ConfigBs.static_folder()
    project_name = ConfigBs.get_project_name()
    json_manifest_dir_path = join(dir_path,project_name,"dist")
    json_manifest_path = join(json_manifest_dir_path,"manifest.json")
    if exists(json_manifest_path):
        with open(json_manifest_path,"r") as f:
            manifest_obj = json.load(f)
            main_js = manifest_obj['main.js']['file']
            main_css = manifest_obj['main.css']['file']
            main_assets = manifest_obj['main.js']['assets'] if 'assets' in manifest_obj['main.js'] else []
            main_js_path_str = f"{lib_url}/" + project_name +"/dist/" + main_js
            main_css_path_str = f"{lib_url}/" + project_name +"/dist/" + main_css
            new_css = None
            if len(main_assets) > 0:
                if exists(join(json_manifest_dir_path,main_css)):
                    with open(join(json_manifest_dir_path,main_css),"r") as f:
                        new_css = f.read()
                        for asset in main_assets:
                            asset_name = asset.split("/")[-1]
                            new_asset_url = "url(" + f"{lib_url}/" + project_name +"/dist/" + 'assets/' + asset_name + ")"
                            new_css = new_css.replace(f"url(/assets/{asset_name})",new_asset_url)
        return { "path_js" : main_js_path_str, "css_path": main_css_path_str, "css": new_css}
        
    return { "path_js" : "", "css_path": "", "css": ""}
