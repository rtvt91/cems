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
        __findAll: function(){
            var deferred = Q.defer();
            User.findAll()
                .then(function(result){
                    deferred.resolve({
                        data: result,
                        token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
                    });
                })
                .catch(function(reason){
                    deferred.reject({
                        msgType:'get-users',
                        errorMsg: Message.translate(myReq.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR),
                        token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
                    });
                });
            return deferred.promise;
        },
        init: function(req, res){
            myReq = req;
            myRes = res;

            Q
            .fcall(internal.__findAll)
            .then(internal.__success)
            .fail(internal.__error)
            .done()
        }
    };

    return internal;
};