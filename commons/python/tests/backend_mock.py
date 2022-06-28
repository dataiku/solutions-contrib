
import sys
sys.path.append("..") # Adds higher directory to python modules path.
from flask import Flask
from flask_cors import CORS, cross_origin
import graphs_utils as gu
import numpy as np
import pandas as pd
import json
import datetime
import urllib.request 

app = Flask(__name__,
            static_url_path='', 
            static_folder='./../../')
            
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

df = pd.DataFrame({
    'Food' : ['ham', 'eggs', 'eggs', 'fruits'] * 6,
    'Vendor' : ['vendorA', 'vendorB', 'vendorC'] * 8,
    'Date' : [np.random.choice(pd.date_range(datetime.datetime(2013,1,1),datetime.datetime(2013,1,3))) for i in range(24)],
    'Price' : np.random.randn(24),
    'Quantity' : np.random.randint(2,10,24),
})
df["Date"] = df["Date"].astype(str)

# Stacked bar chart
df_pivoted = df.pivot_table(index='Date', columns='Vendor', values='Quantity', aggfunc='sum').fillna(0)
per_project_series = []
index = df_pivoted.index.tolist()
for column in df_pivoted.columns:
    per_project_series.append(gu.BarSeries(list(zip(index, df_pivoted[column])), legend_name = column, stack = True))
stacked_bar_chart = gu.XYChart('Stacked Bar Chart', 'category', 'value', per_project_series, graph_subtitle='Quantity sold per vendor per day')

# Scatter plot
scatter_series = gu.ScatterSeries(list(zip(df.Price, df.Quantity)))
scatter_chart = gu.XYChart('Scatter Chart', 'value', 'value', scatter_series, graph_subtitle='Price by Quantity sold')

# Line chart
quantity_agg_per_date = df.groupby(["Date"], as_index=False)['Quantity'].agg({'Quantity_sum':'sum'}).fillna(0).sort_values('Date', ascending=True)
line_series = gu.LineSeries(quantity_agg_per_date.Quantity_sum.tolist())
line_chart = gu.XYChart('Line Chart', 'category', 'value', line_series, x_axis_values=quantity_agg_per_date.Date.tolist(), graph_subtitle='Quantity sold over time')

# mutli type chart
multi_type = [gu.LineSeries(list(zip(quantity_agg_per_date.Date.tolist(), quantity_agg_per_date.Quantity_sum.tolist()))),
              gu.BarSeries(list(zip(quantity_agg_per_date.Date.tolist(), quantity_agg_per_date.Quantity_sum.tolist())))]
multi_type_chart = gu.XYChart('Multi-Type Chart', 'category', 'value', multi_type, graph_subtitle='Quantity sold over time')

# Pie chart
quantity_agg_per_vendor = df.groupby(["Vendor"], as_index=False)['Quantity'].agg({'Quantity_sum':'std'}).fillna(0).sort_values('Quantity_sum', ascending=False)
pie_chart_series = gu.PieSeries(quantity_agg_per_vendor["Vendor"].tolist(), quantity_agg_per_vendor["Quantity_sum"].tolist())
pie_chart = gu.BaseChart('Pie Chart', pie_chart_series,  graph_subtitle='Total Quantity sold per vendor')

# Donut chart is the same as pie with different radius
donut_series = gu.PieSeries(quantity_agg_per_vendor["Vendor"].tolist(), quantity_agg_per_vendor["Quantity_sum"].tolist())
donut_series.radius = ['40%', '70%']
donut_chart = gu.BaseChart('Donut Chart', donut_series,  graph_subtitle='Total Quantity sold per vendor')

# Map Chart
df_country = pd.DataFrame({
    'Country' : ['France', 'Germany', "United States", "Canada", "China", "Russia"],
    'Population' : [67390000, 83155031, 329500000, 38010000, 1402000000, 144100000]
})
geo_series = gu.GeoDensitySeries(df_country['Country'].tolist(), df_country['Population'].tolist(), 'world_map')
geo_json = None
with urllib.request.urlopen("https://echarts.apache.org/examples/data/asset/geo/world.json") as url:
    geo_json = json.loads(url.read().decode())
map_chart = gu.MapChart('Map Chart', geo_series, 'world_map', geo_json, graph_subtitle='Population per country')


dashboard = gu.Dashboard('Development Dashboard', [stacked_bar_chart, scatter_chart, line_chart, multi_type_chart, pie_chart, donut_chart, map_chart])

                                          
@app.route('/getData')
@cross_origin()
def getData():
    return json.dumps(dashboard.__dict__, default=lambda o: o.__dict__, indent=4)

app.run(host='0.0.0.0', port=81, debug=True)