'use strict'

angular
    .module('app')
    .factory('NotificationFactory', function(){

        var Notification = function(str){
            this.id = 0;
            this.list = [];
            this.param;
            this.name = str;
        };
        Notification.prototype.subscribe = function(callback){
            if(angular.isFunction(callback)){
                var notifyId = this.id += 1;
                this.list.push({
                    id: notifyId,
                    cb: callback
                });
                return notifyId;
            }
        };
        Notification.prototype.unsubscribe = function(notifyId){
            var that = this;
            angular.forEach(this.list, function(obj, index){
                if(obj.id === notifyId){
                    that.list.splice(index, 1);
                }
            });
        };
        Notification.prototype.notify = function(value){
            this.param = value;
            angular.forEach(this.list, function(obj, id){
                if(angular.isFunction(obj.cb)){
                    obj.cb(value);
                }
            });
        };
        Notification.prototype.getLastNotifyValue = function(){
            return this.param;
        };

        return{
            build: function(str){
                return new Notification(str);
            }
        };

    });