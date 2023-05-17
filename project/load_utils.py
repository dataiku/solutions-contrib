import sys
import os

def append_project_root_to_path():
    sys.path.insert(0,os.path.dirname(os.path.dirname(os.path.abspath(__file__))))