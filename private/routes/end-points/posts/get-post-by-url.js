'use strict'

var Q = require('q'),
    Post = require('../../../mongo-models/post'),
    CONFIG = require('../../../config/config'),
    CONST = require('../../../config/constant'),
    Category = require('../../../mongo-models/category'),
    Utils = require('../../../utils/utils'),
    Message = require('../../../message/message'),
    himalaya = require('himalaya'),
    path = require('path'),
    fs = require('fs'),
    toHTML = require('himalaya/translate').toHTML;

module.exports = function(){

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
        __createNewPost: function(categoryId){
            var url = path.join(__dirname, '../../html/default-template.htm'),
                newHtml = fs.readFileSync(url),
                json = himalaya.parse(newHtml);

            var newPost = Post.create({
                userId: myReq.CEMS.jwt.validateDecodedToken.id,
                categoryId: categoryId,
                url: myReq.CEMS.articleInput.url,
                title: myReq.CEMS.articleInput.url.split(CONFIG.URL_SEPARATOR).join(' '),
                content: [json]
            });
            return {newPost:newPost, json:json};
        },
        __returnDisplayablePost: function(list){
            var isAdmin = Utils.keyInObject('CEMS.jwt.role', myReq) === CONST.USER.ROLE.ADMIN,
                ownArticle = Utils.keyInObject('CEMS.jwt.validateDecodedToken.id', myReq) === list.userId._id.toString(),
                isDisplayable = (list.active) || ownArticle || isAdmin,
                html = (list.content[0])? toHTML(list.content[0]) : '',
                configObject;
            if(isDisplayable){
                configObject = {
                    data: {
                        _id: list._id,
                        creator: {
                            _id: list.userId._id,
                            firstname: list.userId.firstname,
                            lastname: list.userId.lastname,
                            active: list.userId.active,
                            role: list.userId.role
                        },
                        title: list.title,
                        url: list.url,
                        content: html,
                        date: list.date,
                        active: list.active
                    },
                    token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
                };
            }
            return configObject;
        },
        __parsePostData: function(param){
            var deferred = Q.defer();
            var list = param.result && (param.result.length > 0) && param.result[0],
                postCategoryId = (list)? Utils.keyInObject('categoryId._id', list).toString() : undefined,
                isSameCategory = (postCategoryId === param.categoryId.toString());
            if(list && isSameCategory){
                var obj = internal.__returnDisplayablePost(list);
                if(obj !== undefined){
                    deferred.resolve(obj);
                }else{
                    deferred.reject({status:404});
                }
            }else{
                if(Utils.keyInObject('CEMS.jwt.validateDecodedToken.id', myReq) !== undefined){
                    var obj = internal.__createNewPost(param.categoryId),
                        post = obj.newPost,
                        json = obj.json;
                    post.record()
                        .then(function(result){
                            deferred.resolve({
                                data: {
                                    _id: result._id,
                                    creator: {
                                        _id: myReq.CEMS.jwt.validateDecodedToken.id
                                    },
                                    title: result.title,
                                    url: result.url,
                                    content: toHTML(json),
                                    date: result.date,
                                    newArticle: true,
                                    active: result.active
                                },
                                msgType:'get-post-by-url',
                                msg: Message.translate(myReq.CEMS.server.lang, CONST.POST.SUCCESS.POST_RECORDED),
                                token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
                            });
                        })
                        .catch(function(reason){
                            var errorMsg;
                            if(reason.code === 11000){
                                errorMsg = Message.translate(myReq.CEMS.server.lang, CONST.MONGO.URL_ALREADY_EXIST);
                            }else{
                                errorMsg = Message.translate(myReq.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR);
                            }
                            deferred.reject({
                                msgType:'get-post-by-url',
                                errorMsg: errorMsg,
                                token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
                            });
                        });
                }else{
                    deferred.reject({status:404});
                }
            }
            return deferred.promise;
        },
        __findPostByUrlAndCategory: function(param){
            var deferred = Q.defer();
            Post.findBy({url:param.url, categoryId: param.categoryId})
                .then(function(result){
                    deferred.resolve({result:result, categoryId:param.categoryId});
                })
                .catch(function(reason){
                    deferred.reject({status:404});
                });
            return deferred.promise;
        },
        __parseCategoryData: function(param){
            var deferred = Q.defer();
            if(param.result && param.result.length > 0){
                var category = param.result[0],
                    categoryId = Utils.keyInObject('_id', category),
                    categoryActive = Utils.keyInObject('active', category);
                if(categoryActive){
                    deferred.resolve({url:param.url, categoryId:categoryId});
                }else{
                    deferred.reject({status:404});
                }
            }else{
                deferred.reject({status:404});
            }
            return deferred.promise;
        },
        __findCategoryByName: function(param){
            var deferred = Q.defer();
            Category.findBy({name:param.categoryName})
                    .then(function(result){
                        deferred.resolve({result:result, url:param.url});
                    })
                    .catch(function(reason){
                        deferred.reject({status:404});
                    });
            return deferred.promise;
        },
        __infoExists: function(){
            var deferred = Q.defer(),
                categoryName = Utils.keyInObject('CEMS.articleInput.categoryName', myReq),
                url = Utils.keyInObject('CEMS.articleInput.url', myReq);
            if(categoryName && url){
                deferred.resolve({categoryName:categoryName, url:url});
            }else{
                deferred.reject({status:404});
            }
            return deferred.promise;
        },
        init: function(req, res){
            myReq = req;
            myRes = res;

            Q
            .fcall(internal.__infoExists)
            .then(internal.__findCategoryByName)
            .then(internal.__parseCategoryData)
            .then(internal.__findPostByUrlAndCategory)
            .then(internal.__parsePostData)
            .then(internal.__success)
            .fail(internal.__error)
            .done();
        }
    };

    return internal;
};