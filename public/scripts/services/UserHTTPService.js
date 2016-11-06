'use strict'

angular
	.module('app')
	.service('UserHTTPService', /*@ngInject*/function($http, UtilsService, NotificationService, $state){

        var _loginLogoutSuccess = function(data){
            NotificationService.notify('USER_DATA', data);
        };

        var _error = function(data, status, headers, config){
            NotificationService.notify('USER_DATA', {});
            if(status === 401){
                $state.go('401');
            }else if(status === 404){
                $state.go('404');
            }
        };

        /*CALL API METHOD */
        this.getUsers = function(cb){
            if(angular.isFunction(cb)){
                $http.get('/api/users').success(cb).error(_error);
            }
        };

        this.getUserById = function(param, cb){
            if(UtilsService.keyInObject('_id', param) && angular.isFunction(cb)){
                $http.get('/api/users/' + param._id).success(cb).error(_error);
            }
        };

        this.postUser = function(param){
            if(!UtilsService.isEmptyObject(param)){
                $http.post('/api/users/', param).success(_loginLogoutSuccess).error(_error);
            }
        };

        this.updateUser = function(user, cb){
            if(UtilsService.keyInObject('_id', user) && angular.isFunction(cb)){
                $http.put('/api/users/' + user._id, user).success(cb).error(_error);
            }
        };

        this.deleteUser = function(id, cb){
            if(id && angular.isFunction(cb)){
                $http.delete('/api/users/' + id).success(cb).error(_error);
            }
        };

        /*CALL ACTION METHOD */
        this.login = function(user){
            if(!UtilsService.isEmptyObject(user)){
                $http.post('/action/login', user).success(_loginLogoutSuccess).error(_error);
            }
        };

        this.logout = function(){
            $http.get('/action/logout').success(_loginLogoutSuccess).error(_error);
        };

        this.firstTime = function(user, cb){
            if(!UtilsService.isEmptyObject(user) && angular.isFunction(cb)){
                $http.post('/action/first-time/', user).success(cb).error(_error);
            }
        };

    });