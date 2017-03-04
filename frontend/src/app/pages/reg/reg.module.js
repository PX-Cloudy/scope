(function () {
  'use strict';

  angular.module('BlurAdmin.pages.reg', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('reg', {
          url: '/reg',
          title: 'reg',
          templateUrl: 'app/pages/reg/reg.html',
          controller: 'regCtrl',
        });
  }

})();
