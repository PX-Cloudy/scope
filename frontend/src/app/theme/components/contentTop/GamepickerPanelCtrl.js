/**
 * @author v.lugovsky
 * created on 22.04.2016
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
      .controller('GamepickerPanelCtrl', GamepickerPanelCtrl);

  /** @ngInject */
  function GamepickerPanelCtrl($scope, $http, gameService) {

    var gameSelected = gameService.getGameSelected();
    var platformSelected = gameService.getPlatformSelected();
    var versionSelected = gameService.getVersionSelected();

    gameService.getGames().then(
        function(success){
            $scope.games= [{'label':'ALL', 'value':0}];
            angular.forEach(success, function(value){
                $scope.games.push(value)
            });
            $scope.gameSelected = gameSelected;
        },
        function(error){
            console.log(error);
        }
    );

    gameService.getPlatforms().then(
        function(success){
            $scope.platforms = [{'label':'ALL', 'value':0}];
            angular.forEach(success, function(value){
                $scope.platforms.push(value)
            });
            $scope.platformSelected = platformSelected;
        },
        function(error){
            console.log(error);
        }
    );
    
    var verArgs = {};
    if(gameSelected.value!=0)
        verArgs['game'] = gameSelected.value;
    if(platformSelected.value!=0)
        verArgs['platform'] = platformSelected.value;

    gameService.getVersions(verArgs).then(
        function(success){
            $scope.versions = [{'label':'ALL', 'value':0}];
            angular.forEach(success, function(value){
                $scope.versions.push(value)
            });
            $scope.versionSelected = versionSelected;
        },
        function(error){
            console.log(error);
        }
    );
    
    $scope.versionOnSelect = function(item, model){
        gameService.setVersionSelected(model);
    };

    $scope.gameOnSelect = function(item, model){
        gameService.setGameSelected(model);

        var params = {};
        if(model.value!=0)
            params['game'] = model.value;
        if(gameService.getPlatformSelected().value!=0)
            params['platform'] = gameService.getPlatformSelected().value;

        gameService.getVersions(params).then(
             function(success){
                $scope.versions = [{'label':'ALL','value':0}];
                angular.forEach(success, function(value){
                    $scope.versions.push(value)
                });
            },
            function(error){
                console.log(error);
            }
        );
    };

    $scope.platformOnSelect = function(item, model){
        gameService.setPlatformSelected(model);

        var params = {};
        if(model.value!=0)
            params['platform'] = model.value;
        if(gameService.getGameSelected().value!=0)
            params['game'] = gameService.getGameSelected().value;

        gameService.getVersions(params).then(
             function(success){
                $scope.versions = [{'label':'ALL','value':0}];
                angular.forEach(success, function(value){
                    $scope.versions.push(value)
                });
            },
            function(error){
                console.log(error);
            }
        );
    };

  }
})();
