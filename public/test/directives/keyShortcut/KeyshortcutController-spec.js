'use strict'

describe('KeyshortcutController', function(){

    var KeyshortcutController,
        $document,
        $state,
        NotificationService;

    beforeEach(function(){
        angular.mock.module('app');
        angular.mock.inject(function($controller, _$document_, _$state_, _NotificationService_){
            $document = _$document_;
            $state = _$state_;
            NotificationService = _NotificationService_;

            KeyshortcutController = $controller('KeyshortcutController');
        });
    });

    describe('#document event keydown', function(){

        it('should notify BANNER notification', function(){
            var evt = $.Event('keydown', {
                altKey: true,
                keyCode: 76
            });
            spyOn(NotificationService, 'notify');

            angular.element($document).triggerHandler(evt);

            expect(NotificationService.notify).toHaveBeenCalled();
        });

        it('should go to dashboard', function(){
            var evt = $.Event('keydown', {
                altKey: true,
                keyCode: 80
            });
            spyOn($state, 'go');

            angular.element($document).triggerHandler(evt);

            expect($state.go).toHaveBeenCalledWith('dashboard.user-info');
        });

        it('should go to dashboard', function(){
            var evt = $.Event('keydown', {
                altKey: true,
                keyCode: 81
            });
            spyOn(NotificationService, 'notify');

            angular.element($document).triggerHandler(evt);

            expect(NotificationService.notify).toHaveBeenCalledWith('SHORTCUT_DECONNECT');
        });

        it('should go to dashboard', function(){
            var evt = $.Event('keydown', {
                altKey: true,
                keyCode: 83
            });
            spyOn(NotificationService, 'notify');

            angular.element($document).triggerHandler(evt);

            expect(NotificationService.notify).toHaveBeenCalledWith('SHORTCUT_SAVE', 'save');
        });

        it('should go to dashboard', function(){
            var evt = $.Event('keydown', {
                altKey: true,
                keyCode: 72
            });
            spyOn($state, 'go');

            angular.element($document).triggerHandler(evt);

            expect($state.go).toHaveBeenCalledWith('home');
        });

    });

});