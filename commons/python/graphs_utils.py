import pandas as pd
pd.options.mode.chained_assignment = None  # default='warn'


class Dashboard:
    def __init__(self, title, charts, id=None):
        """
        A Dashboard will display a title and all charts
        :param title: str: title of the Dashboard
        :param charts: [Chart]: array of class Chart (or its child classes)
        """

        self.title = title
        self.charts = charts
        if id is not None:
            self.id = id
        else:
            self.id = ''.join(e for e in self.title if e.isalnum())


class Chart:
    def __init__(self, graph_title, series, id=None, graph_subtitle=None, dataZoom=False):
        """
        the Chart class is the parent class for all type of charts
        :param graph_title: str: title of the graph
        :param series: series class depending on chart type
        :param graph_subtitle: str: subtitle of the graph
        """

        self.option = {}
        self.option["title"] = {"text" : graph_title, "subtext" : graph_subtitle, "left" : "center"}
        self.option["legend"] = {"show" : "false", "type" : "scroll", "top" : "bottom"}
        self.option["series"] = series
        self.option["tooltip"] = {"trigger" : "item"}

        if isinstance(series, list):
            for series_item in series:
                if isinstance(series_item, LineSeries):
                    self.option["tooltip"] = {"trigger" : "axis"}

        if id is not None:
            self.id = id
        else:
            self.id = ''.join(e for e in graph_title if e.isalnum())
        
        self.option["dataZoom"] = {"show" : dataZoom}



class BaseChart(Chart):
    def __init__(self, graph_title, series, id=None, graph_subtitle=None, dataZoom=False):
        """
        the BaseChart class is default chart class for all charts that do not need X/Y axis
        :param graph_title: str: title of the graph
        :param series: series class depending on chart type
        :param graph_subtitle: str: subtitle of the graph
        """
        Chart.__init__(self, graph_title, series, id, graph_subtitle, dataZoom)

class XYChart(Chart):
    def __init__(self, graph_title, x_type, y_type, series, x_axis_values=None, y_axis_values=None, id=None,
                 graph_subtitle=None, dataZoom=False):
        Chart.__init__(self, graph_title, series, id, graph_subtitle, dataZoom)
        """
        the XYChart class is the class for all chart that need X/Y axis
        :param x_type/y_type: str: type of the axis. It can be either 'value', 'category', 'time', 'log'
        :param x_axis_values/y_axis_values: arr of values that will be displayed in the axis
        :param graph_title: str: title of the graph
        :param series: series class depending on chart type
        :param graph_subtitle: str: subtitle of the graph
        """
        # type is either 'value', 'category', 'time', 'log'
        self.option["xAxis"] = {"type" : x_type, "data" : x_axis_values, "show" : "true"}
        self.option["yAxis"] = {"type" : y_type, "data" : y_axis_values, "show" : "true"}

class HeatmapChart(Chart):
    def __init__(self, graph_title, series, x_axis_values, y_axis_values, min, max, id=None, graph_subtitle=None, dataZoom=False):
        Chart.__init__(self, graph_title, series, id, graph_subtitle, dataZoom)
        """
        the HeatmapChart class is the class to display Heatmap charts
        :param x_type/y_type: str: type of the axis. It can be either 'value', 'category', 'time', 'log'
        :param x_axis_values/y_axis_values: arr of values that will be displayed in the axis
        :param min/max: float value of the min/max values for the coloring of the heatmap
        :param graph_title: str: title of the graph
        :param series: series class depending on chart type
        :param graph_subtitle: str: subtitle of the graph
        """
        self.option["xAxis"] = {"type" : 'category', "data" : x_axis_values, "show" : "true", "splitArea" : {"show" : "true"}}
        self.option["yAxis"] = {"type" : 'category', "data" : y_axis_values, "show" : "true", "splitArea" : {"show" : "true"}}
        self.option["visualMap"] = {"min" : min, "max" : max, "calculable" : "true", "orient" : "horizontal", "left" : "center"}

class Series:
    def __init__(self, data, legend_name=None):
        self.name = legend_name
        self.data = data

class LineSeries(Series):
    def __init__(self, data, legend_name=None, stack=None):
        Series.__init__(self, data, legend_name)
        """
        the LineSeries class is the class used for line charts series
        :param data: arr: either [x, y, ..], or [[x, y], ..]
        :param legend_name: str: legend for this series
        """
        self.type = 'line'
        self.showSymbol= False
        self.smooth = False
        if stack:
            self.stack = 'Total'
            self.areaStyle = {}

class BarSeries(Series):
    def __init__(self, data, legend_name=None, stack=None):
        Series.__init__(self, data, legend_name)
        """
        the BarSeries class is the class used for bar charts series
        :param data: arr: either [x, y, ..], or [[x, y], ..]
        :param legend_name: str: legend for this series
        """
        self.type = 'bar'
        if stack:
            self.stack = 'Total'

class ScatterSeries(Series):
    def __init__(self, data, legend_name=None, stack=None):
        Series.__init__(self, data, legend_name)
        """
        the BarSeries class is the class used for bar charts series
        :param data: arr: either [x, y, ..], or [[x, y], ..]
        :param legend_name: str: legend for this series
        """
        # data is either [x, y, ..], or [[x, y], ..]
        self.type = 'scatter'

class PieSeries(Series):
    def __init__(self, slice_names, slice_values):
        data = [{'name': slice_names[i], 'value': slice_values[i]} for i in range(len(slice_names))]
        Series.__init__(self, data)
        self.type = 'pie'
        self.radius = '50%'
        self.minShowLabelAngle = '5'

class GaugeSeries(Series):
    def __init__(self, value, min_gauge, max_gauge, label=None):
        if label is not None:
            data = [{'name' : label, 'value' : value}]
        else:
            data = [{'value' : value}]
        Series.__init__(self, data)
        self.type = 'gauge'
        self.min = int(min_gauge)
        self.max = int(max_gauge)

class SankeySeries(Series):
    def __init__(self, sources, targets, values):
        nodeSet = set(sources)
        nodeSet.update(targets)
        data = [{'name': item} for item in nodeSet]
        Series.__init__(self, data)
        self.type = 'sankey'
        self.links = [{'source': source, 'target': target, 'value': value} for source, target, value in zip(sources, targets, values)]
        self.tootlip = { 'trigger': 'item', 'triggerOn': 'mousemove'}

class HeatmapSeries(Series):
    def __init__(self, data):
        Series.__init__(self, data)
        self.type = 'heatmap'

def generateStackedSeries(dataframe, name_column, x_column, y_column, aggregation, type=None, limit=50, stack=True, sort=False, colors=None):
    # get top N elements to comply with the limit 
    top_n = (dataframe.groupby([name_column], as_index=False)[y_column]
                            .agg({'agg':aggregation})
                            .fillna(0)
                            .sort_values('agg', ascending=False)
                            .head(limit)[name_column]
                            .tolist())
    dataframe.loc[~dataframe[name_column].isin(top_n), name_column] = 'Others'
    
    #df_pivoted = dataframe.pivot_table(index=x_column, columns=name_column, values=y_column, aggfunc=aggregation).fillna(0)
    df_pivoted = dataframe.groupby([x_column, name_column], sort=False).agg({y_column:[aggregation]}).unstack(level=name_column).fillna(0) #same but quicker
    
    if sort:
        df_pivoted["__total__"] = df_pivoted.sum(axis=1)
        df_pivoted.sort_values(by="__total__", ascending=False, inplace=True)
        df_pivoted.drop('__total__', inplace=True, axis=1)

    series = []
    x_values = df_pivoted.index.tolist()
    for column in df_pivoted.columns:
        if type is not None and type=='line':
            column_series = LineSeries(list(zip(x_values, df_pivoted[column])), legend_name = column[2], stack = stack)
        else:
            column_series = BarSeries(list(zip(x_values, df_pivoted[column])), legend_name = column[2], stack = stack)
        if (colors != None) and (column[2] in colors.keys()): 
                column_series.color = colors[column[2]]
        series.append(column_series)
    return series

def generateHeatmapChart(dataframe, x_column, y_column, value_column, aggregation, title, x_values = None, y_values = None, subtitle = None):
    df_heatmap = dataframe.groupby([x_column, y_column], sort=False).agg({value_column:[aggregation]}).unstack(level=y_column).fillna(0)
    if not x_values:
        x_values = list(set(dataframe[x_column]))
    if not y_values:
        y_values = list(set(dataframe[y_column]))
    triplets = []
    min_value = df_heatmap.iat[0,0]
    max_value = df_heatmap.iat[0,0]
    for index, row in df_heatmap.iterrows():
        for column in df_heatmap.columns:
            triplets.append([x_values.index(index), y_values.index(column[2]), row[column]])
            min_value = min(min_value, row[column])
            max_value = max(max_value, row[column])
    heatmap_series = HeatmapSeries(triplets)
    return HeatmapChart(title, heatmap_series, x_values, y_values, min_value, max_value, graph_subtitle = subtitle)
   
def binDataframe(dataframe, x_column, y_column, nb_bin=10, aggfunc="mean"):
    dataframe = dataframe.dropna(subset=[y_column])
    if dataframe.shape[0] == 0:
        return dataframe
    bin_column = "%s_bin" %x_column
    dataframe[bin_column] = pd.cut(dataframe[x_column], bins=nb_bin)
    return dataframe.groupby(bin_column).agg({x_column: 'median', y_column: aggfunc}).reset_index(drop=True).dropna(subset=[x_column])

def generateLineSeries(dataframe, x_column, y_column, series_column, aggfunc="mean", nb_bin=10, colors=None, max_nb_series=10):
    line_series_arr = []

    # Return an empty LineSeries if the dataframe is empty
    if dataframe.shape[0] == 0:
        return [LineSeries([])]

    for column in dataframe[series_column].unique():
        # Stop looping if we've reached the maximum number of series
        if len(line_series_arr) > max_nb_series:
            return line_series_arr

        dataframe_agg_binned = binDataframe(dataframe[dataframe[series_column] == column], x_column, y_column, aggfunc=aggfunc, nb_bin=nb_bin)

        # Skip to the next iteration if the binned dataframe is empty
        if dataframe_agg_binned.shape[0] == 0:
            line_series_arr.append(LineSeries([]))
            continue

        # Create a LineSeries
        dataframe_agg_binned[x_column] = dataframe_agg_binned[x_column].astype(int)
        line_series = LineSeries(list(zip(dataframe_agg_binned[x_column], dataframe_agg_binned[y_column].fillna("null").round(2))), legend_name=column)

        # Set the color of the line series if specified in the colors dict
        if colors is not None and column in colors.keys():
            line_series.color = colors[column]

        line_series_arr.append(line_series)

    return line_series_arr
    
def generateLineSeries2(dataframe, x_column, y_column, series_column, aggfunc="mean", nb_bin=10, colors=None):
    line_series_arr = []
    dataframe = dataframe.dropna(subset=[y_column])
    if dataframe.shape[0] == 0:
        return [LineSeries([])]
    bin_column = "%s_bin" %x_column
    dataframe[bin_column] = pd.cut(dataframe[x_column], bins=nb_bin)
    dataframe[x_column] = dataframe[bin_column].apply(lambda x: x.mid)
    
    for column in dataframe[series_column].unique():
        dataframe_agg_binned = dataframe[dataframe[series_column] == column].groupby(x_column, as_index = False).agg({y_column: aggfunc}).dropna(subset=[x_column])
        dataframe_agg_binned[x_column] = dataframe_agg_binned[x_column].astype(int)
        line_series = LineSeries(list(zip(dataframe_agg_binned[x_column], dataframe_agg_binned[y_column].fillna("null"))), legend_name=column)
        if (colors != None) and (column in colors.keys()): 
            line_series.color = colors[column]
        line_series_arr.append(line_series)
        
    return line_series_arr  
