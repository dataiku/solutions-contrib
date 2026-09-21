from textwrap import dedent
from html import escape
from urllib.parse import quote
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
        json_manifest_dir_path = join(dir_path,project_name,"dist")
        json_manifest_path = join(json_manifest_dir_path,"manifest.json")
        if exists(json_manifest_path):
            with open(json_manifest_path,"r") as f:
                manifest_obj = json.load(f)
                main_js = manifest_obj['main.js']['file']
                main_css = manifest_obj['main.css']['file']
                main_assets = manifest_obj['main.js']['assets'] if 'assets' in manifest_obj['main.js'] else []
                asset_base_url = f"{lib_url}/{quote(project_name, safe='')}/dist/"
                # Encode filesystem names as URL paths, then escape the full
                # value for its quoted HTML attribute. Validation in ConfigBs
                # and output escaping protect separate boundaries.
                main_js_path_str = escape(asset_base_url + quote(main_js, safe="/"), quote=True)
                main_css_path_str = escape(asset_base_url + quote(main_css, safe="/"), quote=True)
                new_css = None
                if len(main_assets) > 0:
                    if exists(join(json_manifest_dir_path,main_css)):
                        with open(join(json_manifest_dir_path,main_css),"r") as f:
                            new_css = f.read()
                            for asset in main_assets:
                                asset_name = asset.split("/")[-1]
                                # CSS is embedded in a <style> element. URL
                                # encoding prevents quotes, parentheses or
                                # </style> from escaping that context. Preserve
                                # percent escapes already added to path names.
                                new_asset_url = (
                                    "url(" + quote(asset_base_url, safe="/%")
                                    + "assets/" + quote(asset_name, safe="") + ")"
                                )
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
