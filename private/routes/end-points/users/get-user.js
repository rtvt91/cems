'use strict'

var Q = require('q'),
    User = require('../../../mongo-models/user'),
    Utils = require('../../../utils/utils'),
    CONST = require('../../../config/constant'),
    Message = require('../../../message/message');

module.exports = function(){

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
        __findUser: function(user_id){
            var deferred = Q.defer();
            User.findBy({_id:user_id})
                .then(function(result){
                    deferred.resolve({
                        data: result && result[0],
                        token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
                    });
                })
                .catch(function(reason){
                    deferred.reject({
                        msgType:'get-user',
                        errorMsg: Message.translate(myReq.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR),
                        token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
                    });
                });
            return deferred.promise;
        },
        __infoExists: function(){
            var deferred = Q.defer(),
                user_id = Utils.keyInObject('CEMS.userInput.user_id', myReq);
            if(user_id){
                deferred.resolve(user_id);
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
            .then(internal.__success)
            .fail(internal.__error)
            .done();
        }
    };

    return internal;
};