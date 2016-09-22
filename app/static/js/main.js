$(document).ready(function () {
    __main();
});

var __main = function () {
    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });
    RamChartSetup();
    CpuChartSetup();
    DiskChartSetup();
    $('#id-button-cpu-live').click();
    $('#id-button-ram-live').click();
    $('#id-button-disk-live').click();
    updateRamChart();
    updateCpuChart();
    updateDiskChart();
};