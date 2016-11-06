'use strict'

var chai = require('chai'),
    Q = require('q'),
    nodeMocksHTTP = require('node-mocks-http'),
    GetPosts = require('../../../../routes/end-points/posts/post-post'),
    CONST = require('../../../../config/constant'),
    Message = require('../../../../message/message'),
    Utils = require('../../../../utils/utils'),
    onePost = require('../../../datas/one-post.json'),
    reqData = require('../../../datas/req.json'),
    expect = chai.expect;

describe('Post a Post end-point', function(){

    var res, req, getPost;
    beforeEach(function(){
        req = nodeMocksHTTP.createRequest(reqData);
        res = nodeMocksHTTP.createResponse();
        req.CEMS.postInput.userId = '580fb9266a14531fec19dd3e';
        req.CEMS.postInput.categoryId = '58130daa0ba9a413547cce8b';
        req.CEMS.postInput.url = 'my-first-article';
        req.CEMS.postInput.title = 'my first Tarticle';
        req.CEMS.postInput.content = onePost.data[0].content;
        getPost = GetPosts();
    });

    it('should post an article', function(done){
        getPost.__savePost = function(post){
            var deferred = Q.defer();
            deferred.resolve({
                msgType:'post-post',
                msg: Message.translate(req.CEMS.server.lang, CONST.POST.SUCCESS.POST_RECORDED),
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        };
        getPost.__success = function(param){
            expect(param.msg).to.equal(Message.translate(req.CEMS.server.lang, CONST.POST.SUCCESS.POST_RECORDED));
            done();
        };
        getPost.init(req, res);
    });

    it('should raise an error if no userId was provided', function(done){
        var user_id = req.CEMS.postInput.userId;
        req.CEMS.postInput.userId = '';
        getPost.__error = function(param){
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.POST.ERROR.INVALID_USER_ID));
            req.CEMS.postInput.userId = user_id;
            done();
        }
        getPost.init(req, res);
    });

    it('should raise an error if no categoryId was provided', function(done){
        var categoryId = req.CEMS.postInput.categoryId;
        req.CEMS.postInput.categoryId = '';
        getPost.__error = function(param){
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.POST.ERROR.INVALID_CATEGORY_ID));
            req.CEMS.postInput.categoryId = categoryId;
            done();
        }
        getPost.init(req, res);
    });

    it('should raise an error if no url was provided', function(done){
        var url = req.CEMS.postInput.url
        req.CEMS.postInput.url = '';
        getPost.__error = function(param){
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.POST.ERROR.INVALID_URL));
            req.CEMS.postInput.url = url;
            done();
        }
        getPost.init(req, res);
    });

    it('should raise an error if no title was provided', function(done){
        var title = req.CEMS.postInput.title;
        req.CEMS.postInput.title = '';
        getPost.__error = function(param){
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.POST.ERROR.INVALID_TITLE));
            req.CEMS.postInput.title = title;
            done();
        }
        getPost.init(req, res);
    });

    it('should raise an error if no content was provided', function(done){
        var content = req.CEMS.postInput.content;
        req.CEMS.postInput.content = '';
        getPost.__error = function(param){
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.POST.ERROR.INVALID_CONTENT));
            req.CEMS.postInput.content = content;
            done();
        }
        getPost.init(req, res);
    });

    it('should raise an error if mong couldn\'t save the article', function(done){
        getPost.__savePost = function(post){
            var deferred = Q.defer();
            deferred.reject({
                msgType:'post-post',
                errorMsg: Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR),
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        };
        getPost.__error = function(param){
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR));
            done();
        }
        getPost.init(req, res);
    });
});