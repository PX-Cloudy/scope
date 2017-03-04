/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.mission', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('dashboard.mission', {
          url: '/mission',
          templateUrl: 'app/pages/mission/mission.html',
          title: 'Mission',
          sidebarMeta: {
            icon: 'ion-grid',
            order: 2,
          },
        })
        .state('dashboard.execution', {
            url: '/execution?missionId',
            templateUrl: 'app/pages/mission/missionexecution.html',
            title: 'Mission Execution',
        });

  }

})();
