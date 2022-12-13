import dis
import numpy as np
import pandas as pd


def load_python_string_imports_dataframe(python_script_string):
    """
    Retrieves a DataFrame containing all information about the python modules imported in a python script string
    DISCLAIMER: Does not retrieves import done within functions.
    :param python_script_string: str: Any python script.

    :returns: python_string_imports_dataframe: pandas.core.frame.DataFrame: Pandas DataFrame
        containing information about all the imports done in the python script.
    """
    python_string_instructions = dis.get_instructions(python_script_string)
    python_string_import_types = np.array([])
    python_string_import_names = np.array([])
    for instruction in python_string_instructions:
        if "IMPORT" in instruction.opname:
            python_string_import_types = np.append(python_string_import_types, [instruction.opname])
            python_string_import_names = np.append(python_string_import_names, [instruction.argval])
    import_parent_indexes = list(np.where(python_string_import_types=="IMPORT_NAME")[0])
    last_import_parent_index = 0
    all_imports_information = []
    for instruction_index, import_name in enumerate(python_string_import_names):
        instruction_type = python_string_import_types[instruction_index]
        if instruction_type == "IMPORT_STAR":
            import_name = "*"
        import_information = {"imported": import_name}
        if instruction_index in import_parent_indexes:
            last_import_parent_index = instruction_index
            imported_from_name = ''
        else:
            imported_from_name = python_string_import_names[last_import_parent_index]
        
        import_information["imported_from"] = imported_from_name
        all_import_information = imported_from_name
        if imported_from_name != "":
            all_import_information += "."
        all_import_information += import_name
        import_information["all_import_information"] = all_import_information
        all_imports_information.append(import_information)
    python_string_imports_dataframe = pd.DataFrame(all_imports_information)
    python_string_imports_dataframe = python_string_imports_dataframe[["imported_from", "imported",
                                                                       "all_import_information"]]
    return python_string_imports_dataframe
