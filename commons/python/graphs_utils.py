class Graph:
    def __init__(self, graph_title, graph_type, dom_id):
        self.title = graph_title
        self.type = graph_type
        self.dom_id = dom_id


class LineGraph(Graph):
    def __init__(self, graph_name, dom_id, x_values, y_values):
        Graph.__init__(self, graph_name, "line", dom_id)
        self.x_values = x_values
        self.y_values = y_values


class DashBoard:
    def __init__(self, title, status, graphs):
        self.title = title
        self.status = status
        self.graphs = graphs
