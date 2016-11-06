'use strict'

var bcrypt = require('bcryptjs'),
    Q = require('q'),
	User = require('../../../mongo-models/user'),
    Utils = require('../../../utils/utils'),
    JWT = require('../../../utils/JWT'),
    CONST = require('../../../config/constant'),
    Message = require('../../../message/message');

module.exports = function(req, res){
    var myReq, myRes;
    var internal = {
        __error: function(param){
            myRes.json(param);
        },
        __success: function(param){
            myRes.json(param);
        },
        __parseUserInfo: function(userInfo){
            var deferred = Q.defer();
            if(bcrypt.compareSync(userInfo.password, userInfo.data.password)){
                deferred.resolve({
                    data: {
                        _id: userInfo.data._id,
                        email: userInfo.data.email,
                        firstname: userInfo.data.firstname,
                        lastname: userInfo.data.lastname,
                        role: userInfo.data.role,
                        date: userInfo.data.date,
                        active: userInfo.data.active
                    },
                    token: JWT.createJWT({id:userInfo.data._id}),
                    msgType:'login',
                    msg: Message.translate(myReq.CEMS.server.lang, CONST.USER.SUCCESS.AUTHENTICATION_GRANTED)
                });
            }else{
                deferred.reject({
                    msgType:'login',
                    errorMsg: Message.translate(myReq.CEMS.server.lang, CONST.USER.ERROR.WRONG_EMAIL_AND_PASSWORD)
                });
            }
            return deferred.promise;
        },
        __findUser: function(userInfo){
            var deferred = Q.defer();
            User.findBy({email: userInfo.email}, true)
                .then(function(result){
                    if(result && result[0] && result[0]._id && userInfo.password){
                        deferred.resolve({data:result[0], password:userInfo.password});
                    }else{
                        deferred.reject({
                            msgType:'login',
                            errorMsg: Message.translate(myReq.CEMS.server.lang, CONST.USER.ERROR.WRONG_EMAIL)
                        });
                    }
                })
                .catch(function(reason){
                    deferred.reject({
                        msgType:'login',
                        errorMsg: Message.translate(myReq.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR)
                    });
                });
            return deferred.promise;
        },
        __infoExists: function(){
            var deferred = Q.defer(),
                email = Utils.keyInObject('CEMS.userInput.email', myReq),
                password = Utils.keyInObject('CEMS.userInput.password', myReq);
            if(email && password){
                deferred.resolve({email:email, password:password});
            }else{
                deferred.reject({
                    msgType:'login',
                    errorMsg: Message.translate(myReq.CEMS.server.lang, CONST.USER.ERROR.WRONG_EMAIL_AND_PASSWORD)
                });
            }
            return deferred.promise;
        },
        init: function(req, res){
            myReq = req;
            myRes = res;

            Q
            .fcall(internal.__infoExists)
            .then(internal.__findUser)
            .then(internal.__parseUserInfo)
            .then(internal.__success)
            .fail(internal.__error)
            .done();
        }
    };

    return internal;
};