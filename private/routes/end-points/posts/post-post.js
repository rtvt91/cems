'use strict'

var	Q = require('q'),
    Post = require('../../../mongo-models/post'),
    JWT = require('../../../utils/jwt'),
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
        __savePost: function(post){
            var deferred = Q.defer();
            post.record()
                .then(function(result){
                    deferred.resolve({
                        msgType:'post-post',
                        msg: Message.translate(myReq.CEMS.server.lang, CONST.POST.SUCCESS.POST_RECORDED),
                        token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
                    });
                })
                .catch(function(reason){
                    var errorMsg;
                    if(result.code === 11000){
                        errorMsg = Message.translate(myReq.CEMS.server.lang, CONST.MONGO.URL_ALREADY_EXIST);
                    }else{
                        errorMsg = Message.translate(myReq.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR);
                    }
                    deferred.reject({
                        msgType:'post-post',
                        errorMsg: errorMsg,
                        token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
                    });
                });
            return deferred.promise;
        },
        __createPost: function(param){
            var deferred = Q.defer();
            var post = Post.create({
                userId: param.userId,
                categoryId: param.categoryId,
                url: param.url,
                title: param.title,
                content: param.content
            });
            deferred.resolve(post);
            return deferred.promise;
        },
        __infoExists: function(){
            var deferred = Q.defer(),
                userId = Utils.keyInObject('CEMS.postInput.userId', myReq),
                categoryId = Utils.keyInObject('CEMS.postInput.categoryId', myReq),
                url = Utils.keyInObject('CEMS.postInput.url', myReq),
                title = Utils.keyInObject('CEMS.postInput.title', myReq),
                content = Utils.keyInObject('CEMS.postInput.content', myReq);
            if(!userId){
                deferred.reject({
                    errorMsg:Message.translate(myReq.CEMS.server.lang, CONST.POST.ERROR.INVALID_USER_ID)
                });
            }else if(!categoryId){
                deferred.reject({
                    errorMsg:Message.translate(myReq.CEMS.server.lang, CONST.POST.ERROR.INVALID_CATEGORY_ID)
                });
            }else if(!url){
                deferred.reject({
                    errorMsg:Message.translate(myReq.CEMS.server.lang, CONST.POST.ERROR.INVALID_URL)
                });
            }else if(!title){
                deferred.reject({
                    errorMsg:Message.translate(myReq.CEMS.server.lang, CONST.POST.ERROR.INVALID_TITLE)
                });
            }else if(!content){
                deferred.reject({
                    errorMsg:Message.translate(myReq.CEMS.server.lang, CONST.POST.ERROR.INVALID_CONTENT)
                });
            }else{
                deferred.resolve({
                    userId:userId,
                    categoryId:categoryId,
                    url:url,
                    title:title,
                    content:content
                });
            }
            return deferred.promise;
        },
        init: function(req, res){
            myReq = req;
            myRes = res;

            Q
            .fcall(internal.__infoExists)
            .then(internal.__createPost)
            .then(internal.__savePost)
            .then(internal.__success)
            .fail(internal.__error)
            .done();
        }
    };

    return internal;
};