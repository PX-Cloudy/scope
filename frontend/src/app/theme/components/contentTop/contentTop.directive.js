/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
      .directive('contentTop', contentTop)
      .directive('selectpicker', selectpicker);

  /** @ngInject */
  function contentTop($location, $state) {
    return {
      restrict: 'E',
      templateUrl: 'app/theme/components/contentTop/contentTop.html',
      controller:'GamepickerPanelCtrl',
      link: function($scope) {
        $scope.$watch(function () {
          $scope.activePageTitle = $state.current.title;
        });
      }
    };
  }

  /** @ngInject */
  function selectpicker() {
    return {
      restrict: 'A',
      require: '?ngOptions',
      priority: 1500, // make priority bigger than ngOptions and ngRepeat
      link: {
        pre: function(scope, elem, attrs) {
          elem.append('<option data-hidden="true" disabled value="">' + (attrs.title || 'Select something') + '</option>')
        },
        post: function(scope, elem, attrs) {
          function refresh() {
            elem.selectpicker('refresh');
          }

          if (attrs.ngModel) {
            scope.$watch(attrs.ngModel, refresh);
          }

          if (attrs.ngDisabled) {
            scope.$watch(attrs.ngDisabled, refresh);
          }

          elem.selectpicker({ dropupAuto: false, hideDisabled: true });
        }
      }
    };
  }


})();
