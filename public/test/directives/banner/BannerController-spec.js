'use strict'

describe('BannerController', function(){

    var BannerController,
        NotificationService,
        UtilsService,
        $scope;

    beforeEach(function(){
        angular.mock.module('app');
        angular.mock.inject(function($controller, $rootScope, _NotificationService_, _UtilsService_){
            NotificationService = _NotificationService_;
            UtilsService = _UtilsService_;
            $scope = $rootScope.$new();

            BannerController = $controller('BannerController', {$scope:$scope});
        });
    });

    describe('#onClick', function(){

        it('should set isOpen property and notify BANNER message', function(){
            spyOn(NotificationService, 'notify');

            BannerController.onClick();

            expect(NotificationService.notify).toHaveBeenCalled();
        });

    });

    describe('#init', function(){

        it('should init the controller', function(){
            spyOn(NotificationService, 'subscribe');

            BannerController.init();

            expect(NotificationService.subscribe.calls.count()).toEqual(2);
        });

        it('should set isConnected property to false if user is disconnected', function(){

            NotificationService.notify('USER_DATA', {data:{firstname:'John', lastname:'Doe'}});

            expect(BannerController.props.isConnected).toEqual(true);
        });

        it('should set isConnected property to false if user is disconnected', function(){

            NotificationService.notify('USER_DATA', {data:{}});

            expect(BannerController.props.isConnected).toEqual(false);
        });

    });

});