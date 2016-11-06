'use strict'

describe('PopupController', function(){

    var PopupController,
        NotificationService,
        UtilsService,
        $element,
        $scope;

    beforeEach(function(){
        angular.mock.module('app');
        angular.mock.inject(function($controller, $rootScope, _NotificationService_, _UtilsService_){
            NotificationService = _NotificationService_;
            UtilsService = _UtilsService_;
            $scope = $rootScope.$new();
            $element = angular.element('<div></div>');

            PopupController = $controller('PopupController', {$scope:$scope, $element:$element});
        });
    });

    describe('#init', function(){

        it('should init the controller', function(){
            spyOn(NotificationService, 'subscribe');

            PopupController.init();

            expect(NotificationService.subscribe).toHaveBeenCalled();
        });

        it('should open the pop up when MESSAGE notification is received (error message)', function(){
            spyOn(PopupController.internal.$popup, 'modal');

            NotificationService.notify('MESSAGE', {errorMsg:'An error occured'});

            expect(PopupController.internal.$popup.modal).toHaveBeenCalledWith('show');
            expect(PopupController.msg).toEqual('An error occured');
        });

        it('should open the pop up when MESSAGE notification is received (success message)', function(){
            spyOn(PopupController.internal.$popup, 'modal');

            NotificationService.notify('MESSAGE', {msgType:'put-post', msg:'Success'});

            expect(PopupController.internal.$popup.modal).toHaveBeenCalledWith('show');
            expect(PopupController.msg).toEqual('Success');
        });

    });

    describe('#destroy', function(){

        it('should unsubscribe to the MESSAGE NotificationService', function(){
            spyOn(NotificationService, 'unsubscribe');

            $scope.$destroy();

            expect(NotificationService.unsubscribe).toHaveBeenCalled();
        });

    });

});