'use strict'

angular
    .module('app')
    .service('NotificationService', /*@]ngInject*/function(NotificationFactory){

        var notifList = [];

        var buildNotification = function(str){
            var notifObject = {
                type: str,
                notification: NotificationFactory.build(str)
            }
            notifList.push(notifObject);
            return notifObject.notification;
        };

        var notifAlreadyExists = function(str){
            var notif;
            angular.forEach(notifList, function(obj, id){
                if(obj.type === str){
                    notif = obj.notification;
                }
            });
            return notif;
        };

        var getNotification = function(str){
            var notif = notifAlreadyExists(str);
            if(!angular.isDefined(notif)){
                notif = buildNotification(str);
            }
            return notif;
        };

        this.subscribe = function(type, cb){
            if(angular.isDefined(type) && angular.isFunction(cb)){
                var notif = getNotification(type);
                return notif.subscribe(cb);
            }
        };

        this.unsubscribe = function(type, id){
            if(angular.isDefined(type) && angular.isDefined(id)){
                var notif = notifAlreadyExists(type);
                if(notif){
                    notif.unsubscribe(id);
                }
            }
        };

        this.notify = function(type, value){
            if(angular.isDefined(type)){
                var notif = notifAlreadyExists(type);
                if(notif){
                    notif.notify(value);
                }
            }
        };

        this.getLastNotifyValue = function(type){
            if(angular.isDefined(type)){
                var notif = getNotification(type);
                return notif.getLastNotifyValue();
            }
        };

    });