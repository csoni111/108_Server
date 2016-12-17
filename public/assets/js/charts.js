
function showCityWiseAmbulancesChart(drivers, count) {
  if($('.ct-chart-citywise').length) {
    $('.ct-chart-citywise').html("");
    let data = { series: drivers };
    new Chartist.Pie('.ct-chart-citywise', data, {
      labelInterpolationFnc: (value) => {
        return Math.round(value / count * 100) + '%';
      },
      labelPosition: 'inside',
      startAngle: 270
    });
  }
}

// if($('.ct-chart-os').length) { 
//   let data = {
//     series: [1300, 200, 605, 205, 100]
//   };

//   new Chartist.Pie('.ct-chart-os', data, {
//     labelInterpolationFnc: (value) => {
//       return Math.round(value / data.series.reduce(sum) * 100) + '%';
//     },
//     startAngle: 270,
//     donut: true,
//     donutWidth: 20,
//     labelPosition: 'outside',
//     labelOffset: -30
//   });
// }

// $(".tab-stats a[data-toggle='tab']").on("shown.bs.tab", (e) => {
//   $(e.currentTarget.hash).find('.chart').each(function(el, tab) {
//     tab.__chartist__.update();
//   });
// })

function showRequestsChart(labels, data) {
  if($('.ct-chart-request').length) {
    new Chartist.Line('.ct-chart-request', {
      labels: labels,
      series: [ data ]}, 
      {
        axisX: {
          position: 'center'
        },
        axisY: {
          offset: 0,
          showLabel: false,
          // labelInterpolationFnc: function(value) {
          //   return (value / 1000) + 'k';
          // }
        },
        chartPadding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
        height: 250,
        high: 2,
        showArea: true,
        stackBars: true,
        fullWidth: true,
        lineSmooth: true,
        plugins: [
        Chartist.plugins.ctPointLabels({
          textAnchor: 'left',
          labelInterpolationFnc: function(value) {
            if(parseInt(value) == 0) {
              return '';
            }
            return parseInt(value);
          }
        })
        ]
      }, [
      ['screen and (max-width: 768px)', {
        axisX: {
          offset: 0,
          showLabel: true
        },
        height: 180
      }]
      ]);
  }
}