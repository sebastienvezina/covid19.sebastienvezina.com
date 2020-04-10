var chart;
var apiUrl = "https://covid19-api.sebastienvezina.com/json";

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
        $.each(data, function(key, value){
            chartData.labels.push(value[0]);
            chartData.datasets[0].data.push(value[1])
        });
        chart.data = chartData;
        modeString = "";
        switch (mode) {
            case 24:
                modeString = "Last 24 hours";
                break;
            case 48:
                modeString = "Last 48 hours";
                break;
            case '7d':
                modeString = "Last 7 days";
                break;
            default:
                modeString = "Since March 31st 2020"

        }
        chart.options.scales.xAxes[0].scaleLabel.labelString = modeString;
        chart.update()
    });

});

$.getJSON(apiUrl + "?mode=24", function(data) {  
    chartData = {
        labels: [],
        datasets: [{
            label: 'COVID-19 news sentiment over time',
            borderColor: 'rgb(200, 0, 0)',
            data: []
        }]
    }
    $.each(data, function(key, value){
        chartData.labels.push(value[0]);
        chartData.datasets[0].data.push(value[1])
    });

    var ctx = document.getElementById('chart').getContext('2d');
    var monthDayTracker = '';
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
                        ticks: {
                            callback: function(label, index, labels) {
                                return Number(label).toFixed(2);
                            },
                            fontColor: '#eee',
                            fontSize: 14,
                        },
                        
                        scaleLabel: {
                            display: true,
                            labelString: 'Positivity scale (0 is more negative, 4 is more positive)',
                            fontColor: '#eee',
                            fontSize: 16,
                        }
                    }
                ],
                xAxes: [
                    {
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
        
            }
        }
    });
});