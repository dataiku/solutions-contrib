import os
from typing import Optional


def find_relative_path(caller_path: str, relative_path: str) -> Optional[str]:
    caller_dir = os.path.dirname(caller_path)

    relative_components = relative_path.split("/")

    old_caller_dir = None

    while caller_dir and caller_dir != old_caller_dir:
        if not os.path.exists(os.path.join(caller_dir, *relative_components)):
            old_caller_dir = caller_dir
            caller_dir = os.path.dirname(caller_dir)

        else:
            return os.path.join(caller_dir, *relative_components)

    return None
