(function(){
    'use strict';
    angular.module('BlurAdmin.pages.template')
        .service('templateService', templateService);

    function templateService($http, $q, localStorageService){
        return{
           getTemplates: function(args){
                var deferred = $q.defer();
                $http.get(BACKEND + '/api/template/', {params:args}).then(
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

            createTemplate: function(args){
                var deferred = $q.defer();
                var token = localStorageService.get('Authorization');
                $http.post(
                  BACKEND + '/api/template/', args,
                  {headers: {'Authorization':'Token '+ token,'Content-Type':'application/json; charset=utf-8'}}).then(
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

            updateTemplate: function(args){
                var deferred = $q.defer();
                var token = localStorageService.get('Authorization');
                $http.put(
                  BACKEND + '/api/template/' + args['id'] + '/', args,
                  {headers: {'Authorization':'Token ' + token, 'Content-Type':'application/json; charset=utf-8'}}).then(
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

            getNotificationTypes: function(){
                var deferred = $q.defer();
                $http.get(BACKEND + '/api/notificationtype/').then(
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

            getTemplateThemes: function(){
                var deferred = $q.defer();
                $http.get(BACKEND + '/api/theme/').then(
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

            getTemplateThemeSelected: function(){
                if(localStorageService.get('templateThemeSelected'))
                    return localStorageService.get('templateThemeSelected')
                else
                    return ''
            },

            setTemplateThemeSelected: function(theme){
                localStorageService.set('templateThemeSelected', theme);
            },

            getTemplateTypeSelected: function(){
                if(localStorageService.get('templateTypeSelected'))
                    return localStorageService.get('templateTypeSelected')
                else
                    return ''
            },

            setTemplateTypeSelected: function(type){
                localStorageService.set('templateTypeSelected', type);
            },

            getClusterMLs: function(args){
                var deferred = $q.defer();
                $http.get(BACKEND + '/api/clusterml/', {params:args}).then(
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

            getRecallMLs: function(args){
                var deferred = $q.defer();
                $http.get(BACKEND + '/api/recallml/', {params:args}).then(
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
