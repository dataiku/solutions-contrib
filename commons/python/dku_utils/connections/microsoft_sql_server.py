# TODO : document the package

def generate_ms_sql_column_group(list_of_columns, int_indent_level):
    sql_column_group = ''
    last_column_in_group = list_of_columns[-1]
    for column_name in list_of_columns:
        sql_column_group += '{}'.format("".join(" " for __ in range(int_indent_level)))
        sql_column_group += '"{}"'.format(column_name)
        if column_name != last_column_in_group:
            sql_column_group += ','
    return sql_column_group


def generate_ms_sql_concat_query(table_name, group_key, column_to_concatenate, post_aggregation_name):
    if (post_aggregation_name is None) or (post_aggregation_name == ""):
        post_aggregation_name = f"{column_to_concatenate}_concat"
    last_column_in_group_key = group_key[-1]
    where_arguments = ""
    for column_name in group_key:
        where_arguments += f't1."{column_name}" = t2."{column_name}"'
        if column_name != last_column_in_group_key:
            where_arguments += " AND "

    concat_query =\
    f'''REPLACE (
    \t STUFF(
    \t\t (SELECT ',' + convert(varchar(max), t2."{column_to_concatenate}")
    \t\t FROM "{table_name}" AS t2
    \t\t WHERE ({where_arguments})
    \t\t FOR XML PATH ('')
    \t\t ), 1, 1, ''), '&amp;', '&'
    ) AS "{post_aggregation_name}"'''
    return concat_query


def generate_ms_sql_count_query(post_aggregation_name):
    if (post_aggregation_name is None) or (post_aggregation_name == ""):
        post_aggregation_name = "count"
    count_query = f'COUNT(*) AS "{post_aggregation_name}"'
    return count_query


def generate_ms_sql_group_query(table_name, group_key, aggregation_settings, bool_compute_count, count_column_name):
    """
    aggregation_settings: {
        "concat": [
            {"column_name": "column_1", "post_aggregation_name": None},
            {"column_name": "column_2", "post_aggregation_name": None}
            ],
        "min": [
            {"column_name": "column_1", "post_aggregation_name": None},
            {"column_name": "column_2", "post_aggregation_name": None}
            ]
    }
    """
    
    POSSIBLE_AGGREGATIONS = ["concat"]
    query_group = generate_ms_sql_column_group(group_key, 1)
    aggregations_to_apply = aggregation_settings.keys()
    
    for aggregation in aggregations_to_apply:
        if aggregation not in POSSIBLE_AGGREGATIONS:
            log_message = f"Aggregation '{aggregation}' is not supported by this function !"\
            f"\nPossible aggregations are '{POSSIBLE_AGGREGATIONS}'."
            raise Exception(log_message)
    query_aggregations = ""
    first_aggregation = True
    
    for aggregation in POSSIBLE_AGGREGATIONS:
        all_columns_aggregation_settings = aggregation_settings[aggregation]
        for column_aggregation_settings in all_columns_aggregation_settings:
            column_name = column_aggregation_settings["column_name"]
            post_aggregation_name = column_aggregation_settings["post_aggregation_name"]
            if aggregation == "concat":
                query_enrichment = generate_ms_sql_concat_query(table_name, group_key, column_name, post_aggregation_name)
            if first_aggregation:
                enrichment_separator = ""
            else:
                enrichment_separator = ","
            query_aggregations = f"{query_aggregations}{enrichment_separator}\n\t{query_enrichment} "
            first_aggregation = False
    
    if bool_compute_count:
        query_enrichment = generate_ms_sql_count_query(count_column_name)
        query_aggregations = f"{query_aggregations},\n\t{query_enrichment} "
    ms_sql_group_query =\
    f'''SELECT {query_group},{query_aggregations}
    \nFROM "{table_name}" AS t1
    \nGROUP BY {query_group};'''
    return ms_sql_group_query
