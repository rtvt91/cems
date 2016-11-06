'use strict'

angular
    .module('BannerModule.controller')
    .controller('BannerController', /*@ngInject*/function(NotificationService, UtilsService, $scope){

        var that = this,
            bannerNotifId,
            userDataNotifId;
        
        this.props = {
            isOpen: false,
            isConnected: false
        };

        this.onClick = function($event){
            var isOpen = NotificationService.getLastNotifyValue('BANNER');
            NotificationService.notify('BANNER', !isOpen);
        };

        this.init = function(){
            bannerNotifId = NotificationService.subscribe('BANNER', function(result){
                if($scope.$root.$$phase === '$apply'|| $scope.$root.$$phase == '$digest'){
                    that.props.isOpen = result;
                }else{
                    $scope.$apply(function(){
                        that.props.isOpen = result;
                    });
                }
            });

            userDataNotifId = NotificationService.subscribe('USER_DATA', function(result){
                var data = UtilsService.keyInObject('data', result);
                that.props.isConnected = (UtilsService.isEmptyObject(data))? false : true;
            });
        };

        this.init();

        $scope.$on('$destroy', function(){
            NotificationService.unsubscribe('BANNER', bannerNotifId);
            NotificationService.unsubscribe('USER_DATA', userDataNotifId);
        });
    });
