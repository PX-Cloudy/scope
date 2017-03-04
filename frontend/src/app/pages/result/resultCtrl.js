/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.result')
      .controller('ResultCtrl', ResultCtrl)
      .controller('StatusAndDayCtrl', StatusAndDayCtrl);

  /** @ngInject */
  function ResultCtrl($scope, $filter, $stateParams, resultService, gameService) {
    $scope.smartTablePageSize = 12;
    $scope.smartDisplayedPage = 5;
    
    // Get result from backend
    var getResult = function(args){
      $scope.results = [];
      resultService.getResults(args).then(
        function(success){
            var results = success['results'];
            $scope.totalItemCount = success['count'];
            angular.forEach(results, function(value){
                $scope.results.push({
                    'uid': value.uid,
                    'GID': value.GID,
                    'theme': value.theme,
                    'data_desc': value.data_desc,
                    'status': value.status,
                    'execution': value.execution,
                    'execution_time': value.execution_time,
                    'day_filter': value.day_filter,
                    'recall_filter': value.recall_filter,
                    'recall_mark': value.recall_mark,
                    'cluster_filter': value.cluster_filter,
                    'cluster_mark': value.cluster_mark,
                    'version': value.version,
                });
            });
            $scope.displayed = [];
        },
        function(error){
            console.log(error);
        }
      ); 
    } //end getResult
    
    var refresh = function(changeObj){
        var resultArgs = {};
        if(gameService.getVersionSelected().value!=0)
            resultArgs['version'] = gameService.getVersionSelected().value;
        if(gameService.getGameSelected().value!=0)
            resultArgs['game'] = gameService.getGameSelected().value;
        if(gameService.getPlatformSelected().value!=0)
            resultArgs['platform'] = gameService.getPlatformSelected().value;
        if(resultService.getResultStatusSelected().value!=0)
            resultArgs['status'] = resultService.getResultStatusSelected().value;
        if(resultService.getResultDayFilterSelected().value!=0)
            resultArgs['day_filter'] = resultService.getResultDayFilterSelected().value;
        resultArgs['execution'] = $stateParams.execution;
        
        for(var key in changeObj){
            if(changeObj[key]){
                resultArgs[key] = changeObj[key];
            }
        }
        getResult(resultArgs);
        
    
    };

    refresh({}); // init

    $scope.$on('versionChanged', function(event, changedValue){
        refresh({'version':changedValue.value});
    });

    $scope.$on('resultDayFilterChanged', function(event, changedValue){
        refresh({'day_filter':changedValue.value});
    });

    $scope.$on('resultStatusChanged', function(event, changedValue){
        refresh({'status':changedValue.value});
    });

    $scope.pageChanged = function(page){
        $scope.currentPage=page
        refresh({'page':page});
    };

  }// end ResultCtrl 

  function StatusAndDayCtrl($scope, $rootScope, resultService){

    $scope.dayFilter = [
      {'label':'ALL','value':0},
      {'label':'true','value':'true'},
      {'label':'false','value':'false'},
    ];

    var vm = this;
    var statusSelected = resultService.getResultStatusSelected();
    var daySelected = resultService.getResultDayFilterSelected();
    vm.daySelected = daySelected

    // get result status and render list
    var getResultStatus = function(){
      $scope.resultStatus= [{'label':'ALL','value':0}];
      resultService.getResultStatus().then(
        function(success){
          angular.forEach(success, function(value, index){
            $scope.resultStatus.push({
              'label': index,
              'value': index,
            });
          });
          vm.statusSelected = statusSelected;
        },
        function(error){});
    };
    getResultStatus();

    $scope.dayOnSelect = function(item, model){
      resultService.setResultDayFilterSelected(model);
      $rootScope.$broadcast('resultDayFilterChanged', model);
    };
    $scope.statusOnSelect = function(item, model){
      resultService.setResultStatusSelected(model);
      $rootScope.$broadcast('resultStatusChanged', model);
    
    };
  }

})();
