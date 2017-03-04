/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components', []).
    service('gameService', gameService)

  function gameService($http, $q, $rootScope, localStorageService){

    return {

        getGames: function(args){
            var deferred = $q.defer();
            var games = new Array();
            $http.get(BACKEND + '/api/games/', {params:args}).then(
                function(success){
                    var results = success['data']['results'];
                    angular.forEach(results, function(game){
                        games.push({'label':game.name, 'value': game.id});
                    });
                    deferred.resolve(games);
                },
                function(error){
                    deferred.resolve(games);
                }
            );
            return deferred.promise;
        },

        getPlatforms: function(args){
            var deferred = $q.defer();
            var games = new Array();
            $http.get(BACKEND + '/api/platforms/', {params:args}).then(
                function(success){
                    var results = success['data']['results'];
                    angular.forEach(results, function(game){
                        games.push({'label':game.name, 'value': game.id});
                    });
                    deferred.resolve(games);
                },
                function(error){
                    deferred.resolve(games);
                }
            );
            return deferred.promise;
 
        },

        getVersions: function(args){
            var deferred = $q.defer();
            var versions = new Array();
            $http.get(BACKEND + '/api/versions/', {params:args}).then(
                function(success){
                    var results = success['data']['results'];
                    angular.forEach(results, function(version){
                        versions.push({
                            'label':version.gamedb,
                            'value': version.id,
                            'game': version.game,
                            'platform': version.platform
                        });
                    });
                    deferred.resolve(versions);
                },
                function(error){
                    deferred.resolve(versions);
                }
            );
            return deferred.promise;
 
        },

        getGameSelected: function(){
            if(localStorageService.get('gameSelected'))
                return localStorageService.get('gameSelected')
            else
                return ''
        },

        setGameSelected: function(game){
            localStorageService.set('gameSelected', game);
        },

        getPlatformSelected: function(){
            if(localStorageService.get('platformSelected'))
                return localStorageService.get('platformSelected')
            else
                return ''
        },

        setPlatformSelected: function(platform){
            localStorageService.set('platformSelected', platform);
        },

        getVersionSelected: function(){
            if(localStorageService.get('versionSelected'))
                return localStorageService.get('versionSelected');
            else
                return ''
        },

        setVersionSelected: function(version){
            localStorageService.set('versionSelected', version);
            $rootScope.$broadcast('versionChanged',version)
        },
    }
  } // end game Service


})();
