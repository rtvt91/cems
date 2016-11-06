'use strict'

var path = require('path'),
    fs = require('fs'),
    Q = require('q'),
    himalaya = require('himalaya'),
    Category = require('../../../mongo-models/category'),
    Post = require('../../../mongo-models/post'),
    Utils = require('../../../utils/utils'),
    CONST = require('../../../config/constant'),
    CONFIG = require('../../../config/config'),
    Message = require('../../../message/message');


module.exports = function(){

    var myReq,
        myRes,
        categories = [
            {date: new Date(), active: true, name: CONFIG.DEFAULT_CATEGORY_NAME, defaultCat: true},
            {date: new Date(), active: true, name: CONFIG.FIRST_CATEGORY_NAME, defaultCat: false},
            {date: new Date(), active: true, name: CONFIG.SECOOND_CATEGORY_NAME, defaultCat: false}
        ],
        articlesUrl = CONFIG.DEFAULT_ARTICLES_URL,
        url = path.join(__dirname, '../../html/default-template.htm'),
        newHtml = fs.readFileSync(url),
        json = himalaya.parse(newHtml);

    var internal = {
        __error: function(param){
            myRes.json(param);
        },
        __success: function(param){
            myRes.json(param);
        },
        __buildPosts: function(docs){
            var deferred = Q.defer(),
                i = 0,
                total = articlesUrl.length,
                articles = [],
                userId = Utils.keyInObject('CEMS.jwt.validateDecodedToken.id', myReq);
            for(i; i<total; i+=1){
                var catId = docs[i+1]._id,
                    title = articlesUrl[i].split('-').join(' '),
                    article = {
                        date: new Date(),
                        active: true,
                        userId: userId,
                        categoryId: catId,
                        url: articlesUrl[i],
                        title: title,
                        content: [json]
                    };
                articles.push(article);
            }
            Post.insertMany(articles, function(error, docs){
                if(error){
                    deferred.reject({
                        msgType:'default-mongo-data',
                        errorMsg: Message.translate(myReq.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR)
                    });
                }else if(docs && docs.length > 0){
                    deferred.resolve({
                        msgType:'default-mongo-data',
                        msg: Message.translate(myReq.CEMS.server.lang, CONST.USER.SUCCESS.AUTHENTICATION_GRANTED),
                        token: (Utils.keyInObject('CEMS.jwt.validateToken', myReq))? myReq.CEMS.jwt.validateToken : ''
                    });
                }else{
                    deferred.reject({
                        msgType:'default-mongo-data',
                        errorMsg: Message.translate(myReq.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR)
                    });
                }
            });
            return deferred.promise;
        },
        __buildCategories: function(){
            var deferred = Q.defer();
            Category.insertMany(categories, function(error, docs){
                if(error){
                    deferred.reject({
                        msgType:'default-mongo-data',
                        errorMsg: Message.translate(myReq.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR)
                    });
                }else if(docs && docs.length > 0){
                    deferred.resolve(docs);
                }else{
                    deferred.reject({
                        msgType:'default-mongo-data',
                        errorMsg: Message.translate(myReq.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR)
                    });
                }
            });
            return deferred.promise;
        },
        init: function(req, res){
            myReq = req;
            myRes = res;

            Q
            .fcall(internal.__buildCategories)
            .then(internal.__buildPosts)
            .then(internal.__success)
            .fail(internal.__error)
            .done()
        }
    };

    return internal;

};