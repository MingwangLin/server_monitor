



var data = {
	labels : ["January","February","March","April","May","June","July"],
	datasets : [
		{
			fillColor : "rgba(155,210,230,.05)",
			strokeColor : "rgb(115,180,190)",
			pointColor : "#424647",
			pointStrokeColor : "rgb(115,180,190)",
			data : [65,59,90,41,56,55,40]
		},
		{
			fillColor : "rgba(235,145,145,.05)",
			strokeColor : "rgb(180,100,100)",
			pointColor : "#424647",
			pointStrokeColor : "rgb(180,100,100)",
			data : [28,48,40,19,96,27,100]
		},
    {
			fillColor : "rgba(220,240,145,.05)",
			strokeColor : "rgb(180,185,135)",
			pointColor : "#424647",
			pointStrokeColor : "rgb(180,185,135)",
			data : [8,35,35,1,78,45,80]
		}
	]
}


var ctx = document.getElementById("myChart").getContext("2d");
new Chart(ctx).Line(data, {
	scaleOverlay : false,
	scaleOverride : true,
	scaleSteps : 10,
	scaleStepWidth : 10,
	scaleStartValue : 0,

	scaleLineColor : "rgba(0,0,0,.25)",
	scaleLineWidth : 1,

	scaleShowLabels : true,
	scaleLabel : "<%=value%>",
	scaleFontFamily : "'Lato'",
	scaleFontSize : 12,
	scaleFontStyle : "800",
	scaleFontColor : "#222",

	scaleShowGridLines : true,
	scaleGridLineColor : "rgba(0,0,0,.1)",
	scaleGridLineWidth : 1,

	bezierCurve : true,

	pointDot : true,
	pointDotRadius : 5,
	pointDotStrokeWidth : 1,

	datasetStroke : true,
	datasetStrokeWidth : 1,
	datasetFill : true,

	animation : true,
	animationSteps : 120,
	animationEasing : "easeOutQuart",
	onAnimationComplete : null
});









var pie = document.getElementById("pieChart").getContext("2d");
new Chart(pie).Doughnut([
	{ value: 50, color: "rgba(180,100,100,1)" },
	{ value: 50, color: '#424647' }
], {
  segmentShowStroke: false,
  percentageInnerCutout : 90,
});

var pie2 = document.getElementById("pieChart2").getContext("2d");
new Chart(pie2).Doughnut([
	{ value: 80, color: "rgba(180,100,100,.75)" },
	{ value: 20, color: '#424647' }
], {
  segmentShowStroke: false,
  percentageInnerCutout : 80,
});

var pie3 = document.getElementById("pieChart3").getContext("2d");
new Chart(pie3).Doughnut([
	{ value: 90, color: "rgba(180,100,100,.5)" },
	{ value: 10, color: '#424647' }
], {
  segmentShowStroke: false,
  percentageInnerCutout : 96,
});




var dn1 = document.getElementById("dnChart1").getContext("2d");
new Chart(dn1).Doughnut([
	{ value: 20, color: "rgba(180,185,135,.5)" },
	{ value: 80, color: 'rgba(0,0,0,0)' }], {
    segmentShowStroke : false,
    percentageInnerCutout : 85,
});

var dn2 = document.getElementById("dnChart2").getContext("2d");
new Chart(dn2).Doughnut([
	{ value: 20, color: "rgba(180,100,100,0)" },
	{ value: 50, color: "rgba(180,185,135,1)" },
	{ value: 30, color: 'rgba(0,0,0,0)' }], {
    segmentShowStroke : false,
    percentageInnerCutout : 70,
});


var dn3 = document.getElementById("dnChart3").getContext("2d");
new Chart(dn3).Doughnut([
	{ value: 70, color: "rgba(180,100,100,0)" },
	{ value: 30, color: "rgba(180,185,135,.7)" }], {
    segmentShowStroke : false,
    percentageInnerCutout : 78,
});

var dn4 = document.getElementById("dnChart4").getContext("2d");
new Chart(dn4).Pie([
{ value: 20, color: "rgba(0,0,0,0)" },
{ value: 50, color: "rgba(0,0,0,0)" },
	{ value: 30, color: "rgba(0,0,0,0)" }], {
    segmentStrokeColor : "#424647",
    segmentStrokeWidth : 1
});