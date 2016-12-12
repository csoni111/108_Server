if($('.ct-chart-browser').length) { 
  let data = {
    series: [1000, 480, 705, 105, 50]
  };

  let sum = (a, b) => { return a + b };

  new Chartist.Pie('.ct-chart-browser', data, {
    labelInterpolationFnc: (value) => {
      return Math.round(value / data.series.reduce(sum) * 100) + '%';
    },
    labelPosition: 'inside',
    startAngle: 270
  });
}

if($('.ct-chart-os').length) { 
  let data = {
    series: [1300, 200, 605, 205, 100]
  };

  let sum = (a, b) => { return a + b };

  new Chartist.Pie('.ct-chart-os', data, {
    labelInterpolationFnc: (value) => {
      return Math.round(value / data.series.reduce(sum) * 100) + '%';
    },
    startAngle: 270,
    donut: true,
    donutWidth: 20,
    labelPosition: 'outside',
    labelOffset: -30
  });
}

$(".tab-stats a[data-toggle='tab']").on("shown.bs.tab", (e) => {
  $(e.currentTarget.hash).find('.chart').each(function(el, tab) {
    tab.__chartist__.update();
  });
})


if($('.ct-chart-sale').length) {
  new Chartist.Line('.ct-chart-sale', {
    labels: ["10:20", "10:30", "10:40", "10:50", "11:00", "11:10", "11:20", "11:30", "11:40", "11:50", "12:00", "12:10", "12:20", "12:30", "12:40", "12:50", "13:00", "13:10", "13:20", "13:30"],
    series: [
    [2710 ,2810 ,4210 ,8010 ,19158 ,35326 ,80837 ,79477 ,88561 ,67807 ,70837 ,55261 ,66216 ,10516 ,13493 ,12000 ,14253 ,33506 ,56326 ,78986 ,20747 ,44165 ,13817],
    ]
  }, {
    axisX: {
      position: 'center'
    },
    axisY: {
      offset: 0,
      showLabel: false,
      labelInterpolationFnc: function(value) {
        return (value / 1000) + 'k';
      }
    },
    chartPadding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    },
    height: 250,
    high: 120000,
    showArea: true,
    stackBars: true,
    fullWidth: true,
    lineSmooth: false,
    plugins: [
    Chartist.plugins.ctPointLabels({
      textAnchor: 'left',
      labelInterpolationFnc: function(value) {
        return '$' + parseInt(value / 1000) + 'k'
      }
    })
    ]
  }, [
  ['screen and (max-width: 768px)', {
    axisX: {
      offset: 0,
      showLabel: false
    },
    height: 180
  }]
  ])
}