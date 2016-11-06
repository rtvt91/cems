'use strict'

angular
    .module('PostControlBarModule.controller')
    .controller('PostControlBarController', /*@ngInject*/function(NotificationService, UtilsService, $scope){

        var userDataNotifId,
            that = this;

        this.isActive = false;
        
        this.onSave = function(){
            NotificationService.notify('SHORTCUT_SAVE', 'save');
        };  

        this.toggleActiveUser = function(){
            var articleData = NotificationService.getLastNotifyValue('ARTICLE_DATA');
            that.isActive = (UtilsService.getIdFromJWT() === UtilsService.keyInObject('creator._id', articleData));
        };

        this.init = function(){
            
            this.toggleActiveUser();

            userDataNotifId = NotificationService.subscribe('USER_DATA', function(result){
                that.toggleActiveUser();
            });
        };

        this.init();

        $scope.$on('$destroy', function(){
            NotificationService.unsubscribe('USER_DATA', userDataNotifId);
        });

    });