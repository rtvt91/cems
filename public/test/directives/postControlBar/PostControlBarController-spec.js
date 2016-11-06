'use strict'

describe('PostControlBarController', function(){

    var PostControlBarController,
        NotificationService,
        UtilsService,
        $scope;

    beforeEach(function(){
        angular.mock.module('app');
        angular.mock.inject(function($controller, $rootScope, _NotificationService_, _UtilsService_){
            NotificationService = _NotificationService_;
            UtilsService = _UtilsService_;
            $scope = $rootScope.$new();

            PostControlBarController = $controller('PostControlBarController', {$scope:$scope});
        });
    });

    describe('#onSave', function(){

        it('should notify SHORTCUT_SAVE notification', function(){
            spyOn(NotificationService, 'notify');

            PostControlBarController.onSave();

            expect(NotificationService.notify).toHaveBeenCalledWith('SHORTCUT_SAVE', 'save');
        });

    });

    describe('#toggleActiveUser', function(){

        it('should set isActive property to true if user own the article and is connected', function(){
            spyOn(NotificationService, 'getLastNotifyValue').and.returnValue({creator:{_id:'0123456789'}});
            spyOn(UtilsService, 'getIdFromJWT').and.returnValue('0123456789');


            PostControlBarController.toggleActiveUser();

            expect(PostControlBarController.isActive).toEqual(true);
        });

        it('should set isActive property to false if user do not own the article or is deconnected', function(){
            spyOn(NotificationService, 'getLastNotifyValue').and.returnValue({creator:{_id:'987654321'}});
            spyOn(UtilsService, 'getIdFromJWT').and.returnValue(undefined);


            PostControlBarController.toggleActiveUser();

            expect(PostControlBarController.isActive).toEqual(false);
        });

    });

    describe('#init', function(){

        it('should init the controller', function(){
            spyOn(PostControlBarController, 'toggleActiveUser');
            spyOn(NotificationService, 'subscribe');

            PostControlBarController.init();

            expect(PostControlBarController.toggleActiveUser).toHaveBeenCalled();
            expect(NotificationService.subscribe).toHaveBeenCalled();
        });

        it('should call toggleActiveUser method if USER_DATA is received', function(){
            spyOn(PostControlBarController, 'toggleActiveUser');

            PostControlBarController.init();

            expect(PostControlBarController.toggleActiveUser).toHaveBeenCalled();
        });

    });

    describe('#destroy', function(){

        it('should unsubscribe to USER_DATA NotificationService', function(){
            spyOn(NotificationService, 'unsubscribe');

            $scope.$destroy();

            expect(NotificationService.unsubscribe).toHaveBeenCalled();
        });
        
    });
});