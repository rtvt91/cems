'use strict'

describe('MainController', function(){

    var MainController,
        NotificationService,
        UtilsService,
        $scope;

    beforeEach(function(){
        angular.mock.module('app');
        angular.mock.inject(function($controller, _NotificationService_, _UtilsService_, _$rootScope_){
            NotificationService = _NotificationService_;
            UtilsService = _UtilsService_;

            $scope = _$rootScope_.$new();

            MainController = $controller('MainController', {$scope: $scope});
        });
    });

    describe('#toggleNav', function(){

        it('should set currentSelection property with the passed string', function(){
            MainController.toggleNav('home');
            expect(MainController.currentSelection).toEqual('home');
        });

    });

    describe('#init', function(){

        it('should set currentSelection property according to the $stateChangeStart event', function(){
            $scope.$broadcast('$stateChangeStart', {name: 'home'}, {});
            expect(MainController.currentSelection).toEqual('home');

            $scope.$broadcast('$stateChangeStart', {name: 'dashboard.user-list'}, {});
            expect(MainController.currentSelection).toEqual('dashboard');

            $scope.$broadcast('$stateChangeStart', {name: 'category'}, {name:'cat1'});
            expect(MainController.currentSelection).toEqual('cat1');
        });

        it('should subscribe to USER_DATA NotificationService', function(){
            spyOn(NotificationService, 'subscribe');

            MainController.init();

            expect(NotificationService.subscribe).toHaveBeenCalled();
        });

        it('should set isConnected property according to the notified user data', function(){
            NotificationService.notify('USER_DATA', {data:{active: true}});
            expect(MainController.isConnected).toEqual(true);

            NotificationService.notify('USER_DATA', {data:{active: false}});
            expect(MainController.isConnected).toEqual(false);

            NotificationService.notify('USER_DATA', {});
            expect(MainController.isConnected).toEqual(false);
        });

    });

    describe('#destroy', function(){

        it('should unsubscribe to NotificationService', function(){
            spyOn(NotificationService, 'unsubscribe');

            $scope.$destroy();

            expect(NotificationService.unsubscribe).toHaveBeenCalled();
        });

    });

});