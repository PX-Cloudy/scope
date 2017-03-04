/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.template', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('dashboard.template', {
          url: '/template',
          templateUrl: 'app/pages/template/template.html',
          title: 'Template',
          sidebarMeta: {
            icon: 'ion-compose',
            order: 3,
          },
        });
  }

})();
