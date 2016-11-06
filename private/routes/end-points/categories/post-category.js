'use strict'

var	Q = require('q'),
    Category = require('../../../mongo-models/category'),
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
        __saveCategory: function(category){
            var deferred = Q.defer();
            category.record()
                    .then(function(result){
                        deferred.resolve({
                            data: result,
                            msgType:'post-category',
                            msg: Message.translate(myReq.CEMS.server.lang, CONST.CATEGORY.SUCCESS.CATEGORY_RECORDED),
                            token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
                        });
                    })
                    .catch(function(reason){
                        var errorMsg;
                        if(result.code === 11000){
                            errorMsg = Message.translate(myReq.CEMS.server.lang, CONST.MONGO.CATEGORY_ALREADY_EXIST);
                        }else{
                            errorMsg = Message.translate(myReq.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR);
                        }
                        deferred.reject({
                            msgType:'post-category',
                            errorMsg: errorMsg,
                            token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
                        });
                    });
            return deferred.promise;
        },
        __createCategory: function(name){
            var deferred = Q.defer(),
                category = Category.create({
                    name: name
                });
            deferred.resolve(category);
            return deferred.promise;
        },
        __infoExists: function(){
            var deferred = Q.defer(),
                name = Utils.keyInObject('CEMS.categoryInput.name', myReq);
            if(name){
                deferred.resolve(name);
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
            .then(internal.__createCategory)
            .then(internal.__saveCategory)
            .then(internal.__success)
            .fail(internal.__error)
            .done();
        }
    };

    return internal;
};