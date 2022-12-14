import numpy as np
from numpy import asarray
import base64
import skimage.io
import cv2
import PIL
from PIL import Image
import io


def convert_picture_from_np_array_to_base64_bytes(np_array_picture):
    """
    Converts a picture in numpy format into a 'base64 bytes' object.

    :param np_array_picture: numpy.ndarray: The picture in numpy format.

    :returns: base64_bytes_picture: bytes: The picture in 'base64 bytes' format.
    """
    if isinstance(np_array_picture, np.ndarray):
        base64_bytes_picture = base64.b64encode(np_array_picture.astype(np.int))
    else:
        log_message = "You can't handle data of type '{}': "\
        "This function expects to have data of type 'np.ndarray'".format(type(np_array_picture))
        raise Exception(log_message)
    return base64_bytes_picture

    
def convert_picture_from_np_array_to_pillow(np_array_picture):
    """
    Converts a picture in numpy format into a pillow object.

    :param np_array_picture: numpy.ndarray: The picture in numpy format.

    :returns: pillow_picture: PIL.Image.Image: The picture in pillow format.
    """
    pillow_picture = Image.fromarray(np_array_picture)
    return pillow_picture


def convert_picture_from_base64_bytes_to_base64_string(base64_bytes):
    """
    Converts a picture in 'base64 bytes' format into a 'base64 bytes string' object.

    :param base64_bytes: bytes: The picture in 'base64 bytes' format.

    :returns: base64_string: str: The picture in 'base64 bytes string' format.
    """
    if isinstance(base64_bytes, bytes):
        base64_string = base64.b64encode(base64_bytes).decode("utf-8")
    else:
        log_message = "You can't handle data of type '{}': "\
        "This function expects to have data of type 'bytes'".format(type(base64_bytes))
        raise Exception(log_message)
    return base64_string


def convert_picture_from_base64_string_to_np_array(base64_string_picture, picture_final_shape):
    """
    Converts a picture in 'base64 bytes string' format into a numpy object.

    :param base64_string_picture: str: The picture base64 bytes string.
    :param picture_final_shape: tuple: A tuple of size 3 which corresponds to the
        picture's expected shape, in (height, width, depth) format.
        Example: picture_final_shape= (128, 128, 3)

    :returns: np_array_picture: numpy.ndarray: The picture in numpy format.
    """
    if isinstance(base64_string_picture, str):
        base64_bytes_picture = base64.decodebytes(base64_string_picture)
        np_array_picture = np.frombuffer(base64_bytes_picture, dtype=np.int)
        np_array_picture = np_array_picture.reshape(picture_final_shape[0], picture_final_shape[1], picture_final_shape[2])
    else:
        log_message = "You can't handle data of type '{}': "\
        "This function expects to have data of type 'str'".format(type(base64_string_picture))
        raise Exception(log_message)
    return np_array_picture


def convert_picture_from_base64_string_or_bytes_to_np_array(base64_string_or_bytes_picture):
    """
    Converts a picture in 'base64 bytes' OR 'base64 bytes string' format into a numpy object.

    :param base64_string_or_bytes_picture: [bytes|str]: The picture in 'base64 bytes' or 'base64 bytes string' format.

    :returns: np_array_picture: numpy.ndarray: The picture in numpy format.
    """
    picture_is_bytes = isinstance(base64_string_or_bytes_picture, bytes)
    picture_is_string = isinstance(base64_string_or_bytes_picture, str)
    if picture_is_bytes or picture_is_string:
        if picture_is_bytes:
            base64_string = base64_string_or_bytes_picture.decode("utf-8")
        elif picture_is_string:
            base64_string = base64_string_or_bytes_picture
        imgdata = base64.b64decode(base64_string)
        np_array_picture = skimage.io.imread(imgdata, plugin='imageio')
    else:
        log_message = "You can't handle data of type '{}': "\
        "This function expects to have data of type 'bytes' or 'str'.".format(type(base64_string_or_bytes_picture))
        raise Exception(log_message)
    return np_array_picture


def convert_picture_from_pillow_to_np_array(pillow_picture):
    """
    Converts a picture in 'pillow' format into a numpy object.

    :param pillow_picture: PIL.Image.Image: The picture in pillow format.

    :returns: np_array_picture: numpy.ndarray: The picture in numpy format.
    """
    if isinstance(pillow_picture, PIL.Image.Image):
        np_array_picture = asarray(pillow_picture)
    else:
        log_message = "You can't handle data of type '{}': "\
        "This function expects to have data of type 'PIL.Image.Image'".format(type(pillow_picture))
        raise Exception(log_message)
    
    return np_array_picture


def convert_picture_from_bytes_to_pillow(bytes_picture):
    """
    Converts a picture in 'bytes' format into a pillow object.

    :param bytes_picture: bytes: The picture in 'bytes' format (as get from the function
        'read_picture_bytes_from_managed_folder' in './folder_pictures.py').

    :returns: pillow_picture: PIL.Image.Image: The picture in pillow format.
    """
    if isinstance(bytes_picture, bytes):
        pillow_picture = Image.open(io.BytesIO(bytes_picture))
    else:
        log_message = "You can't handle data of type '{}': "\
        "This function expects to have data of type 'bytes'".format(type(bytes_picture))
        raise Exception(log_message)
    return pillow_picture


def convert_picture_from_pillow_to_bytes(pillow_picture, output_picture_file_format):
    """
    Converts a picture in 'pillow' format into a bytes object, with a chosen file format.

    :param pillow_picture: PIL.Image.Image: The picture in pillow format.
    :param output_picture_file_format: str: File format associated with the bytes picture.

    :returns: bytes_picture: bytes: The picture in 'bytes' format.
    """
    if output_picture_file_format == "jpg":
        output_picture_file_format = "jpeg"
    ALLOWED_IMAGE_FILE_FORMATS = ["png", "jpeg"]
    if output_picture_file_format not in ALLOWED_IMAGE_FILE_FORMATS:
        log_message = "Picture file format '{}' is not allowed in this function. Allowed picture file formats are '{}'"\
            .format(output_picture_file_format, ALLOWED_IMAGE_FILE_FORMATS)
        raise Exception(log_message)
    if isinstance(pillow_picture, PIL.Image.Image):
        buffer = io.BytesIO()
        pillow_picture.save(buffer, format=output_picture_file_format)
        bytes_picture = buffer.getvalue()
    else:
        log_message = "You can't handle data of type '{}': "\
        "This function expects to have data of type 'PIL.Image.Image'".format(type(pillow_picture))
        raise Exception(log_message)
    return bytes_picture


def get_homothetic_rescale_params(np_array_picture, picture_max_shape):
    """
    Computes the parameters required to apply a homothetic rescaling transform on a picture in 'numpy' format.
        A homothetic transform will allow to keep height/width proportions while
        ensuring that max(height, width) is under 'picture_max_shape' (Please see the parameters documentation).

    :param np_array_picture: numpy.ndarray: The picture in numpy format.
    :param picture_max_shape: int: Value of the maximum dimension (either height or width) size allowed in the output rescaled picture.
        Example: If 'picture_max_shape' is 100:
            - A 400x200 picture will be rescaled to 100x50
            - A 200x400 picture will be rescaled to 50x100.
            - A 300x100 picture will be rescaled to 100x33

    :returns: homothetic_rescale_params: dict: The information required to apply the homothetic picture rescaling transform.
    """
    picture_shape = np_array_picture.shape
    initial_height = picture_shape[0]
    initial_width = picture_shape[1]
    initial_shapes = np.array([initial_height, initial_width])
    if (initial_height > picture_max_shape) or (initial_width > picture_max_shape) :
        picture_should_be_rescaled = True
        highest_shape = np.max(initial_shapes)
        homothetic_factor = highest_shape / picture_max_shape
        final_height = initial_height / homothetic_factor
        final_width = initial_width / homothetic_factor
        final_height = int(final_height)
        final_width = int(final_width)
    else:
        print("No need for homothetic rescale for this picture ...")
        homothetic_rescale_params = 1.0
        picture_should_be_rescaled = False
        final_height = initial_height
        final_width = initial_width
        homothetic_factor = 1.0
    homothetic_rescale_params = {
        "picture_should_be_rescaled": picture_should_be_rescaled,
        "initial_width": initial_width,
        "initial_height": initial_height,
        "homothetic_factor": homothetic_factor,
        "final_width": final_width,
        "final_height": final_height 
    }
    return homothetic_rescale_params


def homothetic_rescale_np_array_picture(np_array_picture, picture_max_shape):
    """
    Applies a homothetic transform to a picture in 'numpy' format.
        (Please see the function 'get_homothetic_rescale_params' to know more about it).

    :param np_array_picture: numpy.ndarray: The picture in numpy format.
    :param picture_max_shape: int: Value of the maximum dimension (either height or width) size allowed in the output rescaled picture.
        Example: If 'picture_max_shape' is 100:
            - A 400x200 picture will be rescaled to 100x50
            - A 200x400 picture will be rescaled to 50x100.
            - A 300x100 picture will be rescaled to 100x33

    :returns: np_array_picture_rescaled: numpy.ndarray: The rescaled image in 'numpy' format.
    """
    homothetic_rescale_params = get_homothetic_rescale_params(np_array_picture, picture_max_shape)
    picture_should_be_rescaled = homothetic_rescale_params["picture_should_be_rescaled"]
    if picture_should_be_rescaled:
        final_width = homothetic_rescale_params["final_width"]
        final_height = homothetic_rescale_params["final_height"]
        np_array_picture_rescaled = cv2.resize(np_array_picture, dsize=(final_width, final_height), interpolation=cv2.INTER_CUBIC)
    else:
        np_array_picture_rescaled = np_array_picture
    return np_array_picture_rescaled


def homothetic_rescale_pillow_picture(pillow_picture, picture_max_shape):
    """
    Applies a homothetic transform to a picture in 'pillow' format
        (Please see the function 'get_homothetic_rescale_params' to know more about it).

    :param pillow_picture: PIL.Image.Image: The picture in pillow format.
    :param picture_max_shape: int: Value of the maximum dimension (either height or width) size allowed in the output rescaled picture.
        Example: If 'picture_max_shape' is 100:
            - A 400x200 picture will be rescaled to 100x50
            - A 200x400 picture will be rescaled to 50x100.
            - A 300x100 picture will be rescaled to 100x33

    :returns: pillow_picture_rescaled: PIL.Image.Image: The rescaled image in 'pillow' format.
    """
    np_array_picture = convert_picture_from_pillow_to_np_array(pillow_picture)
    homothetic_rescale_params = get_homothetic_rescale_params(np_array_picture, picture_max_shape)
    picture_should_be_rescaled = homothetic_rescale_params["picture_should_be_rescaled"]
    if picture_should_be_rescaled:
        final_width = homothetic_rescale_params["final_width"]
        final_height = homothetic_rescale_params["final_height"]
        pillow_picture_rescaled = pillow_picture.resize((final_width, final_height))
    else:
        pillow_picture_rescaled = pillow_picture
    return pillow_picture_rescaled
