var RamChartSetup = function () {
    var ramLoadLiveUrl = 'dashboard/ram/data?limit=10';
    get(ramLoadLiveUrl, response = ramLoadLive, $target = $('#id-canvas-ram-live'));
    var ramLoadOneHourUrl = 'dashboard/ram/data?limit=1200';
    get(ramLoadOneHourUrl, response = ramLoadPeriod, $target = $('#id-div-ram-onehour'));
    var ramLoadOneDayUrl = 'dashboard/ram/data?limit=298800';
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
        RamCharLive.removeData();
        get(RamLoadUrl, updateRamLoad)
    }, 3000);
};

var ramLoadLive = function (data, $target) {
    if (data.success) {
        var ramload = data.ram_load;
        var label = data.ram_load_time;
        for (var i = 0; i < label.length; i++) {
            label[i] = formatted_time(label[i])
        }
        ;
        var lineChartData = {
            labels: label,
            datasets: [{
                label: 'memory load rate (%)',
                fillColor: "rgba(220,220,220,0)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                data: ramload,
            }]
        };
        log('t', $target)
        var ctx = $target[0].getContext("2d");
        RamCharLive = new Chart(ctx).Line(lineChartData, {
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

var ramLoadPeriod = function (data, $target) {
    if (data.success) {
        var ramload = data.ram_load_couples;
        $target.highcharts({
            chart: {
                chart: {
                    type: 'spline'
                },
                zoomType: 'x'
            },

            title: {
                text: 'ram load rate over time'
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
        var ramload = data.ram_load;
        var ramLoadTime = data.ram_load_time;
        // ramLoadTime 有且只有1个元素
        var timestamp = ramLoadTime[0];
        // timestamp = Date.now()
        RamCharLive.addData(ramload, formatted_time(timestamp));
    } else {
        log('请求失败');
    }
};
