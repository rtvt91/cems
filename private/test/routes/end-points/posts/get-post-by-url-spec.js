'use strict'

var chai = require('chai'),
    Q = require('q'),
    nodeMocksHTTP = require('node-mocks-http'),
    GetPostByUrl = require('../../../../routes/end-points/posts/get-post-by-url'),
    CONST = require('../../../../config/constant'),
    Message = require('../../../../message/message'),
    Utils = require('../../../../utils/utils'),
    catData = require('../../../datas/categories.json'),
    onePost = require('../../../datas/one-post.json'),
    posts = require('../../../datas/posts.json'),
    reqData = require('../../../datas/req.json'),
    expect = chai.expect;

describe('Get Post by url end-point', function(){

    var res, req, getPost;
    beforeEach(function(){
        req = nodeMocksHTTP.createRequest(reqData);
        req.CEMS.articleInput.categoryName = 'cat1';
        req.CEMS.articleInput.url = 'my-first-post';
        res = nodeMocksHTTP.createResponse();
        getPost = GetPostByUrl();
    });

    it('should return a post by category name and url', function(done){
        getPost.__findCategoryByName = function(category_name){
            var deferred = Q.defer();
            deferred.resolve({result:[catData.data[1]], url:req.CEMS.articleInput.url});
            return deferred.promise;
        };
        getPost.__findPostByUrlAndCategory = function(param){
            var deferred = Q.defer();
            deferred.resolve({result:onePost.data, categoryId:param.categoryId});
            return deferred.promise;
        };
        getPost.__success = function(param){
            expect(param.data).to.be.defined;
            expect(param.data.url).to.equal('my-first-article');
            expect(param.data.creator.firstname).to.equal('John');
            expect(param.data.active).to.be.true;
            done();
        };
        getPost.init(req, res);
    });

    it('should create a post by category name and url', function(done){
        var data = posts.data[0];
        data.creator = {
            _id: posts.data[0].userId._id
        }
        getPost.__findCategoryByName = function(category_name){
            var deferred = Q.defer();
            deferred.resolve({result:[catData.data[1]], url:req.CEMS.articleInput.url});
            return deferred.promise;
        };
        getPost.__findPostByUrlAndCategory = function(param){
            var deferred = Q.defer();
            deferred.resolve({result:onePost.data, categoryId:param.categoryId});
            return deferred.promise;
        };
        getPost.__parsePostData = function(param){
            var deferred = Q.defer();
            deferred.resolve({
                data: data,
                msgType:'get-post-by-url',
                msg: Message.translate(req.CEMS.server.lang, CONST.POST.SUCCESS.POST_RECORDED),
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        };
        getPost.__success = function(param){
            expect(param.data.url).to.equal('my-first-article');
            expect(param.data.creator._id).to.equal(req.CEMS.jwt.validateDecodedToken.id);
            expect(param.data.active).to.be.true;
            expect(param.msg).to.equal(Message.translate(req.CEMS.server.lang, CONST.POST.SUCCESS.POST_RECORDED));
            delete data.creator;
            done();
        };
        getPost.init(req, res);
    });

    it('should raise an error if no categoryName or url were provided', function(done){
        var name = req.CEMS.articleInput.categoryName;
        req.CEMS.articleInput.categoryName = '';
        getPost.__error = function(param){
            expect(param.status).to.equal(404);
            req.CEMS.articleInput.categoryName = name;
            done();
        };
        getPost.init(req, res);
    });

    it('should raise an error if mongo couldn\'t retrieve the category', function(done){
        getPost.__findCategoryByName = function(param){
            var deferred = Q.defer();
            deferred.reject({status:404});
            return deferred.promise;
        };
        getPost.__error = function(param){
            expect(param.status).to.equal(404);
            done();
        };
        getPost.init(req, res);
    });

    it('should raise an error if category is inactive', function(done){
        getPost.__findCategoryByName = function(param){
            catData.data[1].active = false;
            var deferred = Q.defer();
            deferred.resolve({result:[catData.data[1]], url:req.CEMS.articleInput.url});
            return deferred.promise;
        };
        getPost.__error = function(param){
            expect(param.status).to.equal(404);
            done();
        };
        getPost.init(req, res);
    });

    it('should raise an error if no category was found', function(done){
        getPost.__findCategoryByName = function(param){
            var deferred = Q.defer();
            deferred.resolve({result:[], url:req.CEMS.articleInput.url});
            return deferred.promise;
        };
        getPost.__error = function(param){
            expect(param.status).to.equal(404);
            done();
        };
        getPost.init(req, res);
    });

    it('should raise an error if mongo couldn\'t retrieve a post', function(done){
        getPost.__findCategoryByName = function(param){
            var deferred = Q.defer();
            deferred.resolve({result:[], url:req.CEMS.articleInput.url});
            return deferred.promise;
        };
        getPost.__findPostByUrlAndCategory = function(param){
            var deferred = Q.defer();
            deferred.reject({status:404});
            return deferred.promise;
        };
        getPost.__error = function(param){
            expect(param.status).to.equal(404);
            done();
        };
        getPost.init(req, res);
    });

    it('should raise an error if article is not displayable', function(done){
        getPost.__findCategoryByName = function(param){
            var deferred = Q.defer();
            deferred.resolve({result:[], url:req.CEMS.articleInput.url});
            return deferred.promise;
        };
        getPost.__findPostByUrlAndCategory = function(param){
            var deferred = Q.defer();
            deferred.reject({status:404});
            return deferred.promise;
        };
        getPost.__returnDisplayablePost = function(){
            return undefined;
        };
        getPost.__error = function(param){
            expect(param.status).to.equal(404);
            done();
        };
        getPost.init(req, res);
    });

    it('should raise an error if mongo couldn\'t save the new article', function(){
        getPost.__findCategoryByName = function(category_name){
            var deferred = Q.defer();
            deferred.resolve({result:[catData.data[1]], url:req.CEMS.articleInput.url});
            return deferred.promise;
        };
        getPost.__findPostByUrlAndCategory = function(param){
            var deferred = Q.defer();
            deferred.resolve({result:onePost.data, categoryId:param.categoryId});
            return deferred.promise;
        };
        getPost.__parsePostData = function(param){
            var deferred = Q.defer();
            deferred.reject({
                msgType:'get-post-by-url',
                errorMsg: Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR),
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        };
        getPost.__error = function(param){
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR));
            done();
        };
        getPost.init(req, res);
    });
});