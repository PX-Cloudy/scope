(function(){
    'use strict';
    angular.module('BlurAdmin.pages.result')
        .service('resultService', resultService);

    function resultService($http, $q, localStorageService){
        return{
            getResults: function(args){
                var deferred = $q.defer();
                $http.get(BACKEND + '/api/pushresult/', {params:args}).then(
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

            getResultStatus: function(){
                var deferred = $q.defer();
                $http.get(BACKEND + '/api/pushresultstatus/').then(
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

            getResultStatusSelected: function(){
                if(localStorageService.get('resultStatusSelected'))
                    return localStorageService.get('resultStatusSelected')
                else
                    return ''
            },

            setResultStatusSelected: function(state){
                localStorageService.set('resultStatusSelected', state);
            },

            getResultDayFilterSelected: function(){
                if(localStorageService.get('resultDayFilterSelected'))
                    return localStorageService.get('resultDayFilterSelected')
                else
                    return ''
            },

            setResultDayFilterSelected: function(dayFilter){
                localStorageService.set('resultDayFilterSelected', dayFilter);
            },

        } 
    }

})();
