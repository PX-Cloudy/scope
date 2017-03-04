/**
 * @author v.lugovsky
 * created on 22.04.2016
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
      .controller('PageTopCtrl', PageTopCtrl);

  /** @ngInject */
  function PageTopCtrl($scope, $translate, localStorageService) {
    $scope.language_switch = function(){
       var current_lang = $translate.proposedLanguage() || $translate.use();
       console.log(current_lang);
       if(current_lang=='cn')
         localStorageService.set('lang', 'en')
       else
         localStorageService.set('lang', 'cn')
       window.location.reload()
    };
  }
})();
