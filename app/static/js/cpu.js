var CpuChartSetup = function () {
    var cpuLoadLiveUrl = 'dashboard/cpu/data?limit=10';
    get(cpuLoadLiveUrl, response = cpuLoadLive, $target = $('#id-canvas-cpu-live'));
    var cpuLoadOneHourUrl = 'dashboard/cpu/data?limit=3600';
    get(cpuLoadOneHourUrl, response = cpuLoadPeriod, $target = $('#id-div-cpu-onehour'));
    var cpuLoadOneDayUrl = 'dashboard/cpu/data?limit=896400';
    get(cpuLoadOneDayUrl, response = cpuLoadPeriod, $target = $('#id-div-cpu-oneday'));

    var tabAction = function (cpuLive, cpuOneHour, cpuOneDay) {
        $('#id-canvas-cpu-live').toggle(cpuLive);
        $('#id-div-cpu-onehour').toggle(cpuOneHour);
        $('#id-div-cpu-oneday').toggle(cpuOneDay);
    };

    $('#id-button-cpu-live').on('click', function () {
        var cpuLive = true;
        var cpuOneHour = false;
        var cpuOneDay = false;
        tabAction(cpuLive, cpuOneHour, cpuOneDay);
    });

    $('#id-button-cpu-onehour').on('click', function () {
        var cpuLive = false;
        var cpuOneHour = true;
        var cpuOneDay = false;
        tabAction(cpuLive, cpuOneHour, cpuOneDay);
        // 请求一个小时的cpu负载数据

    });

    $('#id-button-cpu-oneday').on('click', function () {
        var cpuLive = false;
        var cpuOneHour = false;
        var cpuOneDay = true;
        tabAction(cpuLive, cpuOneHour, cpuOneDay);
        // 请求一天的cpu负载数据
    });
};

var updateCpuChart = function () {
    // 请求实时单个cpu负载数据
    var CpuLoadUrl = 'dashboard/cpu/data?limit=1';
    setInterval(function () {
        barCpuChartDemo.removeData();
        get(CpuLoadUrl, updateCpuLoad)
    }, 5000);
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
        barCpuChartDemo = new Chart(ctx).Bar(barChartData, {
            responsive: true,
            barValueSpacing: 2,
            scaleOverride: true,
            scaleSteps: 10,
            scaleStepWidth: 10,
            scaleStartValue: 0
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
                zoomType: 'x'
            },

            title: {
                text: 'CPU load chart'
            },

            xAxis: {
                type: 'datetime',
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
    ;
};

var updateCpuLoad = function (data) {
    if (data.success) {
        var cpuload = data.cpu_load;
        var cpuLoadTime = data.cpu_load_time;
        // ramLoadTime 有且只有1个元素
        var timestamp = cpuLoadTime[0];
        // timestamp = Date.now()
        barCpuChartDemo.addData(cpuload, formatted_time(timestamp));
    } else {
        log('请求失败');
    }
};
