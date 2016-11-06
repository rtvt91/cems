'use strict'

var	Q = require('q'),
    Category = require('../../../mongo-models/category'),
    Post = require('../../../mongo-models/post'),
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
        __updatePosts: function(param){
            var deferred = Q.defer();
            Post.update( {categoryId : {"$in":param.category_id}}, {categoryId:param.defaultCatId} , {multi: true} , function(err, docs){
                if(err){
                    deferred.reject({
                        msgType:'delete-category',
                        errorMsg: Message.translate(myReq.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR),
                        token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
                    });
                }else if(docs){
                    deferred.resolve({
                        msgType:'delete-category',
                        msg: Message.translate(myReq.CEMS.server.lang, CONST.MONGO.CATEGORY_DELETED),
                        token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
                    });
                }else{
                    deferred.reject({
                        msgType:'delete-category',
                        errorMsg: Message.translate(myReq.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR),
                        token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
                    });
                }
            });
            return deferred.promise;
        },
        __findDefaultCategory: function(category_id){
            var deferred = Q.defer();
            Category.findBy({defaultCat:true})
                    .then(function(result){
                        var defaultCatId = result && result[0] && result[0]._id;
                        deferred.resolve({category_id:category_id, defaultCatId:defaultCatId});
                    })
                    .catch(function(reason){
                        deferred.reject({
                            msgType:'delete-category',
                            errorMsg: Message.translate(myReq.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR),
                            token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
                        });
                    });
            return deferred.promise;
        },
        __deleteCategory: function(category_id){
            var deferred = Q.defer();
            Category.delete(category_id)
                    .then(function(result){
                        deferred.resolve(category_id);
                    })
                    .catch(function(reason){
                        deferred.reject({
                            msgType:'delete-category',
                            errorMsg: Message.translate(myReq.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR),
                            token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
                        });
                    });
            return deferred.promise;
        },
        __findCategory: function(category_id){
            var deferred = Q.defer();
            Category.findBy({_id:category_id})
                .then(function(result){
                    if(result && result.length > 0){
                        var category = result[0],
                            defaultCat = Utils.keyInObject('defaultCat', category, true);
                        if(defaultCat && !category.defaultCat){
                            deferred.resolve(category_id);
                        }else{
                            deferred.reject();
                        }
                    }else{
                        deferred.reject();
                    }
                })
                .catch(function(reason){
                    deferred.reject();
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
            .then(internal.__findCategory)
            .then(internal.__deleteCategory)
            .then(internal.__findDefaultCategory)
            .then(internal.__updatePosts)
            .then(internal.__success)
            .fail(internal.__error)
            .done();
        }
    };

    return internal;
};