var DiskChartSetup = function () {
    var diskLoadLiveUrl = 'dashboard/disk/data?limit=10';
    get(diskLoadLiveUrl, response = diskLoadLive, $target = $('#id-canvas-disk-live'));
    var diskLoadOneHourUrl = 'dashboard/disk/data?limit=3600';
    get(diskLoadOneHourUrl, response = diskLoadPeriod, $target = $('#id-div-disk-onehour'));
    var diskLoadOneDayUrl = 'dashboard/disk/data?limit=896400';
    get(diskLoadOneDayUrl, response = diskLoadPeriod, $target = $('#id-div-disk-oneday'));

    var tabAction = function (diskLive, diskOneHour, diskOneDay) {
        $('#id-canvas-disk-live').toggle(diskLive);
        $('#id-div-disk-onehour').toggle(diskOneHour);
        $('#id-div-disk-oneday').toggle(diskOneDay);
    };

    $('#id-button-disk-live').on('click', function () {
        var diskLive = true;
        var diskOneHour = false;
        var diskOneDay = false;
        tabAction(diskLive, diskOneHour, diskOneDay);
    });

    $('#id-button-disk-onehour').on('click', function () {
        var diskLive = false;
        var diskOneHour = true;
        var diskOneDay = false;
        tabAction(diskLive, diskOneHour, diskOneDay);
        // 显示一个小时的disk负载数据

    });

    $('#id-button-disk-oneday').on('click', function () {
        var diskLive = false;
        var diskOneHour = false;
        var diskOneDay = true;
        tabAction(diskLive, diskOneHour, diskOneDay);
        // 显示一天的disk负载数据
    });
};


var updateDiskChart = function () {
    // 请求实时单个disk负载数据
    var DiskLoadUrl = 'dashboard/disk/data?limit=1';
    setInterval(function () {
        barDiskChartDemo.removeData();
        get(DiskLoadUrl, updateDiskLoad)
    }, 3000);
};

var diskLoadLive = function (data, $target) {
    if (data.success) {
        var diskload = data.disk_load;
        var label = data.disk_load_time;
        for (var i = 0; i < label.length; i++) {
            label[i] = formatted_time(label[i])
        }
        ;
        var barChartData = {
            labels: label,
            datasets: [{
                fillColor: "#a9cef2",
                strokeColor: "#7cb5ec",
                data: diskload,
            }]
        };
        log('t', $target)
        var ctx = $target[0].getContext("2d");
        barDiskChartDemo = new Chart(ctx).Bar(barChartData, {
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

var diskLoadPeriod = function (data, $target) {
    if (data.success) {
        var diskload = data.disk_load_couples;
        $target.highcharts({
            chart: {
                type: 'spline'
            },
            title: {
                text: null
            },

            xAxis: {
                type: 'datetime',
                title: {
                    text: 'Date'
                }
            },

            yAxis: {
                title: {
                    text: 'KB/s'
                },
                min: 0
            },
            tooltip: {
                valueSuffix: 'KB/s'
            },

            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [{
                name: 'read',
                data: [
                    [Date.UTC(1970, 9, 21), 0],
                    [Date.UTC(1970, 10, 4), 0.28],
                    [Date.UTC(1970, 10, 9), 0.25],
                    [Date.UTC(1970, 10, 27), 0.2],
                    [Date.UTC(1970, 11, 2), 0.28],
                    [Date.UTC(1970, 11, 26), 0.28],
                    [Date.UTC(1970, 11, 29), 0.47],
                    [Date.UTC(1971, 0, 11), 0.79],
                    [Date.UTC(1971, 0, 26), 0.72],
                    [Date.UTC(1971, 1, 3), 1.02],
                    [Date.UTC(1971, 1, 11), 1.12],
                    [Date.UTC(1971, 1, 25), 1.2],
                    [Date.UTC(1971, 2, 11), 1.18],
                    [Date.UTC(1971, 3, 11), 1.19],
                    [Date.UTC(1971, 4, 1), 1.85],
                    [Date.UTC(1971, 4, 5), 2.22],
                    [Date.UTC(1971, 4, 19), 1.15],
                    [Date.UTC(1971, 5, 3), 0]
                ]
            }, {
                name: 'write',
                data: [
                    [Date.UTC(1970, 9, 29), 0],
                    [Date.UTC(1970, 10, 9), 0.4],
                    [Date.UTC(1970, 11, 1), 0.25],
                    [Date.UTC(1971, 0, 1), 1.66],
                    [Date.UTC(1971, 0, 10), 1.8],
                    [Date.UTC(1971, 1, 19), 1.76],
                    [Date.UTC(1971, 2, 25), 2.62],
                    [Date.UTC(1971, 3, 19), 2.41],
                    [Date.UTC(1971, 3, 30), 2.05],
                    [Date.UTC(1971, 4, 14), 1.7],
                    [Date.UTC(1971, 4, 24), 1.1],
                    [Date.UTC(1971, 5, 10), 0]
                ]
            }

            ]
        });
    } else {
        log('请求失败');
    }
};

var updateDiskLoad = function (data) {
    if (data.success) {
        var diskload = data.disk_load;
        var diskLoadTime = data.disk_load_time;
        // diskLoadTime 有且只有1个元素
        var timestamp = diskLoadTime[0];
        // timestamp = Date.now()
        barDiskChartDemo.addData(diskload, formatted_time(timestamp));
    } else {
        log('请求失败');
    }
};

