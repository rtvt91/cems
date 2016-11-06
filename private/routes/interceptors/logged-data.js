'use strict'

var Q = require('q'),
	JWT = require('./../../utils/jwt'),
    CONFIG = require('./../../config/config'),
    User = require('./../../mongo-models/user'),
    Utils = require('./../../utils/utils');

var LoggedData = (function(){

    var _parse = function(){

		var myReq, myRes, myNext;

		var internal = {
			__error: function(reason){
				var errorMsg = Utils.keyInObject('errorMsg', reason);
				if(errorMsg === 'TokenExpiredError'){
					var lang = myReq.acceptsLanguages(CONFIG.LANG);
					myReq.CEMS.jwt.errorMsg = Message.translate(lang, CONST.USER.ERROR.EXPIRED_JWT);
					myNext();
				}else{
					myReq.CEMS.jwt = undefined;
					myNext();
				}
			},
			__next: function(cems){
				myNext();
			},
			__findUser: function(tokenObject){
				var deferred = Q.defer();
				User.findBy({ _id:tokenObject.validateDecodedToken.id })
					.then(function(result){
						myReq.CEMS.jwt = (result && result[0] && result[0].active)? tokenObject : undefined;
						myReq.CEMS.jwt.role = (result && result[0] && result[0].role);
						deferred.resolve(myReq.CEMS);
					})
					.catch(function(){
						deferred.reject({errorMsg: 'error'});
					});
				return deferred.promise;
			},
			__validateJWT: function(token){
				var deferred = Q.defer();
				JWT.validateJWT(token)
					.then(function(tokenObject){
						deferred.resolve(tokenObject);
					})
					.catch(function(reason){
						deferred.reject({errorMsg: 'error'});
					});
				return deferred.promise;
			},
			__hasToken: function(){
				var deferred = Q.defer(),
					token = Utils.keyInObject('CEMS.server.token', myReq);
				if(token){
					deferred.resolve(token);
				}else{
					deferred.reject({errorMsg: 'error'});
				}
				return deferred.promise;
			},
			init: function(req, res, next){
				myReq = req;
				myRes = res;
				myNext = next;

				Q
				.fcall(internal.__hasToken)
				.then(internal.__validateJWT)
				.then(internal.__findUser)
				.then(internal.__next)
				.fail(internal.__error)
				.done();
			}
		};

		return internal;
    };

    return{
        parse: _parse
    };

}());

module.exports = LoggedData;