'use strict'

var Q = require('q'),
    Category = require('../../../mongo-models/category'),
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
        __findBy: function(category_id){
            var deferred = Q.defer();
            Category.findBy({_id:category_id})
                    .then(function(result){
                        deferred.resolve({
                            data: result,
                            token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
                        });
                    })
                    .catch(function(reason){
                        deferred.reject({
                            msgType:'get-category',
                            errorMsg: Message.translate(myReq.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR),
                            token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
                        });
                    });
            return deferred.promise;
        },
        __infoExists: function(){
            var deferred = Q.defer(),
                category_id = Utils.keyInObject('CEMS.categoryInput.category_id', myReq);
                if(category_id){
                    deferred.resolve(category_id);
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
            .then(internal.__findBy)
            .then(internal.__success)
            .fail(internal.__error)
            .done();
        }
    };

    return internal;
};