'use strict'

var	Q = require('q'),
    User = require('../../../mongo-models/user'),
    JWT = require('../../../utils/jwt'),
    Utils = require('../../../utils/utils'),
    CONST = require('../../../config/constant'),
    Message = require('../../../message/message');

module.exports = function(){
    
    var myReq, myRes;
    var internal = {
        __error: function(param){
            myRes.json(param);
        },
        __success: function(param){
            myRes.json(param);
        },
        __saveUser: function(user){
            var deferred = Q.defer();
            user.record()
                .then(function(result){
                    deferred.resolve({
                        data: {
                            email: result.email,
                            firstname: result.firstname,
                            lastname: result.lastname,
                            role: result.role,
                            active: result.active,
                            date: result.date,
                        },
                        msgType:'post-user',
                        msg: Message.translate(myReq.CEMS.server.lang, CONST.USER.SUCCESS.AUTHENTICATION_GRANTED),
                        token: JWT.createJWT({id:result._id})
                    });
                })
                .catch(function(result){
                    var errorMsg;
                    if(result.code === 11000){
                        errorMsg = Message.translate(myReq.CEMS.server.lang, CONST.MONGO.EMAIL_ALREADY_EXIST);
                    }else{
                        errorMsg = Message.translate(myReq.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR);
                    }
                    deferred.reject({
                        msgType:'first-user',
                        errorMsg: errorMsg
                    });
                });
            return deferred.promise;
        },
        __createUser: function(userInfo){
            var deferred = Q.defer(),
                user = User.create({
                    email: userInfo.email,
                    password: userInfo.password,
                    firstname: userInfo.firstname,
                    lastname: userInfo.lastname
                });
            deferred.resolve(user);
            return deferred.promise;
        },
        __infoExists: function(){
            var deferred = Q.defer(),
                email = Utils.keyInObject('CEMS.userInput.email', myReq),
                password = Utils.keyInObject('CEMS.userInput.password', myReq),
                password2 = Utils.keyInObject('CEMS.userInput.password2', myReq),
                firstname = Utils.keyInObject('CEMS.userInput.firstname', myReq),
                lastname = Utils.keyInObject('CEMS.userInput.lastname', myReq);
            if(!email){
                deferred.reject({
                    msgType:'first-user',
                    errorMsg:Message.translate(myReq.CEMS.server.lang, CONST.USER.ERROR.INVALID_EMAIL)
                });
            }else if(!password){
                deferred.reject({
                    msgType:'first-user',
                    errorMsg:Message.translate(myReq.CEMS.server.lang, CONST.USER.ERROR.INVALID_PASSWORD)
                });
            }else if(!password2){
                deferred.reject({
                    msgType:'first-user',
                    errorMsg:Message.translate(myReq.CEMS.server.lang, CONST.USER.ERROR.INVALID_PASSWORD)
                });
            }else if(password !== password2){
                deferred.reject({
                    msgType:'first-user',
                    errorMsg:Message.translate(myReq.CEMS.server.lang, CONST.USER.ERROR.INVALID_PASSWORD)
                });
            }else if(!firstname){
                deferred.reject({
                    msgType:'first-user',
                    errorMsg:Message.translate(myReq.CEMS.server.lang, CONST.USER.ERROR.INVALID_FIRSTNAME)
                });
            }else if(!lastname){
                deferred.reject({
                    msgType:'first-user',
                    errorMsg:Message.translate(myReq.CEMS.server.lang, CONST.USER.ERROR.INVALID_LASTNAME)
                });
            }else{
                deferred.resolve({
                    email: email,
                    password: password,
                    firstname: firstname,
                    lastname: lastname
                });
            }
            return deferred.promise;
        },
        init: function(req, res){
            myReq = req;
            myRes = res;

            Q
            .fcall(internal.__infoExists)
            .then(internal.__createUser)
            .then(internal.__saveUser)
            .then(internal.__success)
            .fail(internal.__error)
            .done();
        }
    };

    return internal;
};