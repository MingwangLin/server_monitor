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
        var diskread = data.disk_read;
        var diskwrtn = data.disk_wrtn;
        var label = data.disk_io_time;
        for (var i = 0; i < label.length; i++) {
            label[i] = formatted_time(label[i])
        }
        ;
        var barChartData = {
            labels: label,
            datasets: [{
                label: "wirte(KB/s)",
                fillColor: "#a9cef2",
                strokeColor: "#7cb5ec",
                data: diskread,
            }, {
                label: "read(KB/s)",
                fillColor: "#959598",
                strokeColor: "#46464b",
                data: diskwrtn,
            }]
        };
        log('t', $target)
        var ctx = $target[0].getContext("2d");
        barDiskChartDemo = new Chart(ctx).Bar(barChartData, {
            responsive: false,
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
        var diskread = data.disk_read_couples;
        var diskwrtn = data.disk_wrtn_couples;
        $target.highcharts({
            chart: {
                type: 'spline'
            },

            title: {
                text: 'disk I/O over time'
            },

            subtitle: {
                text: document.ontouchstart === undefined ?
                    '点击并拖动鼠标放大局部' : 'Pinch the chart to zoom in'
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
                data: diskread
            }, {
                name: 'write',
                data: diskwrtn
            }
            ]
        });
    } else {
        log('请求失败');
    }
};

var updateDiskLoad = function (data) {
    if (data.success) {
        var diskread = data.disk_read;
        var diskwrtn = data.disk_wrtn;
        var diskLoadTime = data.disk_io_time;
        // diskread, diskwrtn, diskLoadTime 有且只有1个元素
        var timestamp = disk_io_time[0];
        var diskread = disk_read[0];
        var diskwrtn = disk_wrtn[0];
        barDiskChartDemo.addData([diskread, diskwrtn], formatted_time(timestamp));
    } else {
        log('请求失败');
    }
};

