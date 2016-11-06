'use strict'

var Q = require('q'),
    Category = require('../../../mongo-models/category'),
    Utils = require('../../../utils/utils'),
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
        __findAll: function(){
            var deferred = Q.defer();
            Category.findAll()
                    .then(function(result){
                        deferred.resolve({
                            data: result,
                            token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
                        });
                    })
                    .catch(function(reason){
                        deferred.reject({
                            msgType:'get-categories',
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
            .done();
        }
    };

    return internal;
};