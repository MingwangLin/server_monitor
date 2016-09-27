var CpuChartSetup = function () {
    var cpuLoadLiveUrl = 'dashboard/cpu/data?limit=10';
    get(cpuLoadLiveUrl, response = cpuLoadLive, $target = $('#id-canvas-cpu-live'));
    var cpuLoadOneMinUrl = 'dashboard/cpu/data?limit=20';
    get(cpuLoadOneMinUrl, response = cpuLoadPeriod, $target = $('#id-div-cpu-oneminute'));
    var cpuLoadOneHourUrl = 'dashboard/cpu/data?limit=1200';
    get(cpuLoadOneHourUrl, response = cpuLoadPeriod, $target = $('#id-div-cpu-onehour'));

    var tabAction = function (cpuLive, cpuOneMin, cpuOneHour) {
        $('#id-canvas-cpu-live').toggle(cpuLive);
        $('#id-div-cpu-oneminute').toggle(cpuOneMin);
        $('#id-div-cpu-onehour').toggle(cpuOneHour);
    };

    $('#id-button-cpu-live').on('click', function () {
        var cpuLive = true;
        var cpuOneMin = false;
        var cpuOneHour = false;
        tabAction(cpuLive, cpuOneMin, cpuOneHour);
    });

    $('#id-button-cpu-oneminute').on('click', function () {
        var cpuLive = false;
        var cpuOneMin = true;
        var cpuOneHour = false;
        tabAction(cpuLive, cpuOneMin, cpuOneHour);
        // 请求一分钟的cpu负载数据

    });

    $('#id-button-cpu-onehour').on('click', function () {
        var cpuLive = false;
        var cpuOneMin = false;
        var cpuOneHour = true;
        tabAction(cpuLive, cpuOneMin, cpuOneHour);
        // 请求一个小时的cpu负载数据
    });
};

var updateCpuChart = function () {
    // 请求实时单个cpu负载数据
    var CpuLoadUrl = 'dashboard/cpu/data?limit=1';
    setInterval(function () {
        CpuChartLive.removeData();
        get(CpuLoadUrl, updateCpuLoad)
    }, 3000);
};

var cpuLoadLive = function (data, $target) {
    if (data.success) {
        var cpuload = data.cpu_load;
        var label = data.cpu_load_time;
        // log('tim', label);
        for (var i = 0; i < label.length; i++) {
            label[i] = formatted_time(label[i])
            // log('label', label[i])
        }
        ;
        var lineChartData = {
            labels: label,
            datasets: [{
                label: 'cpu load rate (%)',
                fillColor: "rgba(220,220,220,0)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                data: cpuload,
            }]
        };
        log('t', $target)
        var ctx = $target[0].getContext("2d");
        CpuChartLive = new Chart(ctx).Line(lineChartData, {
            responsive: true,
            scaleOverride: true,
            scaleSteps: 10,
            scaleStepWidth: 10,
            scaleStartValue: 0,
            scaleShowVerticalLines: false,
        });
    } else {
        log('请求失败');
    }
};

var cpuLoadPeriod = function (data, $target) {
    if (data.success) {
        var cpuload = data.cpu_load_couples;
        $target.highcharts({
            chart: {
                type: 'spline',
                zoomType: 'x'
            },

            title: {
                text: 'cpu load rate over time'
            },

            subtitle: {
                text: document.ontouchstart === undefined ?
                    '点击并拖动鼠标放大局部' : '两指拉动图表放大局部'
            },

            xAxis: {
                type: 'datetime',
                title: {
                    text: 'Date'
                },
                dateTimeLabelFormats: {
                    second: '%H:%M:%S',
                    minute: '%H:%M',
                    hour: '%H:%M',
                    day: '%e. %b',
                    week: '%e. %b',
                    month: '%b \'%y',
                    year: '%Y'
                }
            },

            yAxis: {
                title: {
                    text: 'CPU load rate (%)'
                },

            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            },
            series: [{
                name: 'CPU load rate (%)',
                data: cpuload,
            }]
        });
    } else {
        log('请求失败');
    }
};

var updateCpuLoad = function (data) {
    if (data.success) {
        var cpuload = data.cpu_load;
        var cpuLoadTime = data.cpu_load_time;
        // ramLoadTime 有且只有1个元素
        var timestamp = cpuLoadTime[0];
        // timestamp = Date.now()
        CpuChartLive.addData(cpuload, formatted_time(timestamp));
    } else {
        log('请求失败');
    }
};
