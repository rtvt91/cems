'use strict'

describe('NotificationService', function(){

    var NotificationService;

    beforeEach(function(){
        angular.mock.module('app');
        angular.mock.inject(function(_NotificationService_){
            NotificationService = _NotificationService_;
        });
    });

    describe('#subscribe', function(){

        it('should return an id when subscribe to a notification', function(){
            var id = NotificationService.subscribe('TEST', function(){});
            expect(id).toEqual(1);
        });

        it('should subscribe to a notification', function(){
            var callback = jasmine.createSpy('callback'),
                id = NotificationService.subscribe('TEST', callback);
            NotificationService.notify('TEST', 'hello world');

            expect(callback).toHaveBeenCalledWith('hello world');
        });

        it('should not subscribe to notification if no type or callback is sent', function(){
            var id = NotificationService.subscribe();
            expect(id).not.toBeDefined();
        });

    });

    describe('#unsubscribe', function(){

        it('should unsubscribe to a notification', function(){
            var callback = jasmine.createSpy('callback'),
                id = NotificationService.subscribe('TEST', callback);
            NotificationService.unsubscribe('TEST', id);
            NotificationService.notify('TEST', 'hello world');

            expect(callback).not.toHaveBeenCalledWith('hello world');
        });

        it('should not unsubscribe to notification if the wrong id is sent', function(){
            var callback = jasmine.createSpy('callback'),
                id = NotificationService.subscribe('TEST', callback);
            NotificationService.unsubscribe('TEST', 42548711);
            NotificationService.notify('TEST', 'hello world');

            expect(callback).toHaveBeenCalledWith('hello world');
        });

    });

    describe('#notify', function(){
        it('should notifty to all subscribers', function(){
            var callback = jasmine.createSpy('callback'),
                id = NotificationService.subscribe('TEST', callback);
            NotificationService.notify('TEST', 'hello world');

            expect(callback).toHaveBeenCalledWith('hello world');
        });

        it('should not notifty to other subscribers', function(){
            var callback = jasmine.createSpy('callback'),
                id = NotificationService.subscribe('TEST', callback);
            NotificationService.notify('ANOTHER_TEST', 'hello world');

            expect(callback).not.toHaveBeenCalledWith('hello world');
        });
    });

    describe('#getLastNotifyValue', function(){

        it('should return the last notified value', function(){
            var callback = jasmine.createSpy('callback'),
                id = NotificationService.subscribe('TEST', callback);
            NotificationService.notify('TEST', 'hello world');

            expect(NotificationService.getLastNotifyValue('TEST')).toEqual('hello world');
        });

        it('should return undefined if no value was notified', function(){
            var callback = jasmine.createSpy('callback'),
                id = NotificationService.subscribe('TEST', callback);
            expect(NotificationService.getLastNotifyValue('TEST')).toBeUndefined();
        });

    });

});