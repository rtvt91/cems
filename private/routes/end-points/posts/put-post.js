'use strict'

var Q = require('q'),
    Post = require('../../../mongo-models/post'),
    CONST = require('../../../config/constant'),
	Utils = require('../../../utils/utils'),
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
        __updatePost: function(post_id){
            var deferred = Q.defer();
            Post.modify(post_id, myReq.CEMS.postInput)
                .then(function(result){
                    deferred.resolve({
                        msgType:'put-post',
                        msg: Message.translate(myReq.CEMS.server.lang, CONST.MONGO.POST_UPDATED),
                        token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
                    });
                })
                .catch(function(result){
                    deferred.reject({
                        msgType:'put-post',
                        errorMsg: Message.translate(myReq.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR),
                        token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
                    });
                });
            return deferred.promise;
        },
        __parsePostInfo: function(param){
            var deferred = Q.defer(),
                post = param.result[0],
                isAdmin = Utils.keyInObject('CEMS.jwt.role', myReq) === CONST.USER.ROLE.ADMIN,
                ownArticle = Utils.keyInObject('CEMS.jwt.validateDecodedToken.id', myReq) === Utils.keyInObject('userId._id', post).toString();
            if(isAdmin || ownArticle){
                deferred.resolve(param.post_id);
            }else{
                deferred.reject();
            }
            return deferred.promise;
        },
        __findPostById: function(post_id){
            var deferred = Q.defer();
            Post.findBy({_id:post_id})
                .then(function(result){
                    deferred.resolve({result:result, post_id:post_id});
                })
                .catch(function(reason){
                    deferred.reject({
                        msgType:'put-post',
                        errorMsg: Message.translate(myReq.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR),
                        token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
                    });
                });
            return deferred.promise;
        },
        __infoExists: function(){
            var deferred = Q.defer(),
                post_id = Utils.keyInObject('CEMS.postInput.post_id', myReq);
            if(post_id){
                deferred.resolve(post_id);
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
            .then(internal.__findPostById)
            .then(internal.__parsePostInfo)
            .then(internal.__updatePost)
            .then(internal.__success)
            .fail(internal.__error)
            .done();
        }
    };

    return internal;
};
