'use strict'

describe('NotificationFactory', function(){

    var NotificationFactory;

    beforeEach(function(){
        angular.mock.module('app');
        angular.mock.inject(function(_NotificationFactory_){
            NotificationFactory = _NotificationFactory_;
        });
    });

    describe('#build', function(){
        
        it('should build a notification object', function(){
            var notification = NotificationFactory.build('Test');

            expect(notification.subscribe).toBeDefined();
            expect(notification.unsubscribe).toBeDefined();
            expect(notification.notify).toBeDefined();
            expect(notification.getLastNotifyValue).toBeDefined();
        });

    });

    describe('#object methods', function(){
        
        it('should subscribe a new callback in the notification object and return a unique id', function(){
            var notification = NotificationFactory.build('Test'),
                callback = function(){};
            spyOn(notification, 'subscribe').and.callThrough();

            var id = notification.subscribe(callback)

            expect(notification.subscribe).toHaveBeenCalledWith(callback);
            expect(id).toEqual(notification.id);
        });

        it('should unsubscribe a callback in the notification object with its id', function(){
            var notification = NotificationFactory.build('Test'),
                callback = function(){};
            spyOn(notification, 'unsubscribe');

            var id = notification.subscribe(callback);
            notification.unsubscribe(id);

            expect(notification.unsubscribe).toHaveBeenCalledWith(id);
            expect(id).toEqual(notification.id);
        });

        it('should notify a message from the notification object', function(){
            var notification = NotificationFactory.build('Test'),
                fn = {
                    callback: function(){}
                };
            spyOn(fn, 'callback');
            spyOn(notification, 'notify').and.callThrough();

            var id = notification.subscribe(fn.callback);
            notification.notify('Hello World');

            expect(notification.notify).toHaveBeenCalledWith('Hello World');
            expect(fn.callback).toHaveBeenCalledWith('Hello World');
        });

        it('should return the last notification value from the notification object', function(){
            var notification = NotificationFactory.build('Test'),
                callback = function(){};

            var id = notification.subscribe(callback);
            notification.notify('Hello World');
            notification.notify('Hello You');
            var value = notification.getLastNotifyValue();

            expect(value).toEqual('Hello You');
        });
    });

});