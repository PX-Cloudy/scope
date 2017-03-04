(function(){
    'use strict';
    angular.module('BlurAdmin.pages.login')
        .service('loginService', loginService);

    function loginService($http, $q, localStorageService){
        return{
            getToken: function(args){
                var deferred = $q.defer();
                $http.post(BACKEND + '/api-token-auth/', args).then(
                    function(success){
                        success.status = 1;
                        localStorageService.set('Authorization',success['data']['token']);
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
