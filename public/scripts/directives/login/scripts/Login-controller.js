'use strict'

angular
    .module('LoginModule.controller')
    .controller('LoginController', /*@ngInject*/function(UserHTTPService, NotificationService, UtilsService, $state, $scope){
        
        var that = this,
            userDataNotifId,
            keyShortcutNotifId,
            bannerNotifId;

        this.props = {
            toggled: false,
            isConnected: false,
            user:{
                firstname: '',
                lastname: ''
            }
        };

        this.internal = {
            getUserByIdCallback: function(result){
                NotificationService.notify('USER_DATA', result);
            }
        };

        this.signIn = function(user){
            UserHTTPService.login(user);
        };
        this.logout = function(){
            UserHTTPService.logout();
        };
        this.createAccount = function(user){
            UserHTTPService.postUser(user, function(result){});
            this.toggleForm();
        };
        this.toggleForm = function(){
            this.props.toggled = !this.props.toggled;
        };
        this.enableSignIn = function(loginForm){
            return (loginForm.email.$valid && loginForm.password.$valid)? false : true;
        }
        this.enableCreateAccount = function(loginForm){
            return (loginForm.email.$valid && loginForm.password.$valid && loginForm.password2.$valid && loginForm.firstname.$valid && loginForm.lastname.$valid)? false : true;
        };
        this.gotoDashboard = function(){
            $state.go('dashboard.user-info');
        };

        this.init = function(){
            if(UtilsService.getIdFromJWT()){
                UserHTTPService.getUserById({_id:UtilsService.getIdFromJWT()}, that.internal.getUserByIdCallback);
            }

            userDataNotifId = NotificationService.subscribe('USER_DATA', function(result){
                var data = UtilsService.keyInObject('data', result);
                that.props.user.firstname = (data)? data.firstname : '';
                that.props.user.lastname = (data)? data.lastname : '';
                that.props.isConnected = data;
            });

            keyShortcutNotifId = NotificationService.subscribe('SHORTCUT_DECONNECT', function(){
                that.logout();
            });

            bannerNotifId = NotificationService.subscribe('BANNER', function(result){
                that.props.toggled = true;
                that.toggleForm();
            });
        };
        
        this.init();

        $scope.$on('$destroy', function($event){
            NotificationService.unsubscribe('USER_DATA', userDataNotifId);
            NotificationService.unsubscribe('SHORTCUT_DECONNECT', keyShortcutNotifId);
            NotificationService.unsubscribe('BANNER', bannerNotifId);
        });

    });
