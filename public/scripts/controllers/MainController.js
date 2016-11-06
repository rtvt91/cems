'use strict'

angular
    .module('app')
    .controller('MainController', /*@ngInject*/function(NotificationService, UtilsService, $scope){

        var that = this,
            userDataNotifId;

        this.toggleNav = function(str){
            this.currentSelection = str;
        };

        this.init = function(){
            $scope.$on('$stateChangeStart', function(evt, to, params) {
                var state = UtilsService.keyInObject('name', to),
                    paramName = UtilsService.keyInObject('name', params);
                if(state === 'home'){
                    that.currentSelection = state;
                }else if(state.indexOf('dashboard') > -1){
                    that.currentSelection = 'dashboard';
                }else if(state === 'category' && paramName){
                    that.currentSelection = paramName;
                }else{
                    that.currentSelection = '';
                }
            });
            userDataNotifId = NotificationService.subscribe('USER_DATA', function(result){
                var data = UtilsService.keyInObject('data', result);
                if(!UtilsService.isEmptyObject(data)){
                    that.isConnected = data.active;
                }else{
                    that.isConnected = false;
                }
            });
        };

        this.init();

        $scope.$on('$destroy', function(){
            NotificationService.unsubscribe('USER_DATA', userDataNotifId);
        });

    });