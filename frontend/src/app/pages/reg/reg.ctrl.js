(function () {
  'use strict';

  angular.module('BlurAdmin.pages.reg')
    .controller('regCtrl', regCtrl);

  /** @ngInject */
  function regCtrl($scope, $location, toastr, regService, loginService) {
    $scope.signUp = function(){
      var args = {};
      args['username'] = $scope.username;
      args['password'] = $scope.password;
      if($scope.username&&$scope.password&&($scope.password==$scope.password_a))
        regService.createUser(args).then(
          function(success){
            console.log(success)
          },
          function(error){
            console.log(error);
            toastr.error("Register Error!", "User Register", {
              "autoDismiss": false,
              "positionClass": "toast-top-right",
              "type": "Error",
              "timeOut": "2000",
              "extendedTimeOut": "2000",
              "allowHtml": false,
              "closeButton": false,
              "tapToDismiss": true,
              "progressBar": false,
              "newestOnTop": true,
              "maxOpened": 0,
              "preventDuplicates": false,
              "preventOpenDuplicates": false
            });
          }
        ).then(function(success){
          loginService.getToken(args).then(function(success){
            $location.path('/dashboard/home');
          },function(error){
            console.log(error);
          })
        },function(error){
        
        });
    }  
  }

})();
