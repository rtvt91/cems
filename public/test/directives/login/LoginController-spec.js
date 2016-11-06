'use strict'

describe('Login directive', function(){

    var LoginController,
        UserHTTPService,
        NotificationService,
        UtilsService,
        loginForm,
        $scope,
        $state,
        $q;

    beforeEach(function(){

        angular.mock.module('app');
        angular.mock.inject(function($controller, $rootScope, _UserHTTPService_, _NotificationService_, _UtilsService_, _$state_){
            UserHTTPService = _UserHTTPService_;
            NotificationService = _NotificationService_;
            UtilsService = _UtilsService_;
            $state = _$state_;
            $scope = $rootScope.$new();

            LoginController = $controller('LoginController', { $scope: $scope });
        });

        loginForm = {
            email: {
                $valid: true
            },
            password: {
                $valid: true
            },
            password2: {
                $valid: true
            },
            firstname: {
                $valid: true
            },
            lastname: {
                $valid: true
            }
        };
    });

    describe('#internal.getUserByIdCallback', function(){
        
        it('should notify USER_DATA notification', function(){
            var user = {email:'john@doe.com', password:'P@ssw0rd'};
            spyOn(NotificationService, 'notify');

            LoginController.internal.getUserByIdCallback(user);

            expect(NotificationService.notify).toHaveBeenCalledWith('USER_DATA', user);
        });

    });

    describe('#signIn', function(){
        
        it('should sign a user in', function(){
            var user = {email:'john@doe.com', password:'P@ssw0rd'};
            spyOn(UserHTTPService, 'login');

            LoginController.signIn(user);

            expect(UserHTTPService.login).toHaveBeenCalledWith(user);
        });

    });

    describe('#logout', function(){
        
        it('should log a user out', function(){
            spyOn(UserHTTPService, 'logout');

            LoginController.logout();

            expect(UserHTTPService.logout).toHaveBeenCalled();
        });

    });

    describe('#createAccount', function(){
        
        it('should create a new user', function(){
            var user = {email:'john@doe.com', password:'P@ssw0rd', password2:'P@ssw0rd', firstname:'John', lastname:'Doe'};
            spyOn(UserHTTPService, 'postUser');
            spyOn(LoginController, 'toggleForm');

            LoginController.createAccount(user);

            expect(UserHTTPService.postUser).toHaveBeenCalled();
            expect(LoginController.toggleForm).toHaveBeenCalled();
        });

    });

    describe('#toggleForm', function(){

        it('should toggle the toggled property', function(){
            expect(LoginController.props.toggled).toBe(false);

            LoginController.toggleForm();

            expect(LoginController.props.toggled).toBe(true);
        });

    });

    describe('#enableSignIn', function(){
        
        it('should enable the login button', function(){
            var test = LoginController.enableSignIn(loginForm);

            expect(test).toEqual(false);
        });

        it('should disable the login button', function(){
            loginForm.email.$valid = false;
            loginForm.password.$valid = true;

            var test = LoginController.enableSignIn(loginForm);

            expect(test).toEqual(true);
        });

    });

    describe('#enableCreateAccount', function(){
        
        it('should enable the create account button', function(){
            var test = LoginController.enableCreateAccount(loginForm);

            expect(test).toEqual(false);
        });

        it('should disable the create account button', function(){
            loginForm.email.$valid = true;
            loginForm.password.$valid = true;
            loginForm.password2.$valid = true;
            loginForm.firstname.$valid = false;
            loginForm.lastname.$valid = false;

            var test = LoginController.enableCreateAccount(loginForm);

            expect(test).toEqual(true);
        });

    });

    describe('#gotoDashboard', function(){
        
        it('should navigate to dashboard state', function(){
            spyOn($state, 'go');

            LoginController.gotoDashboard();

            expect($state.go).toHaveBeenCalledWith('dashboard.user-info');
        });

    });

    describe('#init', function(){

        it('should call UserHTTPService if a token exists', function(){
            spyOn(UtilsService, 'getIdFromJWT').and.returnValue('1234567899');
            spyOn(UserHTTPService, 'getUserById');
            spyOn(NotificationService, 'subscribe');

            LoginController.init();

            expect(UserHTTPService.getUserById).toHaveBeenCalledWith({_id:'1234567899'}, LoginController.internal.getUserByIdCallback);
            expect(NotificationService.subscribe.calls.count()).toEqual(3);
        });

        it('should set firstname, lastname, isConnected property when USER_DATA notification is received', function(){
            NotificationService.notify('USER_DATA', {data:{firstname:'John', lastname:'Doe'}});

            expect(LoginController.props.user.firstname).toEqual('John');
            expect(LoginController.props.user.lastname).toEqual('Doe');
            expect(LoginController.props.isConnected).toEqual({firstname:'John', lastname:'Doe'});
        });

        it('should logout when SHORTCUT_DECONNECT notification is received', function(){
            spyOn(LoginController, 'logout');

            NotificationService.notify('SHORTCUT_DECONNECT');

            expect(LoginController.logout).toHaveBeenCalled();
        });

        it('should set toggled and call toggleForm when BANNER notification is received', function(){
            spyOn(LoginController, 'toggleForm');

            NotificationService.notify('BANNER');

            expect(LoginController.props.toggled).toEqual(true);
            expect(LoginController.toggleForm).toHaveBeenCalled();
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