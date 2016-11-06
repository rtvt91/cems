'use strict'

var	Q = require('q'),
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
        __deletePost: function(post_id){
            var deferred = Q.defer();
            Post.delete(post_id)
                .then(function(result){
                    deferred.resolve({
                        msgType:'delete-post',
                        msg: Message.translate(myReq.CEMS.server.lang, CONST.MONGO.POST_DELETED),
                        token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
                    });
                })
                .catch(function(result){
                    deferred.reject({
                        msgType:'delete-post',
                        errorMsg: Message.translate(myReq.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR),
                        token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
                    });
                });
            return deferred.promise;
        },
        __parseUserInfo: function(infos){
            var deferred = Q.defer(),
                post = infos.result && infos.result[0],
                isAdmin = Utils.keyInObject('CEMS.jwt.role', myReq) === CONST.USER.ROLE.ADMIN,
                ownArticle = Utils.keyInObject('CEMS.jwt.validateDecodedToken.id', myReq) === Utils.keyInObject('userId._id', post).toString();
            if(isAdmin || ownArticle){
                deferred.resolve(infos.post_id);
            }else{
                deferred.reject();
            }
            return deferred.promise;
        },
        __findBy: function(post_id){
            var deferred = Q.defer();
            Post.findBy({_id:post_id})
                .then(function(result){
                    deferred.resolve({result:result, post_id:post_id});
                })
                .catch(function(reason){
                    deferred.reject({
                        msgType:'delete-post',
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
            .then(internal.__findBy)
            .then(internal.__parseUserInfo)
            .then(internal.__deletePost)
            .then(internal.__success)
            .fail(internal.__error)
            .done();
        }
    };

    return internal;
};