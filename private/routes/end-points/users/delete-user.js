'use strict'

var	Q = require('q'),
    User = require('../../../mongo-models/user'),
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
        __swapPostsToAdmin: function(param){
            var deferred = Q.defer();
            Post.update( {userId : {"$in":param.user_id}}, {userId:param.admin._id} , {multi: true} , function(err, docs){
                if(err){
                    deferred.reject({
                        msgType:'delete-user',
                        errorMsg: Message.translate(myReq.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR),
                        token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
                    });
                }else if(docs){
                    deferred.resolve({
                        msgType:'delete-user',
                        msg: Message.translate(myReq.CEMS.server.lang, CONST.MONGO.USER_DELETED),
                        token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
                    });
                }else{
                    deferred.reject({
                        msgType:'delete-user',
                        errorMsg: Message.translate(myReq.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR),
                        token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
                    });
                }
            });
            return deferred.promise;
        },
        __findAdmin: function(user_id){
            var deferred = Q.defer();
            User.findBy({role:CONST.USER.ROLE.ADMIN})
                .then(function(result){
                    var admin = result && result[0];
                    deferred.resolve({admin:admin, user_id:user_id});
                })
                .catch(function(reason){
                    deferred.reject();
                });
            return deferred.promise;
        },
        __deleteUser: function(user_id){
            var deferred = Q.defer();
            User.delete(user_id)
                .then(function(result){
                    deferred.resolve(user_id);
                })
                .catch(function(reason){
                    deferred.reject({
                        msgType:'delete-user',
                        errorMsg: Message.translate(myReq.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR),
                        token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
                    });
                });
            return deferred.promise;
        },
        __infoExists: function(){
            var deferred = Q.defer(),
                user_id = Utils.keyInObject('CEMS.userInput.user_id', myReq),
                id = Utils.keyInObject('CEMS.jwt.validateDecodedToken.id', myReq);
            if(user_id === id){
                deferred.reject();
            }else{
                deferred.resolve(user_id);
            }
            return deferred.promise;
        },
        init: function(req, res){
            myReq = req;
            myRes = res;

            Q
            .fcall(internal.__infoExists)
            .then(internal.__deleteUser)
            .then(internal.__findAdmin)
            .then(internal.__swapPostsToAdmin)
            .then(internal.__success)
            .fail(internal.__error)
            .done();
        }
    };

    return internal;
};