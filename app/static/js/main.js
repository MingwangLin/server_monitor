$(document).ready(function(){
        __main();
});

var __main = function() {
    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });
    CpuChartSetup();
    RamChartSetup();
    updateCpuChart();
    updateRamChart();
    $('#id-button-cpu-live').click();
    $('#id-button-ram-live').click();
  }