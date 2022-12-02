import dataiku
import re
import pickle
import io

from ..folder_commons import get_managed_folder_id


def remove_pickle_extension(pickle_name):
    """
    Removes the extension contained in a pickle name. 

    :param pickle_name: str: String used for naming the pickle file.

    :returns: pickle_name_without_extension: str: The pickle name without extension.
    """
    pickle_name_without_extension = re.sub("\.p$", "", pickle_name)
    return pickle_name_without_extension


def write_pickle_in_managed_folder(project, managed_folder_name, data, pickle_name):
    """
    Writes a pickle file in a project managed folder.

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param managed_folder_name: str: Name of the project managed folder.
    :param data: Any: Any python object serializable in pickle.
    :param pickle_name: str: String used for naming the pickle file.
    """
    managed_folder_id = get_managed_folder_id(project, managed_folder_name)
    managed_folder = dataiku.Folder(managed_folder_id)
    pickle_bytes = io.BytesIO()
    pickle.dump(data, pickle_bytes)
    pickle_name_raw = remove_pickle_extension(pickle_name)
    pickle_name = "{}.p".format(pickle_name_raw)
    print("Generating '{}' ...".format(pickle_name))
    with managed_folder.get_writer(pickle_name) as w:
        w.write(pickle_bytes.getvalue())
        pass
    print("'{}' successfully generated!".format(pickle_name))
    pass


def read_pickle_from_managed_folder(project, managed_folder_name, pickle_name):
    """
    Reads a pickle file from a project managed folder.

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param managed_folder_name: str: Name of the project managed folder.
    :param pickle_name: str: String used for naming the pickle file.

    :returns: pickle_data: Any: Any python object serializabled with pickle.
    """
    managed_folder_id = get_managed_folder_id(project, managed_folder_name)
    managed_folder = dataiku.Folder(managed_folder_id)
    pickle_name_raw = remove_pickle_extension(pickle_name)
    pickle_name = "{}.p".format(pickle_name_raw)
    print("Reading '{}' ...".format(pickle_name))
    with managed_folder.get_download_stream(pickle_name) as f:
        data = f.read()
        pickle_data = pickle.loads(data)
    f.close()
    print("'{}' successfully read!".format(pickle_name))
    return pickle_data
