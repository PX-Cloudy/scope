/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboard')
      .controller('TrafficChartCtrl', TrafficChartCtrl);

  /** @ngInject */
  function TrafficChartCtrl($scope, baConfig, colorHelper, gameService, missionService) {

    $scope.transparent = baConfig.theme.blur;
    var dashboardColors = baConfig.colors.dashboard;

    var getMission = function(args){
      $scope.missions = [];
      $scope.doughnutData = [
        {
          value: 0,
          color: dashboardColors.white,
          highlight: colorHelper.shade(dashboardColors.white, 15),
          label: 'PROCESSING',
          percentage: 0,
          order: 0,
        }, {
          value: 0,
          color: dashboardColors.blueStone,
          highlight: colorHelper.shade(dashboardColors.blueStone, 15),
          label: 'COMPLETED',
          percentage: 0,
          order: 1,
        }, {
          value: 0,
          color: dashboardColors.surfieGreen,
          highlight: colorHelper.shade(dashboardColors.surfieGreen, 15),
          label: 'STARTED',
          percentage: 0,
          order: 2,
        }, {
          value: 0,
          color: dashboardColors.gossip,
          highlight: colorHelper.shade(dashboardColors.gossip, 15),
          label: 'STOPPED',
          percentage: 0,
          order: 3,
        },
      ];

      missionService.getMissions(args).then(
        function(success){
          var results = success['results'];
          angular.forEach(results, function(value){
              $scope.missions.push({
                  'id': value.id,
                  'type': value.mission_type,
                  'name': value.name,
                  'status': value.status,
                  'executed': value.executed,
                  'succeeded': value.succeeded,
                  'failed': value.failed,
                  'processing': value.processing,
                  'editable': value.editable,
                  'version': value.version,
                  'template': value.template,
                  'recallml': value.recallml,
                  'clusterml': value.clusterml,
                  'filter_day': value.filter_day,
                  'once_exedatetime': value.once_exedatetime,
                  'celery_periodtask': value.celery_periodtask
              });

              if(value.status == 'started')
                $scope.doughnutData[2].value = $scope.doughnutData[2].value + 1;
              else if(value.status == 'stopped')
                $scope.doughnutData[3].value = $scope.doughnutData[3].value + 1;
              else if(value.status == 'completed')
                $scope.doughnutData[1].value = $scope.doughnutData[1].value + 1;
             
              if(value.processing)
                $scope.doughnutData[0].value = $scope.doughnutData[0].value + 1;

          });
          $scope.total = $scope.missions.length;
          for(var i=0;i<4;i++){
            if($scope.doughnutData[i].value)
              $scope.doughnutData[i].percentage = (($scope.doughnutData[i].value / $scope.total)*100).toFixed(0);
            else
              $scope.doughnutData[i].percentage = 0;
          }

          var ctx = document.getElementById('chart-area').getContext('2d');
          window.myDoughnut = new Chart(ctx).Doughnut($scope.doughnutData, {
            segmentShowStroke: false,
            percentageInnerCutout : 64,
            responsive: true,
            showTooltips: false
          });

        },
        function(error){
          console.log(error);
        }
      ); 
    } //end getMissions

    var resultArgs = {};
    if(gameService.getVersionSelected().value!=0)
        resultArgs['version'] = gameService.getVersionSelected().value;
    if(gameService.getGameSelected().value!=0)
        resultArgs['game'] = gameService.getGameSelected().value;
    if(gameService.getPlatformSelected().value!=0)
        resultArgs['platform'] = gameService.getPlatformSelected().value;

    getMission(resultArgs); // call getMission

    $scope.$on('versionChanged', function(event, changedValue){
        var tmp = {};
        if(changedValue.value!=0)
            tmp['version'] = changedValue.value
        if(gameService.getGameSelected().value!=0)
            tmp['game'] = gameService.getGameSelected().value;
        if(gameService.getPlatformSelected().value!=0)
            tmp['platform'] = gameService.getPlatformSelected().value;
        getMission(tmp);

    });

   
  }
})();
