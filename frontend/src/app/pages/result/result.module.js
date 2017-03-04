/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.result', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('dashboard.result', {
          url: '/result?execution',
          templateUrl: 'app/pages/result/result.html',
          title: 'Result',
          sidebarMeta: {
            icon: 'ion-document',
            order: 4,
          },
        });
  }

})();
