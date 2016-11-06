'use strict'

angular
	.module('app')
	.factory('HTTPInterceptor', /*@ngInject*/function(localStorageService, UtilsService, NotificationService, $rootScope){

		var _configureRequest = function(config){
			config.headers = config.headers || {};
			var jwt = localStorageService.get('jwt');
			if(jwt){
				config.headers.Authorization = 'Bearer ' + jwt;
			}
			return config;
		};

		var _manageJsonWebToken = function(jwt){
			var data = {
				isLogged: false,
				payload: undefined
			};
			if(jwt && angular.isString(jwt)){
				localStorageService.set('jwt', jwt);
				var payload = jwt.split('.')[1],
					converted = atob(payload);
				data.isLogged = true;
				data.payload = angular.fromJson(converted, true);
			}else{
				localStorageService.clearAll();
			}
			return data;
		};

		var _setMessage = function(param){
			if(!UtilsService.isEmptyObject(param)){
				if(UtilsService.keyInObject('msg', param) && UtilsService.keyInObject('msgType', param)){
					NotificationService.notify('MESSAGE', {msg: param.msg, msgType:param.msgType});
				}else if(UtilsService.keyInObject('errorMsg', param)){
					NotificationService.notify('MESSAGE', {errorMsg: param.errorMsg, msgType:param.msgType});
				}
			}
		};

		var _parseResponse = function(response){
			var json;
			if(response.status === 200 && response.data){
				if(UtilsService.keyInObject('data', response) && angular.isObject(response.data)){
					_setMessage(response.data);
					json = _manageJsonWebToken(response.data.token);
					delete response.data.token;
					delete response.data.msg;
					delete response.data.errorMsg;
				}
			}
		};

		return {
			request: function (config){
				return _configureRequest(config);
			},
			response: function(response){
				_parseResponse(response);
				return response;
			},
			responseError: function(response){
				if(response.status === 401){
					NotificationService.notify('USER_DATA', {});
					_manageJsonWebToken(response && response.data && response.data.token);
					$rootScope.$emit('401');
				}else if(response.status === 404){
					$rootScope.$emit('404');
				}
				return response;
			}
		};
	});