/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages', [
    'ui.router',

    'BlurAdmin.pages.dashboard',
    'BlurAdmin.pages.home',
    'BlurAdmin.pages.mission',
    'BlurAdmin.pages.template',
    'BlurAdmin.pages.result',
    'BlurAdmin.pages.login',
    'BlurAdmin.pages.reg',
  ])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
    $urlRouterProvider.otherwise('/dashboard/home');

    baSidebarServiceProvider.addStaticItem({
      title: 'Admin',
      icon: 'ion-gear-a',
      subMenu: [{
        title: 'Backend',
        fixedHref: BACKEND + '/admin',
        blank: true
      }]
    });

  }

})();
