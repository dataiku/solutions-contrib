class Dashboard:
    def __init__(self, title, charts, id=None):
        self.title = title
        self.charts = charts
        if id is not None:
            self.id = id
        else:
            self.id = ''.join(e for e in self.title if e.isalnum())


class Chart:
    def __init__(self, graph_title, chart_type, series, id=None, graph_subtitle=None):
        self.title = graph_title
        self.subtitle = graph_subtitle
        self.series = series
        self.type = chart_type
        if id is not None:
            self.id = id
        else:
            self.id = ''.join(e for e in self.title if e.isalnum())


class BaseChart(Chart):
    def __init__(self, graph_title, series, id=None, graph_subtitle=None):
        Chart.__init__(self, graph_title, 'BaseChart', series, id, graph_subtitle)


class XYChart(Chart):
    def __init__(self, graph_title, x_type, y_type, series, x_axis_values=None, y_axis_values=None, id=None,
                 graph_subtitle=None):
        Chart.__init__(self, graph_title, 'XYChart', series, id, graph_subtitle)
        self.x_type = x_type  # either 'value', 'category', 'time', 'log'
        self.y_type = y_type  # either 'value', 'category', 'time', 'log'
        self.x_axis_values = x_axis_values
        self.y_axis_values = y_axis_values


class Series:
    def __init__(self, data, legend_name=None):
        self.name = legend_name
        self.data = data


class LineSeries(Series):
    def __init__(self, data, legend_name=None, stack=None):
        Series.__init__(self, data, legend_name)
        # data is either [x, y, ..], or [[x, y], ..]
        self.type = 'line'
        if stack is not None:
            self.stack = 'Total'


class BarSeries(Series):
    def __init__(self, data, legend_name=None, stack=None):
        Series.__init__(self, data, legend_name)
        # data is either [x, y, ..], or [[x, y], ..]
        self.type = 'bar'
        if stack is not None:
            self.stack = 'Total'


class PieSeries(Series):
    def __init__(self, slice_names, slice_values):
        data = [{'name': slice_names[i], 'value': slice_values[i]} for i in range(len(slice_names))]
        Series.__init__(self, data)
        self.type = 'pie'
        self.radius = '50%'
        self.minShowLabelAngle = '5'


class TreeMapSeries(Series):
    def __init__(self, data, slice_values):
        # data is either [{name: XX, value : y, children [{name: XX, value : y, ..}]}, ..]
        Series.__init__(self, data)
        self.type = 'treemap'
        self.visibleMin = '300'
