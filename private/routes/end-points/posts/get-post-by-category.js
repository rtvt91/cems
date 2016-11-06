'use strict'

var Q = require('q'),
    Post = require('../../../mongo-models/post'),
    CONFIG = require('../../../config/config'),
    CONST = require('../../../config/constant'),
    Category = require('../../../mongo-models/category'),
    Post = require('../../../mongo-models/post'),
    Utils = require('../../../utils/utils'),
    Message = require('../../../message/message'),
    toHTML = require('himalaya/translate').toHTML;

module.exports = function(req, res){

    var myReq, myRes;
    var internal = {
        __error: function(param){
            if(param && param.status === 404){
                myRes.status(404).end();
            }else if(param){
                myRes.json(param);
            }else{
                myRes.status(401).end();
            }
        },
        __success: function(param){
            myRes.json(param);
        },
        __parsePostData: function(result){
            var deferred = Q.defer(),
                list = [];
            if(result && result.length > 0){
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
                        h2 = '',
                        divs = Utils.findTagnameInJSON('div', obj.content[0]),
                        div = '';
                    if(h1s && h1s.length > 0){
                        h1 = (h1s[0] && h1s[0].simpleText)? h1s[0].content : toHTML(h1s[0].children);
                    }
                    if(h2s && h2s.length > 0){
                        h2 = (h2s[0] && h2s[0].simpleText)? h2s[0].content : toHTML(h2s[0].children);
                    }
                    if(divs && divs.length > 0){
                        div = (divs[0] && divs[0].simpleText)? divs[0].content : toHTML(divs[0].children);
                    }

                    if(!obj.conflict && obj.active){
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
                            div: div
                        });
                    }
                }
            }
            deferred.resolve({
                data: list,
                token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        },
        __findPostByCategoryId: function(categoryId){
            var deferred = Q.defer();
            Post.findBy({categoryId: categoryId})
                .then(function(result){
                    deferred.resolve(result);
                })
                .catch(function(reason){
                    deferred.reject({
                        msgType:'get-post-by-category',
                        errorMsg: Message.translate(myReq.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR),
                        token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
                    })
                });
            return deferred.promise;
        },
        __findCategoryByName: function(category_name){
            var deferred = Q.defer();
            Category.findBy({name:category_name})
                    .then(function(result){
                        if(result && result.length > 0){
                            var categoryId = Utils.keyInObject('_id', result[0]);
                            deferred.resolve(categoryId);
                        }else{
                            deferred.reject({status:404});
                        }
                    })
                    .catch(function(reason){
                        deferred.reject({status:404});
                    });
            return deferred.promise;
        },
        __infoExists: function(){
            var deferred = Q.defer(),
                category_name = Utils.keyInObject('CEMS.postInput.category_name', myReq);
            if(category_name){
                deferred.resolve(category_name);
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
            .then(internal.__findCategoryByName)
            .then(internal.__findPostByCategoryId)
            .then(internal.__parsePostData)
            .then(internal.__success)
            .fail(internal.__error)
            .done();
        }
    };

    return internal;
};