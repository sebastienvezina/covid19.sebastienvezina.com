var chart;
var apiUrl = "https://covid19-api.sebastienvezina.com/json";
var ymin, ymax;

$('.btn-pos-scale').click(function(e){
    $('.btn-pos-scale').removeClass('active').addClass('not-active');
   
    var btn = $(this);
    //make current button active
    btn.removeClass('not-active').addClass('active');
    scale = btn.attr('data-pos-scale');
    if (scale == "rel") {
        chart.options.scales.yAxes[0].ticks.min = ymin; //Math.min(...chartData.datasets[0].data) + 0.1;
        chart.options.scales.yAxes[0].ticks.max = ymax; //Math.max(...chartData.datasets[0].data);
    }else {
        chart.options.scales.yAxes[0].ticks.min = 0;
        chart.options.scales.yAxes[0].ticks.max = 4;
    }
    chart.update()
});

$('.btn-chart-mode').click(function(e){
    //desactivate all buttons
    $('.btn-chart-mode').removeClass('active').addClass('not-active');

    var btn = $(this);
    //make current button active
    btn.removeClass('not-active').addClass('active');
    mode = btn.attr('data-chart-mode');

    $.getJSON(apiUrl + "?mode=" + mode, function(data) {  
        chartData = {
        labels: [],
        datasets: [{
            label: 'COVID-19 news sentiment over time',
            borderColor: 'rgb(200, 0, 0)',
            data: []
            }]
        }
        labels = [];
        values = [];
        $.each(data, function(key, value){
            labels.push(value[0]);
            values.push(value[1]);
        });
        chartData.labels = labels;
        chartData.datasets[0].data = values;
        
        //get mean
        mean = math.mean(values);
       
        
        chart.data = chartData;
        modeString = "";
        switch (mode) {
            case '24':
                modeString = "Last 24 hours";
                meanString = "24 hours mean: "
                break;
            case '48':
                modeString = "Last 48 hours";
                meanString = "48 hours mean: "
                break;
            case '7d':
                modeString = "Last 7 days";
                meanString = "7 days mean: "
                break;
            default:
                modeString = "Since March 31st 2020"
                meanString = "Mean since March 31st 2020: "

        }
        chart.options.scales.xAxes[0].scaleLabel.labelString = modeString;
        chart.options.annotation.annotations[0].value = mean; 
        chart.options.annotation.annotations[0].label.content = meanString + Number(mean).toFixed(2);
        chart.update()
        
        //keep ticks values
        if ($('.btn-pos-scale .active').attr('data-pos-scale') == 'rel') {
            ymax = chart.options.scales.yAxes[0].ticks.max;
            ymin = chart.options.scales.yAxes[0].ticks.min;  
        }
    });

});

function init() {
    $.getJSON(apiUrl + "?mode=24", function(data) {  
        chartData = {
            labels: [],
            datasets: [
                {
                    label: 'COVID-19 news sentiment over time',
                    borderColor: 'rgb(200, 0, 0)',
                    gridLines: {
                        color: '#ddd'
                    },
                    data: []
                }
            ]
        }
        labels = [];
        values = [];
        $.each(data, function(key, value){
            labels.push(value[0]);
            values.push(value[1]);
        });
        chartData.labels = labels;
        chartData.datasets[0].data = values;
        
        //get mean
        mean = math.mean(values);
        
        var ctx = document.getElementById('chart').getContext('2d');
        chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',
    
            // The data for our dataset
            data: chartData,
            // Configuration options go here
            options: {
                legend: {
                    display: false,
                },
                scales: {
                    yAxes: [
                        {
                            gridLines: {
                                color: '#333'
                            },
                            ticks: {
                                callback: function(label, index, labels) {
                                    return Number(label).toFixed(2);
                                },
                                fontColor: '#eee',
                                fontSize: 14,
                                
                            },
                            
                            scaleLabel: {
                                display: true,
                                labelString: 'Positivity (0 is more negative, 4 is more positive)',
                                fontColor: '#eee',
                                fontSize: 16,
                            }
                        }
                    ],
                    xAxes: [
                        {
                            gridLines: {
                                color: '#333'
                            },
                            ticks: {
                                maxTicksLimit:24,
                                callback: function(label, index, labels) {
                                    var d = new Date(label);
                                    var dateTimeOptions = {}
                                    dateTimeOptions = {
                                        month: 'short',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                    };
                                    out = new Intl.DateTimeFormat('en-US', dateTimeOptions).format(d);
    
                                    return out;
                                },
                                fontColor: '#eee',
                                fontSize: 14,
                            },
                            
                            scaleLabel: {
                                display: true,
                                labelString: 'Last 24 hours EDT',
                                fontColor: '#eee',
                                fontSize: 16,
                            }
                        }
                    ]
            
                },
                annotation: {
                    annotations: [{
                      type: 'line',
                      mode: 'horizontal',
                      scaleID: 'y-axis-0',
                      value: mean,
                      borderColor: '#eee',
                      borderWidth: 2,
                      label: {
                        enabled: true,
                        content: "24 hours mean: " + Number(mean).toFixed(2)
                      }
                    }]
                  }
            }
        });
        
        //keep ticks values
        ymax = chart.options.scales.yAxes[0].ticks.max;
        ymin = chart.options.scales.yAxes[0].ticks.min;
    });
}
init();