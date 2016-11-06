'use strict'

angular
    .module('PopupModule.controller')
    .controller('PopupController', /*@ngInject*/function(NotificationService, UtilsService, $element, $scope){

        var that = this,
            messageNotifId;
        
        this.msg = '';
        this.internal = {
            $popup: $($element)
        };

        this.init = function(){
            messageNotifId = NotificationService.subscribe('MESSAGE', function(obj){
                var msg = UtilsService.keyInObject('msg', obj),
                    errorMsg = UtilsService.keyInObject('errorMsg', obj),
                    msgType = UtilsService.keyInObject('msgType', obj);
                if(errorMsg){
                    that.msg = obj.errorMsg;
                    that.internal.$popup.modal('show');
                }else if(msgType && msg){
                    if(msgType === 'put-post' || msgType === 'put-user' || msgType === 'save-img' || msgType === 'access-disconnect'){
                        that.msg = obj.msg;
                        that.internal.$popup.modal('show');
                    }
                }
            });
        };

        this.init();

        $scope.$on('$destroy', function(){
            NotificationService.unsubscribe('MESSAGE', messageNotifId);
        });

    });