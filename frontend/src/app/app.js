'use strict';
var BACKEND = 'http://172.17.70.143:12345';

angular.module('BlurAdmin', [
  'ngAnimate',
  'ui.bootstrap',
  'ui.sortable',
  'ui.router',
  'ngTouch',
  'toastr',
  'smart-table',
  "xeditable",
  'ui.slimscroll',

  'ui.select',
  'ngSanitize',
  'datetimepicker',

  'LocalStorageModule',
  'pascalprecht.translate',

  'BlurAdmin.theme',
  'BlurAdmin.pages'
]).config(function(localStorageServiceProvider, $translateProvider){
  localStorageServiceProvider.setPrefix('shinezine_scope');
  var lang = window.localStorage.lang||'cn';
  $translateProvider.preferredLanguage(lang);
  $translateProvider.useStaticFilesLoader({
     prefix: 'assets/i18n/',
     suffix: '.json'
  });
}).run(function($location,localStorageService, $translate){
  if(!localStorageService.get('Authorization'))
    $location.path('/login');
  if(localStorageService.get('lang')=='en')
    $translate.use('en');
  else
    $translate.use('cn');

});
