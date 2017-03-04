/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboard')
      .controller('DashboardPieChartCtrl', DashboardPieChartCtrl);

  /** @ngInject */
  function DashboardPieChartCtrl($scope, $timeout, baConfig, baUtil, gameService, dashboardService) {
    var pieColor = baUtil.hexToRGB(baConfig.colors.defaultText, 0.2);

    $scope.charts = [{
      color: pieColor,
      description: 'Successed Users',
      stats: '0',
      icon: 'face',
    }, {
      color: pieColor,
      description: 'Failed Users',
      stats: '0',
      icon: 'money',
    }, {
      color: pieColor,
      description: 'UnStarted Users',
      stats: '0',
      icon: 'person',
    }, {
      color: pieColor,
      description: 'Filter Users',
      stats: '0',
      icon: 'refresh',
    }
    ];
    
    function loadPieCharts() {
      $('.chart').each(function () {
        var chart = $(this);
        chart.easyPieChart({
          easing: 'easeOutBounce',
          onStep: function (from, to, percent) {
            $(this.el).find('.percent').text(Math.round(percent));
          },
          barColor: chart.attr('rel'),
          trackColor: 'rgba(0,0,0,0)',
          size: 84,
          scaleLength: 0,
          animation: 2000,
          lineWidth: 9,
          lineCap: 'round',
        });
      });

      $('.refresh-data').on('click', function () {
        updatePieCharts();
      });
    }

    function updatePieCharts(total) {
      $('.pie-charts .chart').each(function(index, chart) {
        if($scope.charts[index]['stats']&&total)
          $(chart).data('easyPieChart').update((100 * $scope.charts[index]['stats']/total).toFixed(0));
        else
          $(chart).data('easyPieChart').update(0);

      });
    }

    $timeout(function () {
      loadPieCharts();
      updatePieCharts(0);
    }, 500);

    var getResultSummary = function(args){
      dashboardService.getResultSummary(args).then(
        function(success){
            console.log(success); 
            $scope.charts = [{
              color: pieColor,
              description: 'Successed Users',
              stats: '',
              icon: 'face',
            }, {
              color: pieColor,
              description: 'Failed Users',
              stats: '',
              icon: 'money',
            }, {
              color: pieColor,
              description: 'UnStarted Users',
              stats: '',
              icon: 'person',
            }, {
              color: pieColor,
              description: 'Filter Users',
              stats: '',
              icon: 'refresh',
            }
            ];
            $scope.charts[0]['stats'] = success['succeeded'];
            $scope.charts[1]['stats'] = success['failed'];
            $scope.charts[2]['stats'] = success['unstarted'];
            $scope.charts[3]['stats'] = success['filtered'];

            $timeout(function () {
              loadPieCharts();
              updatePieCharts(success['total']);
            }, 500);

        },
        function(error){});
    };

    var resultArgs = {};
    if(gameService.getVersionSelected().value!=0)
        resultArgs['version'] = gameService.getVersionSelected().value;
    if(gameService.getGameSelected().value!=0)
        resultArgs['game'] = gameService.getGameSelected().value;
    if(gameService.getPlatformSelected().value!=0)
        resultArgs['platform'] = gameService.getPlatformSelected().value;

    getResultSummary(resultArgs);

    $scope.$on('versionChanged', function(event, changedValue){
        var tmp = {};
        if(changedValue.value!=0)
            tmp['version'] = changedValue.value
        if(gameService.getGameSelected().value!=0)
            tmp['game'] = gameService.getGameSelected().value;
        if(gameService.getPlatformSelected().value!=0)
            tmp['platform'] = gameService.getPlatformSelected().value;
        getResultSummary(tmp);
    });

  }
})();
