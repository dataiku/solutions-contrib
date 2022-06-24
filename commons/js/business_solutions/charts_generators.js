
const charts_map = new Map();
function createOrUpdateCharts() {
    $.getJSON(getWebAppBackendUrl('/getData'), function(dashboard) {
        addDashboardTitle(dashboard.title);
        
        $.each(dashboard.charts, function(index, chart) {
            if (charts_map.has(chart.dom_id)) {
                console.log('Updating chart : ' + chart.dom_id)
                updateChart(charts_map.get(chart.dom_id), chart)
            } else {
                console.log('Creating chart : ' + chart.dom_id)
                var chart = createChart(chart);
                if (chart !== undefined)
                    charts_map.set(chart.dom_id, chart)
                else
                    console.log('Chart creator is undefined for ' + chart.dom_id)
            }
        })
    });
}

function addDashboardTitle(title) {
    if ($('#dashboard').length === 0) {
        $('body').append(
            `<div id="dashboard" class="dashboard">
                <div class="title">
                    <h2>` + title + `</h2>
                </div>
                <div id="charts" class="charts">
                </div>
            </div>`
        );
    }
}


function createChart(chart) {
    $('#charts').append(
         `<div class="chart_area">
              <div class="chart_container  chart_panel">
                  <div id="` + chart.dom_id + `" class="chart_data"></div>
               </div>
         </div>`
    );

    switch (chart.type) {
        case "XYChart":
            console.log("creating XYChart chart");
            return createXYChart(chart);
            break;
        case "BaseChart":
            console.log("creating BaseChart chart");
            return createBaseChart(chart);
            break;
        default:
            break;
    }
    return undefined;
}

function createBaseChart(chart){
    console.log(chart);
    var chartDom = document.getElementById(chart.dom_id);
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

function createXYChart(chart){
    var chartDom = document.getElementById(chart.dom_id);
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

function updateChart(chart, graphData) {
   chart.setOption({
      series: graphData.series
   });
}