'use strict'

var Q = require('q'),
	CONST = require('../../config/constant'),
	CONFIG = require('../../config/config'),
	Utils = require('../../utils/utils'),
    Message = require('../../message/message'),
	JWT = require('../../utils/jwt'),
	User = require('../../mongo-models/user');

var Access = (function(){

	var _xhrOnly = function(req, res, next){
		if(req.xhr){
			next();
		}else{
			res.status(401).end();
		}
	};

	var _loggedOnly = function(){

		var myReq, myRes, myNext;

		var internal = {
			__error: function(reason){
				var errorMsg = Utils.keyInObject('errorMsg', reason);
				if(errorMsg === 'TokenExpiredError'){
					var lang = myReq.acceptsLanguages(CONFIG.LANG);
					myRes.json({
						msgType:'access-disconnect',
						errorMsg: Message.translate(lang, CONST.USER.ERROR.EXPIRED_JWT)
					});
				}else{
					myRes.status(401).end();
				}
			},
			__next: function(cems){
				myNext();
			},
			__isUserActive: function(user){
				var deferred = Q.defer();
				if(user && user[0] && user[0].active){
					myReq.CEMS.jwt.role = user[0].role;
					deferred.resolve(myReq.CEMS);
				}else{
					deferred.reject({errorMsg: 401});
				}
				return deferred.promise;
			},
			__findUser: function(tokenObject){
				myReq.CEMS.jwt = tokenObject;
				return User.findBy({ _id:tokenObject.validateDecodedToken.id });
			},
			__validateJWT: function(token){
				var deferred = Q.defer();
				JWT.validateJWT(token).then(function(tokenObject){
					deferred.resolve(tokenObject);
				}).catch(function(reason){
					deferred.reject(reason);
				});
				return deferred.promise;
			},
			__hasToken: function(){
				var deferred = Q.defer(),
					token = Utils.keyInObject('CEMS.server.token', myReq);
				if(token){
					deferred.resolve(token);
				}else{
					deferred.reject({errorMsg: 401});
				}
				return deferred.promise;
			},
			init: function(req, res, next){
				myReq = req;
				myNext = next;
				myRes = res;
				Q
				.fcall(internal.__hasToken)
				.then(internal.__validateJWT)
				.then(internal.__findUser)
				.then(internal.__isUserActive)
				.then(internal.__next)
				.fail(internal.__error)
				.done();
			}
		};

		return internal;
	};

	var _adminOnly = function(){

		var myReq, myRes, myNext;

		var internal = {
			__error: function(reason){
				myRes.status(401).end();
			},
			__next: function(user){
				myNext();
			},
			__findUser: function(id){
				var deferred = Q.defer();
				User
					.findBy({_id: id})
					.then(function(result){
						if(result && result[0] && result[0].role && result[0].role.toUpperCase() === CONST.USER.ROLE.ADMIN){
							deferred.resolve(result);
						}else{
							deferred.reject({errorMsg: 401});
						}
					})
					.catch(function(reason){
						deferred.reject({errorMsg: 401});
					});
			},
			__hasToken: function(){
				var deferred = Q.defer(),
					id = Utils.keyInObject('CEMS.jwt.validateDecodedToken.id', myReq);
				if(id){
					deferred.resolve(id);
				}else{
					deferred.reject({errorMsg: 401});
				}
				return deferred.promise;
			},
			init: function(req, res, next){
				myReq = req;
				myRes = res;
				myNext = next;
				Q
				.fcall(internal.__hasToken)
				.then(internal.__findUser)
				.then(internal.__next)
				.fail(internal.__error)
				.done();
			}
		};

		return internal;
	};

	return{
		xhrOnly: _xhrOnly,
		loggedOnly: _loggedOnly,
		adminOnly: _adminOnly,
	};

}());

module.exports = Access;