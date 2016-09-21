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
    $('#id-button-cpu-live').click();
    $('#id-button-ram-live').click();
    updateRamChart();
    updateCpuChart();
};