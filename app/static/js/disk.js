var DiskChartSetup = function () {
    var diskLoadLiveUrl = 'dashboard/disk/data?limit=10';
    get(diskLoadLiveUrl, response = diskLoadLive, $target = $('#id-canvas-disk-live'));
    var diskLoadOneMinUrl = 'dashboard/disk/data?limit=20';
    get(diskLoadOneMinUrl, response = diskLoadPeriod, $target = $('#id-div-disk-oneminute'));
    var diskLoadOneHourUrl = 'dashboard/disk/data?limit=1200';
    get(diskLoadOneHourUrl, response = diskLoadPeriod, $target = $('#id-div-disk-onehour'));

    var tabAction = function (diskLive, diskOneMin, diskOneHour) {
        $('#id-canvas-disk-live').toggle(diskLive);
        $('#id-div-disk-oneminute').toggle(diskOneMin);
        $('#id-div-disk-onehour').toggle(diskOneHour);
    };

    $('#id-button-disk-live').on('click', function () {
        var diskLive = true;
        var diskOneMin = false;
        var diskOneHour = false;
        tabAction(diskLive, diskOneMin, diskOneHour);
    });

    $('#id-button-disk-oneminute').on('click', function () {
        var diskLive = false;
        var diskOneMin = true;
        var diskOneHour = false;
        tabAction(diskLive, diskOneMin, diskOneHour);
        // 显示一分钟的disk负载数据

    });

    $('#id-button-disk-onehour').on('click', function () {
        var diskLive = false;
        var diskOneMin = false;
        var diskOneHour = true;
        tabAction(diskLive, diskOneMin, diskOneHour);
        // 显示一个小时的disk负载数据
    });
};


var updateDiskChart = function () {
    // 请求实时单个disk负载数据
    var DiskLoadUrl = 'dashboard/disk/data?limit=1';
    setInterval(function () {
        DiskChartLive.removeData();
        get(DiskLoadUrl, updateDiskLoad)
    }, 3000);
};

var diskLoadLive = function (data, $target) {
    if (data.success) {
        var diskread = data.disk_read;
        log('r', diskread);
        var diskwrtn = data.disk_wrtn;
        log('w', diskwrtn);
        var label = data.disk_io_time;
        for (var i = 0; i < label.length; i++) {
            label[i] = formatted_time(label[i])
        }
        ;
        log('label', label);
        var lineChartData = {
            labels: label,
            datasets: [{
                label: "read(KB/s)",
                fillColor: "rgba(220,220,220,0)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                data: diskread
            }, {
                label: "write(KB/s)",
                fillColor: "rgba(220,220,220,0)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                data: diskwrtn
            }]
        };
        log('t', $target);
        var ctx = $target[0].getContext("2d");
        DiskChartLive = new Chart(ctx).Line(lineChartData, {
            animationSteps: 60,
            responsive: true,
            scaleShowVerticalLines: false,
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
                type: 'spline',
                zoomType: 'x'
            },


            title: {
                text: 'disk I/O over time'
            },

            subtitle: {
                text: document.ontouchstart === undefined ?
                    '点击并拖动鼠标放大局部' : '两指拉动图表放大局部'
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
            //
            // legend: {
            //     layout: 'vertical',
            //     align: 'right',
            //     verticalAlign: 'middle',
            //     borderWidth: 0
            // },
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
        var disktime = data.disk_io_time;
        // diskread, diskwrtn, diskLoadTime 有且只有1个元素
        var timestamp = disktime[0];
        var diskread = diskread[0];
        log('diskread1', diskread);
        var diskwrtn = diskwrtn[0];
        log('diskwrtn1', diskwrtn);
        DiskChartLive.addData([diskread, diskwrtn], formatted_time(timestamp));
    } else {
        log('请求失败');
    }
};

