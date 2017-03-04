(function () {
  'use strict';

  angular.module('BlurAdmin.pages.login')
    .controller('loginCtrl', loginCtrl);

  /** @ngInject */
  function loginCtrl($scope, $location, toastr, loginService) {
    $scope.signIn = function(){
      var args = {};
      args['username'] = $scope.username;
      args['password'] = $scope.password;
      loginService.getToken(args).then(
        function(success){
          $location.path('/dashboard/home');
        },
        function(error){
          console.log(error);
          toastr.error("UserName or Password NOT Correct!", "User Login", {
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

        });
    }  
  }

})();
