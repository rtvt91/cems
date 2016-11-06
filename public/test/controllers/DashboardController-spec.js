'use strict'

describe('DashboardController', function(){

    var $controller,
        DashboardController,
        NotificationService,
        $state,
        $location,
        $scope;

    beforeEach(function(){
        angular.mock.module('app');
        angular.mock.inject(function(_$controller_, _NotificationService_, _$state_, _$rootScope_, _$location_){
            $controller = _$controller_;
            NotificationService = _NotificationService_;
            $state = _$state_;
            $location = _$location_;

            $scope = _$rootScope_.$new();

            DashboardController = $controller('DashboardController', {$scope: $scope});
        });
    });

    describe('#toggleNav', function(){

        it('should set currentSelection property with the passed string', function(){
            DashboardController.toggleNav('user-info');
            expect(DashboardController.currentSelection).toEqual('user-info');
        });

    });

    describe('#gotoState', function(){

        it('should set currentSelection property with the passed string', function(){
            spyOn($state, 'transitionTo');

            DashboardController.gotoState('user-list');

            expect($state.transitionTo).toHaveBeenCalledWith('dashboard.user-list');
        });

    });

    describe('#init', function(){

        it('should set currentSelection property from the $location service', function(){
            spyOn($location, 'path').and.callFake(function(){
                return '/dashboard/user-list';
            });

            DashboardController.init();

            expect(DashboardController.currentSelection).toEqual('user-list');
        });

        it('should subscribe to USER_DATA NotificationService', function(){
            spyOn(NotificationService, 'subscribe');

            DashboardController.init();

            expect(NotificationService.subscribe).toHaveBeenCalled();
        });

        it('should redirect to home if no USER_DATA was reiceved', function(){
            spyOn($state, 'go');

            NotificationService.notify('USER_DATA', {});

            expect($state.go).toHaveBeenCalledWith('home');
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