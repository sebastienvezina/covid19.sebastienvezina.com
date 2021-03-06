var chart;
var apiUrl = "https://covid19-api.sebastienvezina.com";
var ymin, ymax;

$('.btn-sent-scale').click(function(e){
    $('.btn-sent-scale').removeClass('active').addClass('not-active');
   
    var btn = $(this);
    //make current button active
    btn.removeClass('not-active').addClass('active');
    scale = btn.attr('data-sent-scale');
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

    $.getJSON(apiUrl + "/hourlymeans/" + mode, function(data) {  
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
            labels.push(value['timestamp']);
            values.push(value['mean']);
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
        if ($('.btn-sent-scale .active').attr('data-sent-scale') == 'rel') {
            ymax = chart.options.scales.yAxes[0].ticks.max;
            ymin = chart.options.scales.yAxes[0].ticks.min;  
        }
    });

});

function init() {
    $.getJSON(apiUrl + "/hourlymeans/24", function(data) {  
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
            labels.push(value['timestamp']);
            values.push(value['mean']);

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
                onResize: function(c, s) {
                    w = s.width;
                    if (w <= 690) {
                        c.options.scales.yAxes[0].scaleLabel.labelString = "Sentiment";
                    }else {
                        c.options.scales.yAxes[0].scaleLabel.labelString = "Sentiment (0: negative, 2: neutral, 4: positive)";
                    }
                },
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
                                labelString: 'Sentiment (0: negative, 2: neutral, 4: positive)',
                                fontColor: '#ccc',
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
                                    var optMonth = 'short'; //'narrow';
                                   
                                    dateTimeOptions = {
                                        month: optMonth,
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                    };
                                    out = new Intl.DateTimeFormat('en-US', dateTimeOptions).format(d);
    
                                    return out;
                                },
                                fontColor: '#ccc',
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

        //set right label depending on width
        if (chart.width <= 690) {
            chart.options.scales.yAxes[0].scaleLabel.labelString = "Sentiment";
           // chart.options.scales.xAxes[0].scaleLabel.padding.top = 200;
        }else {
            chart.options.scales.yAxes[0].scaleLabel.labelString = "Sentiment (0: negative, 2: neutral, 4: positive)";
        }
        chart.update();

    });

    //fetch best 5
    $.getJSON(apiUrl + "/newsheadlines/best/5", function(data) { 
        outHtml = "";
        $.each(data, function(key, value){
            perc = Math.ceil(value['sentiment'] / 4 * 100);
            outHtml += '<div class="progress" style=""><div class="progress-bar progress-red" role="progressbar" style="width: '+perc+'%; overflow: visible;" aria-valuenow="'+perc+'" aria-valuemin="0" aria-valuemax="100"> &nbsp;PI '+ Number(value['sentiment']).toFixed(2)+ ' - ' + value['title']+'</div></div></br>';
            $('.headlines-best').html(outHtml);
        });        
    });
    //fetch worst 5
    $.getJSON(apiUrl + "/newsheadlines/worst/5", function(data) { 
        outHtml = "";
        $.each(data, function(key, value){
            perc = Math.ceil(value['sentiment'] / 4 * 100);
            outHtml += '<div class="progress" style=""><div class="progress-bar progress-red" role="progressbar" style="width: '+perc+'%; overflow: visible;" aria-valuenow="'+perc+'" aria-valuemin="0" aria-valuemax="100"> &nbsp;PI '+ Number(value['sentiment']).toFixed(2)+ ' - ' + value['title']+' - PI '+ Number(value['sentiment']).toFixed(2)+'</div></div></br>';
            $('.headlines-worst').html(outHtml);
        });        
    });

}
init();