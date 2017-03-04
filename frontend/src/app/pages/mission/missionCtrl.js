/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.mission')
      .controller('MissionCtrl', MissionCtrl)
      .controller('StatusAndTypeCtrl', StatusAndTypeCtrl)
      .controller('MissionExecutionCtrl', MissionExecutionCtrl)
      .controller('AddMissionCtrl', AddMissionCtrl)
      .controller('EditMissionCtrl', EditMissionCtrl);

  /** @ngInject */
  function MissionCtrl($scope, $filter, $uibModal, toastr, missionService, gameService) {
    $scope.smartTablePageSize = 12;
    $scope.smartDisplayedPage = 5;
    $scope.basicInfo = {};
    
    var typenames = new Object();

    // Get missions and missionTyps from backend
    // Add mission type into mission list after get missionType
    var getMission = function(args){
      $scope.missions = [];
      missionService.getMissions(args).then(
        function(success){
          var results = success['results'];
          $scope.totalItemCount = success['count'];
          angular.forEach(results, function(value){
              $scope.missions.push({
                  'id': value.id,
                  'type': value.mission_type,
                  'name': value.name,
                  'status': value.status,
                  'executed': value.executed,
                  'succeeded': value.succeeded,
                  'failed': value.failed,
                  'editable': value.editable,
                  'version': value.version,
                  'last_succeeded': value.last_succeeded,
                  'template': value.template,
                  'recallml': value.recallml,
                  'filter_day': value.filter_day,
                  'once_exedatetime': value.once_exedatetime,
                  'celery_periodtask': value.celery_periodtask
              });
          });
          $scope.displayed = [];
        },
        function(error){
          $scope.missions = [];
          console.log(error);
        }
      ).then(function(success){
          missionService.getMissionTypes().then(
            function(success){
              var results = success['results'];
              angular.forEach(results, function(value){
                  typenames[value['id']]= value['type'];
              });
              angular.forEach($scope.missions, function(value){
                  value['typename'] = typenames[value['type']];
              });
            },
            function(error){
              console.log(error);
            }
          );
      },function(error){}); 
    } //end getMissions
    
    var refresh = function(changeObj){
        var missionArgs = {};
        if(gameService.getVersionSelected().value!=0)
            missionArgs['version'] = gameService.getVersionSelected().value;
        if(gameService.getGameSelected().value!=0)
            missionArgs['game'] = gameService.getGameSelected().value;
        if(gameService.getPlatformSelected().value!=0)
            missionArgs['platform'] = gameService.getPlatformSelected().value;
        if(missionService.getMissionStatusSelected().value!=0)
            missionArgs['status'] = missionService.getMissionStatusSelected().value;
        if(missionService.getMissionTypeSelected().value!=0)
            missionArgs['mission_type'] = missionService.getMissionTypeSelected().value;

        for(var key in changeObj){
            if(changeObj[key]){
                missionArgs[key] = changeObj[key];
            }
        }
        getMission(missionArgs); // call getMission

    };

    refresh({}); //init
    
    $scope.$on('versionChanged', function(event, changedValue){
        refresh({'version':changedValue.value});
    });

    $scope.$on('missionStatusChanged', function(event, changedValue){
        refresh({'status':changedValue.value});
    });

    $scope.$on('missionTypeChanged', function(event, changedValue){
        refresh({'mission_type':changedValue.value});
    });

    $scope.pageChanged = function(page){
        $scope.currentPage=page
        refresh({'page':page});
    };

    // add mission modal open function
    $scope.openAdd = function (page, size) {
      $uibModal.open({
        animation: true,
        templateUrl: page,
        controller:'AddMissionCtrl as vm',
        size: size,
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      }).result.then(
        function(item){
          missionService.createMission(item).then(
              function(success){
                $scope.missions.unshift({
                  'id': success.id,
                  'type': success.mission_type,
                  'name': success.name,
                  'status': success.status,
                  'executed': success.executed,
                  'succeeded': success.succeeded,
                  'failed': success.failed,
                  'editable': success.editable,
                  'typename': typenames[success.mission_type],
                  'version': success.version,
                  'last_succeeded': success.last_succeeded,
                  'template': success.template,
                  'recallml': success.recallml,
                  'filter_day': success.filter_day,
                  'once_exedatetime': success.once_exedatetime,
                  'celery_periodtask': success.celery_periodtask,
                });
                toastr.success("Misssion: "+ success.name + " Created Success!", "Create Mission", {
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
                toastr.error("Misssion: "+ item.name + " Created Failed!", "Create Mission", {
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
                console.log(error);
              }
          )
        },
        function(error){
          console.log(error);
        }
      );
    }; //end modal open

    $scope.openEdit = function (page, size, mission) {
      $uibModal.open({
        animation: true,
        templateUrl: page,
        controller:'EditMissionCtrl as vm',
        size: size,
        resolve: {
          items: function () {
            return mission;
          }
        }
      }).result.then(function(item){
        missionService.updateMission(item).then(function(success){
          angular.forEach($scope.missions, function(value, index){
            if(value['id']==success['id']){
                value['type'] = success.mission_type;
                value['name'] = success.name;
                value['status'] = success.status;
                value['executed'] = success.executed;
                value['succeeded'] = success.succeeded;
                value['failed'] = success.failed;
                value['editable'] = success.editable,
                value['typename'] = typenames[success.mission_type];
                value['version'] = success.version;
                value['last_succeeded'] = success.last_succeeded;
                value['template'] = success.template;
                value['recallml'] = success.recallml;
                value['filter_day'] = success.filter_day;
                value['once_exedatetime'] = success.once_exedatetime;
                value['celery_periodtask'] = success.celery_periodtask;
            }
          });
          toastr.success("Misssion: "+ success.name + " Update Success!", "Update Mission", {
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

        },function(error){
          toastr.error("Misssion: "+ item.name + " Update Failed!", "Update Mission", {
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
        })
      },function(item){});
   }
  }// end MissionCtrl

  function StatusAndTypeCtrl($scope, $rootScope, missionService){
    var vm = this;

    var statusSelected = missionService.getMissionStatusSelected();
    var typeSelected = missionService.getMissionTypeSelected();

    // get mission status and render list
    var getMissionStatus = function(){
        $scope.missionStatus= [{'label':'ALL','value':0}];
        missionService.getMissionStatus().then(
            function(success){
                angular.forEach(success, function(value, index){
                    $scope.missionStatus.push({
                        'label': index,
                        'value': index,
                    });
                });
                vm.statusSelected = statusSelected;
            },
            function(error){});
    };
    getMissionStatus();

    // get mission types and render list
    var getMissionType = function(){
        $scope.missionTypes = [{'label':'ALL','value':0}];
        missionService.getMissionTypes().then(
            function(success){
                var results = success['results'];
                angular.forEach(results, function(value){
                    $scope.missionTypes.push({
                        'label': value['type'],
                        'value': value['id'],
                    });
                });
                vm.typeSelected= typeSelected;
            },
            function(error){});
    };
    getMissionType();

    $scope.statusOnSelect = function(item, model){
        missionService.setMissionStatusSelected(model);
        $rootScope.$broadcast('missionStatusChanged', model);
    };

    $scope.typeOnSelect = function(item, model){
        missionService.setMissionTypeSelected(model);
        $rootScope.$broadcast('missionTypeChanged', model);
    };

  } // end StatusAndTypeCtrl

  function AddMissionCtrl($scope, $uibModalInstance, gameService, missionService, templateService){
  
    var vm = this;
    vm.timeDay = new Date();
    vm.timeWeek = new Date();
    vm.timeMonth = new Date();

    var tabname = 'OnceHour';
    vm.tabname = tabname;

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
                    getOthers({
                       'version':vm.versionSelected.value,
                    });
                }
            },
            function(error){
                console.log(error);
            }
        ).then(function(success){
        
        }, function(error){})
    }; 

    var getTemplate = function(args){
        templateService.getTemplates(args).then(
            function(success){
              vm.templates = [];
              var results = success['results'];
              angular.forEach(results, function(value){
                  vm.templates.push({
                      'name': value.name,
                      'value': value.id,
                  });
              });
              vm.templateSelected = vm.templates[0];
            },
            function(error){}
        );    
    };

    var getOthers = function(args){
       templateService.getRecallMLs(args).then(
           function(success){
             vm.recalls = [];
           },
           function(error){}
       ).then(
            function(success){
                getTemplate(args);
            },
            function(error){}
        );
    };

    var getMissionType = function(){
        vm.missionTypes = [];
        missionService.getMissionTypes().then(
            function(success){
                var results = success['results'];
                angular.forEach(results, function(value){
                    vm.missionTypes.push({
                        'name': value['type'],
                        'value': value['id'],
                    });
                });
                vm.missionTypeSelected = vm.missionTypes[0];
            },
            function(error){}
        );
    };

    getGame();
    getPlatform();
    getVersion({
       'game':vm.gameSelected.value,
       'platform':vm.platformSelected.value
    });
    getOthers({
       'version': vm.versionSelected.value
    });
    getMissionType();

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
        getOthers({
           'version':model.value,
        });
    };

    $scope.missionTypeOnSelect = function(item, model){
        console.log(item);
    };

    $scope.tabClick = function(name){
        tabname = name;
        vm.tabname = name;
    };

    $scope.closeAdd = function(){
        var args = {};    
        args['name'] = vm.missionName;
        args['version'] =  vm.versionSelected.value;
        args['filter_day'] = vm.userFilter == 'DEFINE'? vm.defineFilter:vm.userFilter
        args['mission_type'] = vm.missionTypeSelected.value;
        args['template'] = vm.templateSelected.value;
        args['celery_periodtask'] = new Object();
        args['celery_periodtask']['crontab'] = new Object();

        if(args['mission_type']==1)
            args['once_exedatetime'] = vm.timesetting;
        else{
            if(tabname=='OnceHour'){
                args['celery_periodtask']['crontab']['minute'] = vm.minuteHour;
            }
            else if(tabname=='OnceDay'){
                args['celery_periodtask']['crontab']['hour'] = vm.timeDay.getHours();
                args['celery_periodtask']['crontab']['minute'] = vm.timeDay.getMinutes();
            }
            else if(tabname=='OnceWeek'){
                args['celery_periodtask']['crontab']['day_of_week'] = vm.dayWeek;
                args['celery_periodtask']['crontab']['hour'] = vm.timeWeek.getHours();
                args['celery_periodtask']['crontab']['minute'] = vm.timeWeek.getMinutes();
            }
            else if(tabname=='OnceMonth'){
                args['celery_periodtask']['crontab']['day_of_month'] = vm.dayMonth;
                args['celery_periodtask']['crontab']['hour'] = vm.timeMonth.getHours();
                args['celery_periodtask']['crontab']['minute'] = vm.timeMonth.getMinutes();
            }
        } 

        vm.basicInfoForm.$setSubmitted();
        vm.modelInfoForm.$setSubmitted();
        vm.crontabForm.$setSubmitted();
        if(args['name']&&args['version']&&args['template']){
            if(args['mission_type']==1){
                if(args['once_exedatetime'])
                    $uibModalInstance.close(args);
            }
            else{
                if(tabname=='OnceHour'&&vm.minuteHour)
                    $uibModalInstance.close(args);
                
                if(tabname=='OnceDay'&&vm.timeDay)
                    $uibModalInstance.close(args);

                if(tabname=='OnceWeek'&&vm.dayWeek&&vm.timeWeek)
                    $uibModalInstance.close(args);

                if(tabname=='OnceMonth'&&vm.dayMonth&&vm.timeMonth)
                    $uibModalInstance.close(args);
            }
        }

    };

  }//end AddMissionCtrl 

  function EditMissionCtrl($scope, $uibModalInstance, items, gameService, templateService, missionService){
    var vm = this;

    // load missionName missionStatus settings
    vm.missionName = items['name'];
    vm.missionStatus = items['status'];

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
    },function(error){});

    // load filter_day settings
    if(items['filter_day']==0 || items['filter_day']==7 || items['filter_day']==15 || items['filter_day']==30)
      vm.userFilter=items['filter_day'];
    else{
      vm.userFilter='DEFINE';
      vm.defineFilter=items['filter_day'];
    }

    // load recallML, clusterML, template Settings
    var getTemplate = function(args){
        templateService.getTemplates(args).then(
            function(success){
              vm.templates = [];
              var results = success['results'];
              angular.forEach(results, function(value, index){
                  vm.templates.push({
                      'name': value.name,
                      'value': value.id,
                  });
                  if(value.id==items['template'])
                    vm.templateSelected = vm.templates[index];
              });
            },
            function(error){}
        );    
    };


    var getOthers = function(args){
       templateService.getRecallMLs(args).then(
           function(success){
             vm.recalls = [];
           },
           function(error){}
       ).then(
            function(success){
                getTemplate(args);
            },
            function(error){}
        );
    };

    getOthers({'version':items['version']});

    // load missionType settings
    vm.missionTypeSelected = {
      'name': items['typename'],
      'value': items['type']
    }

    if(items['once_exedatetime'])
      vm.timesetting = items['once_exedatetime']

    if(items['typename'] == 'loop'){
      var crontab = items['celery_periodtask']['crontab'];
      var tabname = '';
      if(crontab['day_of_month']!='*'){
        vm.dayMonth = parseInt(crontab['day_of_month']);
        var tmp = new Date();
        tmp.setHours(crontab['hour']);
        tmp.setMinutes(crontab['minute']);
        vm.timeMonth = tmp;
        vm.activeTab = 3;
        tabname = 'OnceMonth';
      }
      else if(crontab['day_of_week']!='*'){
        vm.dayWeek= parseInt(crontab['day_of_week']);
        var tmp = new Date();
        tmp.setHours(crontab['hour']);
        tmp.setMinutes(crontab['minute']);
        vm.timeWeek= tmp;
        vm.activeTab = 2;
        tabname = 'OnceWeek';
      }
      else if(crontab['hour']!='*'){
        var tmp = new Date();
        tmp.setHours(crontab['hour']);
        tmp.setMinutes(crontab['minute']);
        vm.timeDay= tmp;
        vm.activeTab = 1;
        tabname = 'OnceDay';
      }
      else{
        vm.minuteHour=parseInt(crontab['minute']);
        vm.activeTab = 0;
        tabname = 'OnceHour';
      }
      vm.tabname = name;
    }
      
    $scope.tabClick = function(name){
        tabname = name;
        vm.tabname = name;
    };

    $scope.closeEdit = function(){
        var args = {};    
        args['id'] = items['id'];
        args['name'] = vm.missionName;
        args['version'] =  vm.versionSelected.value;
        args['filter_day'] = vm.userFilter == 'DEFINE'? vm.defineFilter:vm.userFilter
        args['mission_type'] = vm.missionTypeSelected.value;
        args['template'] = vm.templateSelected.value;
        args['status'] = vm.missionStatus;
        args['celery_periodtask'] = new Object();
        args['celery_periodtask']['crontab'] = new Object();

        if(args['mission_type']==1)
            args['once_exedatetime'] = vm.timesetting;
        else{
            if(tabname=='OnceHour'){
                args['celery_periodtask']['crontab']['minute'] = vm.minuteHour;
            }
            else if(tabname=='OnceDay'){
                args['celery_periodtask']['crontab']['hour'] = vm.timeDay.getHours();
                args['celery_periodtask']['crontab']['minute'] = vm.timeDay.getMinutes();
            }
            else if(tabname=='OnceWeek'){
                args['celery_periodtask']['crontab']['day_of_week'] = vm.dayWeek;
                args['celery_periodtask']['crontab']['hour'] = vm.timeWeek.getHours();
                args['celery_periodtask']['crontab']['minute'] = vm.timeWeek.getMinutes();
            }
            else if(tabname=='OnceMonth'){
                args['celery_periodtask']['crontab']['day_of_month'] = vm.dayMonth;
                args['celery_periodtask']['crontab']['hour'] = vm.timeMonth.getHours();
                args['celery_periodtask']['crontab']['minute'] = vm.timeMonth.getMinutes();
            }
        } 

        vm.basicInfoForm.$setSubmitted();
        vm.modelInfoForm.$setSubmitted();
        vm.crontabForm.$setSubmitted();
        if(args['name']&&args['version']&&args['template']){
            if(args['mission_type']==1){
                if(args['once_exedatetime'])
                    $uibModalInstance.close(args);
            }
            else{
                if(tabname=='OnceHour'&&vm.minuteHour)
                    $uibModalInstance.close(args);
                
                if(tabname=='OnceDay'&&vm.timeDay)
                    $uibModalInstance.close(args);

                if(tabname=='OnceWeek'&&vm.dayWeek&&vm.timeWeek)
                    $uibModalInstance.close(args);

                if(tabname=='OnceMonth'&&vm.dayMonth&&vm.timeMonth)
                    $uibModalInstance.close(args);
            }
        }

    };

  } //end EditMissionCtrl

  function MissionExecutionCtrl($scope, $stateParams, missionService){
    $scope.smartTablePageSize = 12;
    $scope.smartDisplayedPage = 5;

    var args = {
      'mission': $stateParams.missionId
    };

    var getExecution = function(args){
      $scope.executions = [];
      missionService.getExecutions(args).then(
        function(success){
          var results = success['results'];
          $scope.totalItemCount = success['count'];
          angular.forEach(results, function(value){
            $scope.executions.push({
              'id': value.id,
              'status': value.status,
              'start': value.start,
              'end': value.start
            })
          });

          $scope.displayed = [];
        },
        function(error){}
      );
    };
    
    getExecution(args);

    $scope.pageChanged = function(page){
        $scope.currentPage=page
        getExecution({
            'page':page,
            'mission': $stateParams.missionId
        });
    };

  } //end MissionExecutionCtrl

})();
