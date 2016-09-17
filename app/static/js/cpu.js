

$(document).ready(function(){
        __main();
});

var __main = function() {
    setup();
    updateChart();
    $('#id-button-cpu-live').click()
  }

var setup = function() {

    var cpuLoadLiveUrl = '/dashboard/data?offset=10';
    get(cpuLoadLiveUrl, response=cpuLoadLive, $target=$('#id-div-cpu-live'));
    var cpuLoadOneHourUrl = '/dashboard/data?offset=3600';
    get(cpuLoadOneHourUrl, response=cpuLoadPeriod, $target=$('#id-div-cpu-onehour'));
    var cpuLoadOneDayUrl = '/dashboard/data?offset=896400';
    get(cpuLoadOneDayUrl, response=cpuLoadPeriod, $target=$('#id-div-cpu-oneday'));
    var tabAction = function (cpuLive, cpuOneHour, cpuOneDay) {
        $('#id-div-cpu-live').toggle(cpuLive);
        $('#id-div-cpu-onehour').toggle(cpuOneHour);
        $('#id-div-cpu-oneday').toggle(cpuOneDay);
        };

    $('#id-button-cpu-live').on('click', function() {
        var cpuLive = true;
        var cpuOneHour = false;
        var cpuOneDay = false;
        tabAction(cpuLive, cpuOneHour, cpuOneDay);
        });

    $('#id-button-cpu-onehour').on('click', function() {
        var cpuLive= false;
        var cpuOneHour = true;
        var cpuOneDay = false;
        tabAction(cpuLive, cpuOneHour, cpuOneDay);
        // 请求一个小时的cpu负载数据

        });

    $('#id-button-cpu-oneday').on('click', function() {
        var cpuLive= false;
        var cpuOneHour = false;
        var cpuOneDay = true;
        tabAction(cpuLive, cpuOneHour, cpuOneDay);
        // 请求一天的cpu负载数据
        });
    };

var updateChart = function() {
    // 请求实时单个cpu负载数据
    var CpuLoadUrl = '/dashboard/data?offset=1';
    setInterval(function() {
    barChartDemo.removeData();
    get(CpuLoadUrl, updateCpuLoad)
    }, 1000);
    };

var cpuLoadLive = function(data, $target){
  if(data.success) {
    var cpuload = data.cpu_load;
    var label = data.cpu_load_time;
    // log('tim', label);
    for (var i = 0; i < label.length; i++) {
      label[i] = formatted_time(label[i]*1000)
      // log('label', label[i])
    };
    var barChartData = {
        labels: label,
        datasets: [{
            fillColor: "#a9cef2",
            strokeColor: "#7cb5ec",
            data: cpuload,
        }]
    };
    log('t', $target)
    var ctx = $target[0].getContext("2d");
    barChartDemo = new Chart(ctx).Bar(barChartData, {
    responsive: true,
    barValueSpacing: 2,
    scaleOverride : true,
    scaleSteps : 10,
    scaleStepWidth : 10,
    scaleStartValue : 0
    });
  }else {
    log('请求失败');
  }
};

var cpuLoadPeriod = function(data, $target){
   if(data.success) {
    var cpuload = data.cpu_load;
    var timestamp = data.cpu_load_time_start;
    log('timestamp', timestamp);
    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });
    $target.highcharts({
        chart: {
                zoomType: 'x'
            },
        title: {
            text: 'CPU load Chart'
        },
        xAxis: {
                type: 'datetime',

            },
        yAxis: {
                title: {
                    text: 'CPU load rate (%)'
                }
            },
        legend: {
                enabled: false
            },
        plotOptions: {
                area: {
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                }
            },
        series: [{
            type: 'area',
            name: 'CPU load rate (%)',
            data: cpuload,
            pointStart: timestamp,
            pointInterval: 1000 // one second
        }]
    });
}else {
    log('请求失败');
  };
  };

var updateCpuLoad = function(data){
  if(data.success) {
    log('success', data);
    var cpuload = data.cpu_load;
    log('data', data, typeof Number(data));
    timestamp = Date.now()
    barChartDemo.addData(cpuload, formatted_time(timestamp));
  }else {
    log('请求失败');
  }
};
