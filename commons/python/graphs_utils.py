class Chart:
    def __init__(self, graph_title, canvas_type, series, dom_id):
        self.title = graph_title
        self.type = canvas_type
        self.dom_id = dom_id
        self.series = series


class XYChart(Chart):
    def __init__(self, graph_name, graph_type, dom_id, x_type, y_type, series, x_axis_values=None, y_axis_values=None):
        Chart.__init__(self, graph_name, 'XYChart', series, dom_id)
        self.x_type = x_type  # either 'value', 'category', 'time', 'log'
        self.y_type = y_type  # either 'value', 'category', 'time', 'log'
        self.x_axis_values = x_axis_values
        self.y_axis_values = y_axis_values


class LineSeries:
    def __init__(self, legend_name, data, stack=None):
        self.legend_name = legend_name
        self.type = 'line'
        self.data = data
        if stack is not None:
            self.stack = 'Total'


class Dashboard:
    def __init__(self, title, charts):
        self.title = title
        self.charts = charts
