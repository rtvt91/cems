'use strict'

describe('UserInfoController', function(){

    var UserInfoController,
        UtilsService,
        UserHTTPService,
        NotificationService,
        $state,
        $scope;

    beforeEach(function(){
        angular.mock.module('app');
        angular.mock.inject(function($controller, $rootScope, _UtilsService_, _UserHTTPService_, _NotificationService_, _$state_){
            UtilsService = _UtilsService_;
            UserHTTPService = _UserHTTPService_;
            NotificationService = _NotificationService_;
            $state = _$state_;
            $scope = $rootScope.$new();

            UserInfoController = $controller('UserInfoController', {$scope:$scope});
        });
    });

    describe('#internal.updateUserCallback', function(){

        it('should set user property and notify USER_DATA notification', function(){
            var result = {data:[{firstname:'John', lastname:'Doe', date:'Fri Nov 04 2016 20:03:21 GMT+0100 (Paris, Madrid)'}]};
            spyOn(UserInfoController, 'togglePassword');
            spyOn(NotificationService, 'notify');

            UserInfoController.internal.updateUserCallback(result);

            expect(UserInfoController.props.user).toEqual(result.data[0]);
            expect(UserInfoController.togglePassword).toHaveBeenCalled();
            expect(NotificationService.notify).toHaveBeenCalled();
        });

    });

    describe('#internal.getUserByIdCallback', function(){

        it('should set user property and notify USER_DATA notification', function(){
            var result = {data:{firstname:'John', lastname:'Doe', date:'Fri Nov 04 2016 20:03:21 GMT+0100 (Paris, Madrid)'}};

            UserInfoController.internal.getUserByIdCallback(result);

            expect(UserInfoController.props.user).toEqual(result.data);
        });

    });

    describe('#updateUserInfo', function(){

        it('should control the user input before updating (password)', function(){
            UserInfoController.props.toggle = true;
            UserInfoController.props.user = {_id:'d2e1d54de5d4eded', firstname:'John', lastname:'Doe', email:'john@doe.com', password:'P@ssw0rd', newPassword:'P@ssw0rd1', newPassword2:'P@ssw0rd1'};
            spyOn(UtilsService, 'getIdFromJWT').and.returnValue('d2e1d54de5d4eded');
            spyOn(UserInfoController, 'updateInfo');

            UserInfoController.updateUserInfo();

            expect(UserInfoController.updateInfo).toHaveBeenCalledWith(UserInfoController.props.user);
        });

        it('should control the user input before updating (no password)', function(){
            UserInfoController.props.toggle = false;
            UserInfoController.props.user = {_id:'d2e1d54de5d4eded', firstname:'John', lastname:'Doe', email:'john@doe.com'};
            spyOn(UtilsService, 'getIdFromJWT').and.returnValue('d2e1d54de5d4eded');
            spyOn(UserInfoController, 'updateInfo');

            UserInfoController.updateUserInfo();

            expect(UserInfoController.updateInfo).toHaveBeenCalledWith(UserInfoController.props.user);
        });

    });

    describe('#updateInfo', function(){

        it('should update user info', function(){
            spyOn(UserHTTPService, 'updateUser');
            
            UserInfoController.updateInfo();

            expect(UserHTTPService.updateUser).toHaveBeenCalled();
        });

    });

    describe('#togglePassword', function(){

        it('should update user info', function(){
            UserInfoController.props.toggle = true;

            UserInfoController.togglePassword();

            expect(UserInfoController.props.toggle).toEqual(false);
        });

    });

    describe('#init', function(){

        it('should init the controller', function(){
            spyOn(UtilsService, 'getIdFromJWT').and.returnValue('zdzd5z4d65z4d654');
            spyOn(UserHTTPService, 'getUserById');
            spyOn(NotificationService, 'subscribe');
            
            UserInfoController.init();

            expect(UserHTTPService.getUserById).toHaveBeenCalled();
            expect(NotificationService.subscribe).toHaveBeenCalled();
        });

        it('should set the user property when the USER_DATA is received', function(){
            spyOn($state, 'go');

            NotificationService.notify('USER_DATA', {});

            expect(UserInfoController.props.user).toEqual(undefined);
            expect($state.go).toHaveBeenCalledWith('home');
        });

    });

    describe('#destroy', function(){

        it('should unsubscribe the USER_DATA NotificationService', function(){
            spyOn(NotificationService, 'unsubscribe');

            $scope.$destroy();

            expect(NotificationService.unsubscribe).toHaveBeenCalled()
        });

    });

});