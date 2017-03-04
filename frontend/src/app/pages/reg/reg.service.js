(function(){
    'use strict';
    angular.module('BlurAdmin.pages.reg')
        .service('regService', regService);

    function regService($http, $q){
        return{
            createUser: function(args){
                var deferred = $q.defer();
                $http.post(BACKEND + '/api/user/', args).then(
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

        } 
    }

})();
