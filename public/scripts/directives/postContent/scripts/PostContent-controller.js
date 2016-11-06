'use strict'

angular
    .module('PostContentModule.controller')
    .controller('PostContentController', /*@ngInject*/function(NotificationService, PostHTTPService, UtilsService, $scope, $element, $state){

        var that = this,
            shortcutNotifId,
            userDataNotifId;

        this.internal = {
            postData: undefined
        };

        this.setArticleData = function(result){
            this.internal.postData = result;
            NotificationService.notify('ARTICLE_DATA', result);
        };

        this.init = function(){
            shortcutNotifId = NotificationService.subscribe('SHORTCUT_SAVE', function(type){
                var ownArticle = UtilsService.keyInObject('creator._id', that.internal.postData) === UtilsService.getIdFromJWT(),
                    userData = !UtilsService.isEmptyObject(NotificationService.getLastNotifyValue('USER_DATA'));
                if(ownArticle && userData && that.internal.postData && type && type.toLowerCase() === 'save'){
                    PostHTTPService.updatePost({_id:that.internal.postData._id, content:$element.html()}, function(result){});
                }
            });

            userDataNotifId = NotificationService.subscribe('USER_DATA', function(result){
                var data = UtilsService.keyInObject('data', result);
                if(UtilsService.isEmptyObject(data) && UtilsService.keyInObject('active', that.internal.postData, true)){
                    if(!that.internal.postData.active){
                        $state.go('home');
                    }
                }
            });
        };

        this.init();

        $scope.$on('$destroy', function(){
            NotificationService.unsubscribe('SHORTCUT_SAVE', shortcutNotifId);
            NotificationService.unsubscribe('USER_DATA', userDataNotifId);
        });
    });