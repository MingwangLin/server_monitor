var dData = function() {
  return Math.round(Math.random() * 90) + 10
};

var data = [];
for (i = 0; i < 10; i++) {
    data.push(dData());
};

var barChartData = {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    datasets: [{
    fillColor: "#ffe0e6",
    strokeColor: "#ff6384",
    data: data
  }]
};

var index = 11;
var ctx = document.getElementById("canvas").getContext("2d");
var barChartDemo = new Chart(ctx).Bar(barChartData, {
  responsive: true,
  barValueSpacing: 2
});

setInterval(function() {
  barChartDemo.removeData();
  barChartDemo.addData([dData()], index);
  index++;
}, 3000);