var RamChartSetup = function () {
    var ramLoadLiveUrl = 'dashboard/ram/data?limit=10';
    get(ramLoadLiveUrl, response = ramLoadLive, $target = $('#id-canvas-ram-live'));
    var ramLoadOneHourUrl = 'dashboard/ram/data?limit=3600';
    get(ramLoadOneHourUrl, response = ramLoadPeriod, $target = $('#id-div-ram-onehour'));
    var ramLoadOneDayUrl = 'dashboard/ram/data?limit=896400';
    get(ramLoadOneDayUrl, response = ramLoadPeriod, $target = $('#id-div-ram-oneday'));

    var tabAction = function (ramLive, ramOneHour, ramOneDay) {
        $('#id-canvas-ram-live').toggle(ramLive);
        $('#id-div-ram-onehour').toggle(ramOneHour);
        $('#id-div-ram-oneday').toggle(ramOneDay);
    };

    $('#id-button-ram-live').on('click', function () {
        var ramLive = true;
        var ramOneHour = false;
        var ramOneDay = false;
        tabAction(ramLive, ramOneHour, ramOneDay);
    });

    $('#id-button-ram-onehour').on('click', function () {
        var ramLive = false;
        var ramOneHour = true;
        var ramOneDay = false;
        tabAction(ramLive, ramOneHour, ramOneDay);
        // 显示一个小时的ram负载数据

    });

    $('#id-button-ram-oneday').on('click', function () {
        var ramLive = false;
        var ramOneHour = false;
        var ramOneDay = true;
        tabAction(ramLive, ramOneHour, ramOneDay);
        // 显示一天的ram负载数据
    });
};


var updateRamChart = function () {
    // 请求实时单个ram负载数据
    var RamLoadUrl = 'dashboard/ram/data?limit=1';
    setInterval(function () {
        barRamChartDemo.removeData();
        get(RamLoadUrl, updateRamLoad)
    }, 3000);
};

var ramLoadLive = function (data, $target) {
    if (data.success) {
        var ramload = data.ram_load;
        var label = data.ram_load_time;
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
                data: ramload,
            }]
        };
        log('t', $target)
        var ctx = $target[0].getContext("2d");
        barRamChartDemo = new Chart(ctx).Bar(barChartData, {
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

var ramLoadPeriod = function (data, $target) {
    if (data.success) {
        var ramload = data.ram_load_couples;
        log('ramLoadPeriodData', ramload)
        $target.highcharts({
            chart: {
                zoomType: 'x'
            },

            title: {
                text: 'RAM load chart'
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
                    text: 'RAM load rate (%)'
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
                name: 'RAM load rate (%)',
                data: ramload,
            }]
        });
    } else {
        log('请求失败');
    }
};

var updateRamLoad = function (data) {
    if (data.success) {
        log('ramData', data);
        var ramload = data.ram_load;
        var ramLoadTime = data.ram_load_time;
        // ramLoadTime 有且只有1个元素
        var timestamp = ramLoadTime[0];
        log('data', data, typeof Number(data));
        // timestamp = Date.now()
        barRamChartDemo.addData(ramload, formatted_time(timestamp));
    } else {
        log('请求失败');
    }
};
