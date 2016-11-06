'use strict'

angular
    .module('ArticleInfoModule.controller')
    .controller('ArticleInfoController', /*@ngInject*/function(NotificationService, UtilsService, $scope){

        var userDataNotifId,
            articleDataNotifId,
            userData,
            articleData,
            that = this;

        this.fillUserName = function(){
            if(UtilsService.keyInObject('newArticle', articleData)){
                userData = NotificationService.getLastNotifyValue('USER_DATA');
                this.firstname = UtilsService.keyInObject('data.firstname', userData) || '';
                this.lastname = UtilsService.keyInObject('data.lastname', userData) || '';
            }else{
                this.firstname = UtilsService.keyInObject('creator.firstname', articleData) || '';
                this.lastname = UtilsService.keyInObject('creator.lastname', articleData) || '';
            }
            this.date = (UtilsService.keyInObject('date', articleData))? new Date(articleData.date) : '';
        };

        this.toggleActiveUser = function(){
            this.isActive = (UtilsService.getIdFromJWT() === UtilsService.keyInObject('creator._id', articleData));
        };

        this.init = function(){
            articleData = NotificationService.getLastNotifyValue('ARTICLE_DATA');
            this.toggleActiveUser();
            this.fillUserName();

            userDataNotifId = NotificationService.subscribe('USER_DATA', function(result){
                userData = result;
                that.toggleActiveUser();
            });

            articleDataNotifId = NotificationService.subscribe('ARTICLE_DATA', function(result){
                articleData = result;
                that.toggleActiveUser();
            });
        };

        this.init();

        $scope.$on('$destroy', function(){
            NotificationService.unsubscribe('USER_DATA', articleDataNotifId);
            NotificationService.unsubscribe('ARTICLE_DATA', articleDataNotifId);
        });

    });