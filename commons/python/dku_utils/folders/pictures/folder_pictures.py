import dataiku
from .pictures_utils import (convert_picture_from_bytes_to_pillow,
                             homothetic_rescale_pillow_picture,
                             convert_picture_from_base64_bytes_to_base64_string,
                             convert_picture_from_pillow_to_bytes,
                             convert_picture_from_pillow_to_np_array
                             )
from ..folder_commons import get_managed_folder_id


def read_picture_bytes_from_managed_folder(project, managed_folder_name, picture_path_in_folder):
    """
    Reads a picture from a project managed folder, in bytes.

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param managed_folder_name: str: Name of the project managed folder.
    :param picture_path_in_folder: str: String corresponding to the picture's path in the 'managed_folder_name'.

    :returns: bytes_picture: bytes: The folder picture bytes.
    """
    managed_folder_id = get_managed_folder_id(project, managed_folder_name)
    managed_folder = dataiku.Folder(managed_folder_id)
    with managed_folder.get_download_stream(picture_path_in_folder) as stream:
        picture_truncated_bytes = stream.readlines()
        bytes_picture = b''.join(elem for elem in picture_truncated_bytes)
        pass
    stream.close()
    return bytes_picture


def read_picture_from_managed_folder(project, managed_folder_name, picture_path_in_folder, output_datatype,
                                     bool_apply_homothetic_rescale=True,
                                     picture_max_shape=200):
    """
    Reads a picture from a project managed folder, in a chosen datatype.

    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param managed_folder_name: str: Name of the project managed folder.
    :param picture_path_in_folder: str: String corresponding to the picture's path in the 'managed_folder_name'.
    :param output_datatype: str: String corresponding to the expected output datatype.
        Allowed values for 'output_datatype' are: ["pillow", "base64_string", "np_array"]
    :param bool_apply_homothetic_rescale: bool: Precise if you want to apply a homothetic transform on the picture.
        A homothetic transform will allow to keep height/width proportions while
        ensuring that max(height, width) is under 'picture_max_shape' (Please see the next parameter).
    :param picture_max_shape: int: Value of the maximum dimension (either height or width) size allowed in the output rescaled picture.
        This parameter will be taken into account only if 'bool_apply_homothetic_rescale' is 'True' (Please see the previous parameter).
        Example: If 'picture_max_shape' is 100:
            - A 400x200 picture will be rescaled to 100x50
            - A 200x400 picture will be rescaled to 50x100.
            - A 300x100 picture will be rescaled to 100x33.

    :returns: picture_data: [bytes|numpy.ndarray|PIL.JpegImagePlugin.JpegImageFile]: The folder picture bytes.
    """
    ALLOWED_OUTPUT_DATATYPES = ["pillow", "base64_string", "np_array"]
    bytes_picture = read_picture_bytes_from_managed_folder(project, managed_folder_name, picture_path_in_folder)

    if output_datatype in ALLOWED_OUTPUT_DATATYPES:
        pillow_picture = convert_picture_from_bytes_to_pillow(bytes_picture)
        if bool_apply_homothetic_rescale:
            pillow_picture = homothetic_rescale_pillow_picture(pillow_picture, picture_max_shape)

        if output_datatype == "pillow":
            picture_data = pillow_picture
        
        elif output_datatype == "np_array":
            picture_data = convert_picture_from_pillow_to_np_array(pillow_picture)
            
        elif output_datatype == "base64_string":
            picture_data = convert_picture_from_base64_bytes_to_base64_string(convert_picture_from_pillow_to_bytes(pillow_picture, "png"))
    
    else:
        log_message = "'output_datatype' '{}' is not allowed in this function. Allowed output_datatypes are '{}'"\
            .format(output_datatype, ALLOWED_OUTPUT_DATATYPES)
        raise Exception(log_message)
    
    return picture_data


def write_bytes_picture_in_managed_folder(project, managed_folder_name, bytes_picture, picture_file_name):
    """
    Writes a pickle file in a project managed folder.
    
    :param project: dataikuapi.dss.project.DSSProject: A handle to interact with a project on the DSS instance.
    :param managed_folder_name: str: Name of the project managed folder.
    :param bytes_picture: bytes: The picture in 'bytes' format.
    :param picture_file_name: str: String used for naming the picture file
        (DISCLAIMER: it should contain the picture file format!).
    """
    managed_folder_id = get_managed_folder_id(project, managed_folder_name)
    managed_folder = dataiku.Folder(managed_folder_id)
    with managed_folder.get_writer("{}".format(picture_file_name)) as w:
        w.write(bytes_picture)
    pass
