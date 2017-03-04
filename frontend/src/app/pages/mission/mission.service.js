(function(){
    'use strict';
    angular.module('BlurAdmin.pages.mission')
        .service('missionService', missionService);

    function missionService($http, $q, localStorageService){
        return{
            getMissions: function(args){
                var deferred = $q.defer();
                $http.get(BACKEND + '/api/mission/', {params:args}).then(
                    function(success){
                        success.status = 1;
                        deferred.resolve(success['data']);
                    },
                    function(error){
                        error.status = 0;
                        deferred.reject(error);
                    }
                )
                return deferred.promise;
            },

            createMission: function(args){
                var deferred = $q.defer();
                var token = localStorageService.get('Authorization');
                $http.post(
                  BACKEND + '/api/mission/',args,
                  {headers: {'Authorization':'Token '+ token, 'Content-Type':'application/json; charset=utf-8'}}).then(
                    function(success){
                        success.status = 1;
                        deferred.resolve(success['data']);
                    },
                    function(error){
                        error.status = 0;
                        deferred.reject(error);
                    }
                );
                return deferred.promise;
            },

            updateMission: function(args){
                var deferred = $q.defer();
                var token = localStorageService.get('Authorization');
                $http.put(
                  BACKEND + '/api/mission/' + args['id'] + '/', args,
                  {headers:{'Authorization':'Token '+ token, 'Content-Type':'application/json; charset=utf-8'}}).then(
                    function(success){
                        success.status = 1;
                        deferred.resolve(success['data']);
                    },
                    function(error){
                        error.status = 0;
                        deferred.reject(error);
                    }
                );
                return deferred.promise;
            },

            getMissionTypes: function(){
                var deferred = $q.defer();
                $http.get(BACKEND + '/api/missiontype/').then(
                    function(success){
                        success.status = 1;
                        deferred.resolve(success['data']);
                    },
                    function(error){
                        error.status = 0;
                        deferred.reject(error);
                    }
                )
                return deferred.promise;
            },

            getMissionStatus: function(){
                var deferred = $q.defer();
                $http.get(BACKEND + '/api/missionstatus/').then(
                    function(success){
                        success.status = 1;
                        deferred.resolve(success['data']);
                    },
                    function(error){
                        error.status = 0;
                        deferred.reject(error);
                    }
                )
                return deferred.promise;
            },

            getExecutions: function(args){
                var deferred = $q.defer();
                $http.get(BACKEND + '/api/missionexecution/', {params:args}).then(
                    function(success){
                        success.status = 1;
                        deferred.resolve(success['data']);
                    },
                    function(error){
                        error.status = 0;
                        deferred.reject(error);
                    }
                )
                return deferred.promise;
            },

            getMissionStatusSelected: function(){
                if(localStorageService.get('missionStatusSelected'))
                    return localStorageService.get('missionStatusSelected')
                else
                    return ''
            },

            setMissionStatusSelected: function(state){
                localStorageService.set('missionStatusSelected', state);
            },

            getMissionTypeSelected: function(){
                if(localStorageService.get('missionTypeSelected'))
                    return localStorageService.get('missionTypeSelected')
                else
                    return ''
            },

            setMissionTypeSelected: function(type){
                localStorageService.set('missionTypeSelected', type);
            },

        } 
    }

})();
