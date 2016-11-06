'use strict'

var Q = require('q'),
    Post = require('../../../mongo-models/post'),
    Utils = require('../../../utils/utils'),
    CONST = require('../../../config/constant'),
    Message = require('../../../message/message'),
    toHTML = require('himalaya/translate').toHTML;

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
        __parsePostInfo: function(result){
            var deferred = Q.defer();
            if(result && result.length > 0){
                var list = [];
                for(var i=0; i<result.length; i+=1){
                    var obj = result[i];
                    obj.conflict = Utils.conflictInUrl({
                        _id: Utils.keyInObject('_id', obj),
                        catName: Utils.keyInObject('categoryId.name', obj),
                        url: Utils.keyInObject('url', obj), 
                        list: result
                    });

                    var h1s = Utils.findTagnameInJSON('h1', obj.content[0]),
                        h1 = '',
                        h2s = Utils.findTagnameInJSON('h2', obj.content[0]),
                        h2 = '';

                    if(h1s && h1s.length > 0){
                        h1 = (h1s[0] && h1s[0].simpleText)? h1s[0].content : toHTML(h1s[0].children);
                    }
                    if(h2s && h2s.length > 0){
                        h2 = (h2s[0] && h2s[0].simpleText)? h2s[0].content : toHTML(h2s[0].children);
                    }

                    list.push({
                        _id: obj._id,
                        date: obj.date,
                        userId: obj.userId,
                        categoryId: obj.categoryId,
                        url: obj.url,
                        title: obj.title,
                        active: obj.active,
                        h1: h1,
                        h2: h2,
                        conflict: obj.conflict
                    });
                }
            }
            deferred.resolve({
                data: (list)? list : result,
                token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        },
        __findBy: function(post_id){
            var deferred = Q.defer();
            Post.findBy({_id:post_id})
                .then(function(result){
                    deferred.resolve(result);
                })
                .catch(function(reason){
                    deferred.reject({
                        msgType:'get-posts',
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
            .then(internal.__parsePostInfo)
            .then(internal.__success)
            .fail(internal.__error)
            .done();
        }
    };

    return internal;
};