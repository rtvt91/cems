'use strict'

angular
    .module('UserInfoModule.controller')
    .controller('UserInfoController', /*@ngInject*/function(UtilsService, UserHTTPService, NotificationService, $state, $scope){
        var that = this,
            userDataNotifId;

        this.props = {
            user: undefined,
            toggle: false
        };

        this.internal = {
            updateUserCallback: function(result){
                if(result && result.data && result.data[0]){
                    that.props.user = result.data[0];
                    that.props.user.date = new Date(result.data[0].date);
                    that.togglePassword();
                    NotificationService.notify('USER_DATA', {data: result.data[0]});
                }
            },
            getUserByIdCallback: function(result){
                if(UtilsService.keyInObject('data', result)){
                    that.props.user = result.data;
                    that.props.user.date = new Date(result.data.date);
                }
            }
        };

        this.updateUserInfo = function(){
            var user = this.props.user;
            if(this.props.toggle){
                if(user && user.firstname && user.lastname && UtilsService.validEmail(user.email) && UtilsService.validPassword(user.password) && UtilsService.validPassword(user.newPassword) && UtilsService.validPassword(user.newPassword2)){
                    this.updateInfo({
                        _id: UtilsService.getIdFromJWT(),
                        firstname: user.firstname,
                        lastname: user.lastname,
                        email: user.email,
                        password: user.password,
                        newPassword: user.newPassword,
                        newPassword2: user.newPassword2
                    });
                }
            }else{
                if(user && user.firstname && user.lastname && UtilsService.validEmail(user.email)){
                    this.updateInfo({
                        _id: UtilsService.getIdFromJWT(),
                        firstname: user.firstname,
                        lastname: user.lastname,
                        email: user.email
                    });
                }
            }
        };

        this.updateInfo = function(param){
            UserHTTPService.updateUser(param, this.internal.updateUserCallback);
        };

        this.togglePassword = function(){
            this.props.toggle = !this.props.toggle;
        };
        
        this.init = function(){
            var id = UtilsService.getIdFromJWT();
            if(id){
                UserHTTPService.getUserById({_id:id}, this.internal.getUserByIdCallback);
            }
            userDataNotifId = NotificationService.subscribe('USER_DATA', function(result){
                that.props.user = UtilsService.keyInObject('data', result);
                if(!that.props.user){
                    $state.go('home');
                }
            });
        };

        this.init();

        $scope.$on('$destroy', function(){
            NotificationService.unsubscribe('USER_DATA', userDataNotifId);
        });

    });