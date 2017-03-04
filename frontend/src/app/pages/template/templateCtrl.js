/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.template')
      .controller('TemplateCtrl', TemplateCtrl)
      .controller('TypesAndThemeCtrl', TypesAndThemeCtrl)
      .controller('AddTemplateCtrl', AddTemplateCtrl)
      .controller('EditTemplateCtrl', EditTemplateCtrl);

  /** @ngInject */
  function TemplateCtrl($scope, $uibModal, toastr, templateService, gameService) {
    $scope.smartTablePageSize = 12;
    $scope.smartDisplayedPage = 5;

    var themenames = new Object();
    var typenames = new Object();
    
    // Get template from backend
    var getTemplate= function(args){
      $scope.templates = [];
      templateService.getTemplates(args).then(
        function(success){
            var results = success['results'];
            $scope.totalItemCount = success['count'];
            angular.forEach(results, function(value){
                $scope.templates.push({
                    'id': value.id,
                    'name': value.name,
                    'theme': value.theme,
                    'custom_mark': value.custom_mark,
                    'custom_content': value.custom_content,
                    'clusterml': value.clusterml,
                    'version': value.version,
                    'type': value.type
                });
            });
            $scope.displayed = [];
        },
        function(error){
            $scope.templates= [];
            console.log(error);
        }
      ).then(function(success){
        templateService.getTemplateThemes().then(
          function(success){
            var results = success['results'];
            angular.forEach(results, function(value){
                themenames[value['id']]= value['name'];
            });
            angular.forEach($scope.templates, function(value){
                value['themename'] = themenames[value['theme']];
            });
          },
          function(error){});
      },function(error){}).then(function(success){
        templateService.getNotificationTypes().then(
          function(success){
            var results = success['results'];
            angular.forEach(results, function(value){
                typenames[value['id']]= value['type'];
            });
            angular.forEach($scope.templates, function(value){
                value['template_type'] = typenames[value['type']];
            });

          },
          function(error){}); 
      }, function(error){}); 
    } //end getTemplate

    var refresh = function(changeObj){
        var templateArgs = {};
        if(gameService.getVersionSelected().value!=0)
            templateArgs['version'] = gameService.getVersionSelected().value;
        if(gameService.getGameSelected().value!=0)
            templateArgs['game'] = gameService.getGameSelected().value;
        if(gameService.getPlatformSelected().value!=0)
            templateArgs['platform'] = gameService.getPlatformSelected().value;
        if(templateService.getTemplateTypeSelected().value!=0) 
            templateArgs['type'] = templateService.getTemplateTypeSelected().value
        if(templateService.getTemplateThemeSelected().value!=0) 
            templateArgs['theme'] = templateService.getTemplateThemeSelected().value

        for(var key in changeObj){
            if(changeObj[key]){
                templateArgs[key] = changeObj[key];
            }
        }
        getTemplate(templateArgs);

    };
    
    refresh({}); // init

    $scope.$on('versionChanged', function(event, changedValue){
        refresh({'version':changedValue.value});
    });

    $scope.$on('templateThemeChanged', function(event, changedValue){
        refresh({'theme':changedValue.value});
    });

    $scope.$on('templateTypeChanged', function(event, changedValue){
        refresh({'type':changedValue.value});

    });

    $scope.pageChanged = function(page){
        $scope.currentPage=page
        refresh({'page':page});
    };

    // modal open function
    $scope.openAdd = function (page, size) {
      $uibModal.open({
        animation: true,
        templateUrl: page,
        controller: 'AddTemplateCtrl as vm',
        size: size,
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      }).result.then(function(item){
        templateService.createTemplate(item).then(
          function(success){
            $scope.templates.unshift({
              'id': success.id,
              'name': success.name,
              'theme': success.theme,
              'custom_mark': success.custom_mark,
              'custom_content': success.custom_content,
              'clusterml': success.clusterml,
              'type': success.type,
              'version': success.version,
              'themename': themenames[success.theme],
              'template_type':typenames[success.type],
            });
            toastr.success("Template: "+ success.name + " Created Success!", "Create Template", {
              "autoDismiss": false,
              "positionClass": "toast-top-right",
              "type": "Success",
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
            })
          },

          function(error){
            toastr.error("Template: "+ item.name + " Created Failed!", "Create Template", {
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
            })

          });
      });
    }; //end modal open

    $scope.openEdit = function(page, size, template){
      $uibModal.open({
        animation: true,
        templateUrl: page,
        controller: 'EditTemplateCtrl as vm',
        size: size,
        resolve: {
          items: function () {
            return template;
          }
        }
      }).result.then(function(item){
        templateService.updateTemplate(item).then(
          function(success){
            angular.forEach($scope.templates, function(value){
              if(value['id']==success['id']){
                value['id'] = success.id;
                value['name'] = success.name;
                value['theme'] = success.theme;
                value['custom_mark'] = success.custom_mark;
                value['custom_content'] = success.custom_content;
                value['clusterml'] = success.clusterml;
                value['type'] = success.type;
                value['version'] = success.version;
                value['themename'] = themenames[success.theme];
                value['template_type'] = typenames[success.type];
              }
            });
            
            toastr.success("Template: "+ success.name + " Update Success!", "Update Template", {
              "autoDismiss": false,
              "positionClass": "toast-top-right",
              "type": "Success",
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
            })
          },
          function(error){});
      });
    };

  }// end TemplateCtrl 

  function TypesAndThemeCtrl($scope, $rootScope, templateService){
    var vm = this;

    var themeSelected = templateService.getTemplateThemeSelected();
    var typeSelected = templateService.getTemplateTypeSelected();

    // get template theme and render list
    var getTemplateTheme = function(){
        $scope.templateThemes= [{'label':'ALL','value':0}];
        templateService.getTemplateThemes().then(
            function(success){
                var results = success['results'];
                angular.forEach(results, function(value){
                    $scope.templateThemes.push({
                        'label': value['name'],
                        'value': value['id'],
                    });
                });
                vm.themeSelected = themeSelected;
            },
            function(error){});
    };
    getTemplateTheme();

    // get template types and render list
    var getNotificationType = function(){
        $scope.templateTypes = [{'label':'ALL','value':0}];
        templateService.getNotificationTypes().then(
            function(success){
                var results = success['results'];
                angular.forEach(results, function(value){
                    $scope.templateTypes.push({
                        'label': value['type'],
                        'value': value['id'],
                    });
                });
                vm.typeSelected= typeSelected;
            },
            function(error){});
    };
    getNotificationType();

    $scope.themeOnSelect = function(item, model){
        templateService.setTemplateThemeSelected(model);
        $rootScope.$broadcast('templateThemeChanged', model);
    };

    $scope.typeOnSelect = function(item, model){
        templateService.setTemplateTypeSelected(model);
        $rootScope.$broadcast('templateTypeChanged', model);
    };


  }// end TypesAndThemeCtrl 

  function AddTemplateCtrl($scope, $uibModalInstance, gameService, templateService){
    var vm = this;
    vm.gameSelected = gameService.getGameSelected().value!=0?gameService.getGameSelected():"";
    vm.platformSelected = gameService.getPlatformSelected().value!=0?gameService.getPlatformSelected():"";
    vm.versionSelected = gameService.getVersionSelected().value!=0?gameService.getVersionSelected():"";

    var getGame = function(){
        gameService.getGames().then(
            function(success){
              vm.games = [];
              angular.forEach(success, function(value){
                  vm.games.push(value)
              });
            },
            function(error){
              console.log(error);
            }
        )
    };

    var getPlatform = function(){
        gameService.getPlatforms().then(
            function(success){
              vm.platforms = [];
              angular.forEach(success, function(value){
                  vm.platforms.push(value)
              });
            },
            function(error){
              console.log(error);
            }
        )
    }; 

    var getVersion = function(args){
        gameService.getVersions(args).then(
            function(success){
                vm.versions = [];
                angular.forEach(success, function(value){
                    vm.versions.push(value)
                });
                if(args['changed']){
                    vm.versionSelected = vm.versions.length!=0?vm.versions[0]:"";
                    getClusterML({
                       'version':vm.versionSelected.value,
                    });
                }
            },
            function(error){
                console.log(error);
            }
        );
    }; 

    var getTemplateTheme = function(){
        templateService.getTemplateThemes().then(
            function(success){
                vm.themes = [];
                var results = success['results'];
                angular.forEach(results, function(value){
                    vm.themes.push({
                        'value': value.id,
                        'label': value.name
                    })
                });
            },
            function(error){}
        );
    };

    var getNotificationType = function(){
        vm.notificationTypes = [];
        templateService.getNotificationTypes().then(
            function(success){
                var results = success['results'];
                angular.forEach(results, function(value){
                    vm.notificationTypes.push({
                        'label': value['type'],
                        'value': value['id'],
                    });
                });
            },
            function(error){});
    };

    var getClusterML = function(args){
        vm.clustermls = [];
        templateService.getClusterMLs(args).then(
            function(success){
                var results = success['results'];
                angular.forEach(results, function(value){
                    vm.clustermls.push({
                        'label': value['name'],
                        'value': value['id'],
                    });
                });
                vm.clustermlSelected = vm.clustermls.length!=0?vm.clustermls[0]:"";
            },
            function(error){});
    };

    getGame();
    getPlatform();
    getVersion({
        'game':vm.gameSelected.value,
        'platform':vm.platformSelected.value
    });
    getTemplateTheme();
    getNotificationType();
    getClusterML({
        'version':vm.versionSelected.value
    });

    $scope.gameOnSelect = function(item, model){
        getVersion({
           'game':model.value,
           'platform':vm.platformSelected.value,
           'changed': true
        });
    };

    $scope.platformOnSelect = function(item, model){
        getVersion({
           'game':vm.gameSelected.value,
           'platform':model.value,
           'changed': true
        });
    };

    $scope.versionOnSelect = function(item, model){
        getClusterML({
           'version':vm.versionSelected.value,
        });
    };

    $scope.closeAdd = function(){
        var args = {};
        args['name'] = vm.templateName;
        args['custom_mark'] = vm.contentFilter==0? true:false;
        if(args['custom_mark'])
            args['custom_content'] = vm.customizeContent;
        else
            args['clusterml'] = vm.clustermlSelected.value;
        args['version'] = vm.versionSelected.value;
        args['theme'] = vm.themeSelected.value;
        args['type'] = vm.notificationTypeSelected.value;
        if(vm.contentFilter==0&&vm.customizeContent) 
            $uibModalInstance.close(args);

        if(vm.contentFilter!=0&&vm.clustermlSelected) 
            $uibModalInstance.close(args);
    };

  } //end AddTemplateCtrl

  function EditTemplateCtrl($scope, $uibModalInstance, items, gameService, templateService){

    var vm = this;
    
    vm.templateName = items['name'];

    var getTemplateTheme = function(){
        templateService.getTemplateThemes().then(
            function(success){
                vm.themes = [];
                var results = success['results'];
                angular.forEach(results, function(value){
                    vm.themes.push({
                        'value': value.id,
                        'label': value.name
                    })
                    if(value.id==items['theme'])
                        vm.themeSelected = {'value': value.id,'label': value.name}
                });
            },
            function(error){}
        );
    };

    var getNotificationType = function(){
        vm.notificationTypes = [];
        templateService.getNotificationTypes().then(
            function(success){
                var results = success['results'];
                angular.forEach(results, function(value){
                    vm.notificationTypes.push({
                        'label': value['type'],
                        'value': value['id'],
                    });
                    if(value.id==items['type'])
                        vm.notificationTypeSelected = {'value': value.id,'label': value.type}
                });
            },
            function(error){});
    };

    var getClusterML = function(args){
        vm.clustermls = [];
        templateService.getClusterMLs(args).then(
            function(success){
                var results = success['results'];
                angular.forEach(results, function(value){
                    vm.clustermls.push({
                        'label': value['name'],
                        'value': value['id'],
                    });
                    if(value.id==items['clusterml'])
                        vm.clustermlSelected = {'value': value.id,'label': value.name}
                });
                
            },
            function(error){});
    };


    // load version, platform, game settings
    gameService.getVersions({'id':items['version']}).then(
      function(success){
        vm.versionSelected = success[0]; 
        vm.versions = [vm.versionSelected];
      },
      function(error){}
    ).then(function(success){
      gameService.getGames({'id':vm.versionSelected['game']}).then(
        function(success){
          vm.gameSelected = success[0]; 
          vm.games = [vm.gameSelected];
        }, function(erorr){})
    }, function(erorr){}
    ).then(function(success){
      gameService.getPlatforms({'id':vm.versionSelected['platform']}).then(
        function(success){
          vm.platformSelected = success[0];
          vm.platforms = [vm.platformSelected];
        },
        function(error){})
    },function(error){}
    ).then(function(success){
      getClusterML({'version':vm.versionSelected.value})  
    },function(error){});

    getTemplateTheme();
    getNotificationType();

    if(items['custom_mark']){
        vm.contentFilter = 0;
        vm.customizeContent = items['custom_content'];
    }
    else{
        vm.contentFilter = 1;
    }

    $scope.closeEdit = function(){
        var args = {};
        args['id'] = items['id'];
        args['name'] = vm.templateName;
        args['custom_mark'] = vm.contentFilter==0? true:false;
        if(args['custom_mark']){
            args['custom_content'] = vm.customizeContent;
            args['clusterml'] = '';
        }
        else{
            args['clusterml'] = vm.clustermlSelected.value;
            args['custom_mark'] = false;
            args['custom_content'] = '';
        }
        args['version'] = vm.versionSelected.value;
        args['theme'] = vm.themeSelected.value;
        args['type'] = vm.notificationTypeSelected.value;

        if(vm.contentFilter==0&&vm.customizeContent) 
            $uibModalInstance.close(args);

        if(vm.contentFilter!=0&&vm.clustermlSelected) 
            $uibModalInstance.close(args);

    };

  } //end EditTemplateCtrl

})();
