
import sys
sys.path.append("..") # Adds higher directory to python modules path.
from flask import Flask
from flask_cors import CORS, cross_origin
import graphs_utils as gu
import numpy as np
import pandas as pd
import json
import datetime

app = Flask(__name__,
            static_url_path='', 
            static_folder='./../../',
            template_folder='web/templates')
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


# CPU consumption per project over time
df = pd.DataFrame({
    'A' : ['spam', 'eggs', 'spam', 'eggs'] * 6,
    'B' : ['alpha', 'beta', 'gamma'] * 8,
    'C' : [np.random.choice(pd.date_range(datetime.datetime(2013,1,1),datetime.datetime(2013,1,3))) for i in range(24)],
    'D' : np.random.randn(24),
    'E' : np.random.randint(2,10,24),
    'F' : [np.random.choice(['rand_1', 'rand_2', 'rand_4', 'rand_6']) for i in range(24)],
})
df_pivoted = df.pivot_table(index='C', columns='B', values='D', aggfunc='sum').fillna(0)
per_project_series = []
index = df_pivoted.index.tolist()
for column in df_pivoted.columns:
    per_project_series.append(gu.BarSeries(list(zip(index, df_pivoted[column])), legend_name = column, stack = True))
CPU_consumption = gu.XYChart('CPU consumption', 'category', 'value', per_project_series, graph_subtitle='(cpu time in minute)')

# CPU consumption per project
cpu_agg_per_project = df.groupby(["B"], as_index=False)['D'].agg({'D_sum':'std'}).fillna(0).sort_values('D_sum', ascending=False)
pie_chart_series = gu.PieSeries(cpu_agg_per_project["B"].tolist(), cpu_agg_per_project["D_sum"].tolist())
CPU_per_project = gu.BaseChart('CPU consumption per project', pie_chart_series, graph_subtitle='(cpu time in minute)')

dashboard = gu.Dashboard('Resource Monitoring Dashboard', [CPU_consumption, CPU_per_project])

                                          
@app.route('/getData')
@cross_origin()
def getData():
    return json.dumps(dashboard.__dict__, default=lambda o: o.__dict__, indent=4)


app.run(host='0.0.0.0', port=81)