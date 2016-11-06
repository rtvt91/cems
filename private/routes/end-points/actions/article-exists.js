'use strict'

var Q = require('q'),
    Post = require('../../../mongo-models/post'),
    Utils = require('../../../utils/utils'),
    CONST = require('../../../config/constant'),
    Message = require('../../../message/message');

module.exports = function(){

    var myReq, myRes;
    var internal = {
        __error: function(param){
            myRes.status(401).end();
        },
        __send: function(param){
            myRes.json(param);
        },
        __findPost: function(param){
            var deferred = Q.defer();
            Post.findBy({url:param.article})
                .then(function(result){
                    var test = false,
                        name;
                    if(result && result.length > 0){
                        for(var i=0; i<result.length; i++){
                            name = Utils.keyInObject('categoryId.name', result[i]);
                            if(name && name === param.category){
                                test = true;
                            }
                        }
                    }
                    deferred.resolve({
                        exists: test,
                        token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : '',
                    });
                })
                .catch(function(reason){
                    deferred.resolve({
                        msgType:'article-exists',
                        errorMsg: Message.translate(myReq.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR),
                        token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
                    });
                });
            return deferred.promise;
        },
        __infoExists: function(){
            var deferred = Q.defer(),
                category = Utils.keyInObject('CEMS.postInput.category', myReq),
                article = Utils.keyInObject('CEMS.postInput.article', myReq);
            if(category && article){
                deferred.resolve({category:category, article:article});
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
            .then(internal.__findPost)
            .then(internal.__send)
            .fail(internal.__error)
            .done();
        }
    };

    return internal;

};