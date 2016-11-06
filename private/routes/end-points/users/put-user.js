'use strict'

var Q = require('q'),
	bcrypt = require('bcryptjs'),
	User = require('../../../mongo-models/user'),
    CONST = require('../../../config/constant'),
    CONFIG = require('../../../config/config'),
	Utils = require('../../../utils/utils'),
	Message = require('../../../message/message');

module.exports = function(req, res){

	// req.CEMS.userInput.user_id => The user id that someone try to update
	// req.CEMS.jwt.validateDecodedToken.id => The user id that's actually logged in

	var myReq, myRes;
	var internal = {
		__error: function(param){
			if(param){
				myRes.json(param);
			}else{
				myRes.status(401).end();
			}
		},
		__success: function(param){
			myRes.json(param);
		},
		__updateUser: function(){
			var deferred = Q.defer();
			User.update(myReq.CEMS.userInput.user_id, myReq.CEMS.userInput)
				.then(function(result){
					deferred.resolve({
						data: [{
							email: result.email,
							firstname: result.firstname,
							lastname: result.lastname,
							role: result.role,
							active: result.active,
							date: result.date,
						}],
						token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : '',
						msgType:'put-user',
						msg: Message.translate(myReq.CEMS.server.lang, CONST.MONGO.USER_UPDATED)
					});
				})
				.catch(function(result){
					deferred.reject({
						msgType:'put-user',
						errorMsg: Message.translate(myReq.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR),
						token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
					});
				});
			return deferred.promise;
		},
		__parseUser: function(user){
			var deferred = Q.defer();
			//WRITER CAN'T BECOME ADMIN && ADMIN CAN'T BECOME WRITER
			if(Utils.keyInObject('role', user) === CONST.USER.ROLE.ADMIN && Utils.keyInObject('CEMS.userInput.role', myReq) !== CONST.USER.ROLE.ADMIN){
				delete myReq.CEMS.userInput.role;
			}else if(user.role !== CONST.USER.ROLE.ADMIN){
				delete myReq.CEMS.userInput.role;
			}
			//USER CAN'T MODIFY ITS OWN ACTIVE PROPERTY
			if(Utils.keyInObject('CEMS.userInput.user_id', myReq) === Utils.keyInObject('CEMS.jwt.validateDecodedToken.id', myReq)){
				delete myReq.CEMS.userInput.active;
			}
			//TEST PASSWORD AND NEWPASSWORD
			var password = Utils.keyInObject('CEMS.userInput.password', myReq),
				newPassword = Utils.keyInObject('CEMS.userInput.newPassword', myReq),
				newPassword2 = Utils.keyInObject('CEMS.userInput.newPassword2', myReq);
			if(password && newPassword && newPassword2){
				if(Utils.isValidPassword(password) && Utils.isValidPassword(newPassword) &&Utils.isValidPassword(newPassword2)){
					if(newPassword === newPassword2){
						if(bcrypt.compareSync(password, user.password)){
							myReq.CEMS.userInput.password = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
							delete myReq.CEMS.userInput.newPassword;
							deferred.resolve();
						}else{
							deferred.reject({
								msgType:'put-user',
								errorMsg:Message.translate(myReq.CEMS.server.lang, CONST.USER.ERROR.INVALID_PASSWORD),
								token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
							});
						}
					}else{
						deferred.reject({
							msgType:'put-user',
							errorMsg:Message.translate(myReq.CEMS.server.lang, CONST.USER.ERROR.INVALID_PASSWORD),
							token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
						});
					}
				}else{
					deferred.reject({
						msgType:'put-user',
						errorMsg:Message.translate(myReq.CEMS.server.lang, CONST.USER.ERROR.INVALID_PASSWORD),
						token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
					});
				}
			}else{
				deferred.resolve();
			}
			return deferred.promise;
		},
		__findUser: function(id){
			var deferred = Q.defer();
			User.findBy({_id:id}, true)
				.then(function(result){
					deferred.resolve(result[0]);
				})
				.catch(function(){
					deferred.reject({
						msgType:'put-user',
						errorMsg: Message.translate(myReq.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR),
						token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
					});
				});
			return deferred.promise;
		},
		__infoExists: function(){
			var deferred = Q.defer(),
				id = Utils.keyInObject('CEMS.jwt.validateDecodedToken.id', myReq);
			if(id){
				deferred.resolve(id);
			}else{
				deferred.reject();
			}
			return deferred.promise;
		},
		init: function(req, res){
			myReq = req;
			myRes = res;

			Q
			.fcall(internal.__infoExists)
			.then(internal.__findUser)
			.then(internal.__parseUser)
			.then(internal.__updateUser)
			.then(internal.__success)
			.fail(internal.__error)
			.done();
		}
	};

	return internal;
};
