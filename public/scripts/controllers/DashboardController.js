'use strict'

angular
    .module('app')
    .controller('DashboardController', /*@ngInject*/function(NotificationService, UtilsService, $state, $location, $scope){

        this.toggleNav = function(str){
            this.currentSelection = str;
        };

        this.gotoState = function(str){
            if(str){
                $state.transitionTo('dashboard.' + str);
            }
        };

        var userDataNotifId;
        this.init = function(){
            var path = $location.path(),
                path = path.substr(1, path.length),
                list = path.split('/'),
                first = list[0],
                last = list[list.length-1];

            if(first === 'dashboard'){
                this.currentSelection = last;
            }

            userDataNotifId = NotificationService.subscribe('USER_DATA', function(result){
                var data = UtilsService.keyInObject('data', result);
                if(UtilsService.isEmptyObject(data)){
                    $state.go('home');
                }
            });
        };

        this.init();

        $scope.$on('$destroy', function(){
            NotificationService.unsubscribe('USER_DATA', userDataNotifId);
        });

    });