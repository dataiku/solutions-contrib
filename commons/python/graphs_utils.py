class Dashboard:
    def __init__(self, title, charts):
        self.title = title
        self.charts = charts


class Chart:
    def __init__(self, graph_title, canvas_type, series, dom_id):
        self.title = graph_title
        self.type = canvas_type
        self.dom_id = dom_id
        self.series = series


class XYChart(Chart):
    def __init__(self, graph_name, dom_id, x_type, y_type, series, x_axis_values=None, y_axis_values=None):
        Chart.__init__(self, graph_name, 'XYChart', series, dom_id)
        self.x_type = x_type  # either 'value', 'category', 'time', 'log'
        self.y_type = y_type  # either 'value', 'category', 'time', 'log'
        self.x_axis_values = x_axis_values
        self.y_axis_values = y_axis_values


class Series:
    def __init__(self, data, legend_name=None):
        self.legend_name = legend_name
        self.data = data


class LineSeries(Series):
    def __init__(self, data, legend_name=None, stack=None):
        Series.__init__(self, data, legend_name)
        self.type = 'line'
        if stack is not None:
            self.stack = 'Total'


class BarSeries(Series):
    def __init__(self, data, legend_name=None, stack=None):
        Series.__init__(self, data, legend_name)
        self.type = 'bar'
        if stack is not None:
            self.stack = 'Total'
