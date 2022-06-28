class ChartsGenerator{
    constructor(){
        this.dashboard_map = new Map();
        this.charts_map = new Map();
    }

    createOrUpdateDashboard(dashboard) {
        this.addDashboardTitle(dashboard.title, dashboard.id);
        
        dashboard.charts.forEach(function(chart_data){
            if (this.charts_map.has(chart_data.id)) {
                console.log('Updating chart : ' + chart_data.id)
                updateChart(this.charts_map.get(chart_data.id), chart_data)
            } else {
                console.log('Creating chart : ' + chart_data.id)
                var chart = this.createChart(chart_data);
                if (chart !== undefined)
                    this.charts_map.set(chart_data.id, chart)
                else
                    console.log('Chart creator is undefined for ' + chart.id)
            }
        }.bind(this));
    }

    addDashboardTitle(title, id) {
        if (!this.dashboard_map.has(id)) {
            $('body').append(
                `<div id="` + id + `" class="dashboard">
                    <div class="title">
                        <h2>` + title + `</h2>
                    </div>
                    <div id="charts" class="charts">
                    </div>
                </div>`
            );
        }
    }

    createChart(chart) {
        $('#charts').append(
             `<div class="chart_area">
                  <div class="chart_container  chart_panel">
                      <div id="` + chart.id + `" class="chart_data"></div>
                   </div>
             </div>`
        );
    
        switch (chart.type) {
            case "XYChart":
                console.log("creating XYChart chart");
                return this.createXYChart(chart);
                break;
            case "BaseChart":
                console.log("creating BaseChart chart");
                return this.createBaseChart(chart);
                break;
            case "MapChart":
                console.log("creating MapChart chart");
                return this.createMapChart(chart);
                break;
            default:
                break;
        }
        return undefined;
    }

    createBaseChart(chart){
        console.log(chart);
        var chartDom = document.getElementById(chart.id);
        var myChart = echarts.init(chartDom);
        
        var option = {
            title: {
                text: chart.title,
                subtext: chart.subtitle,
                left: "center"
            },
            legend: {
                show: false,
                type: 'scroll',
                top: 'bottom'
            },
            label: {
                show: false
            },
            tooltip: {
                trigger: 'item'
            },
            series: chart.series
        }
    
        myChart.setOption(option);
        return myChart;
    }
    
    createXYChart(chart){
        var chartDom = document.getElementById(chart.id);
        var myChart = echarts.init(chartDom);
    
        var option = {
            title: {
                text: chart.title,
                subtext: chart.subtitle,
                left: "center"
            },
            legend: {
                show: false,
                type: 'scroll',
                top: 'bottom'
            },
            tooltip: {
                trigger: 'item'
            },
            xAxis: [{
                type: chart.x_type,
                show: true,
                data: chart.x_axis_values
            }],
            yAxis: [{
                type: chart.y_type,
                show: true,
                data: chart.y_axis_values
            }],
            series: chart.series
        }
    
        myChart.setOption(option);
        return myChart;
    }

    createMapChart(chart){
        echarts.registerMap(chart.map_id, { geoJson: chart.geo_json });
        var chartDom = document.getElementById(chart.id);
        var myChart = echarts.init(chartDom);
        
        console.log("map_id : " + chart.map_id)
        var option = {
            title: {
                text: chart.title,
                subtext: chart.subtitle,
                left: "center"
            },
            visualMap: {
                min: chart.min,
                max: chart.max,
                realtime: false,
                calculable: true
            },
            series: chart.series
        }
    
        myChart.setOption(option);
        return myChart;
    }
    
    updateChart(chart, graphData) {
       chart.setOption({
          series: graphData.series
       });
    }
}

charts_generator = new ChartsGenerator();