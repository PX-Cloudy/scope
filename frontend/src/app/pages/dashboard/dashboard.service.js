(function(){
    'use strict';
    angular.module('BlurAdmin.pages.dashboard')
        .service('dashboardService', dashboardService);

    function dashboardService($http, $q, localStorageService){
        return{
           getResultSummary: function(args){
                var deferred = $q.defer();
                $http.get(BACKEND + '/api/pushresultsummary/', {params:args}).then(
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

        } 
    }

})();
