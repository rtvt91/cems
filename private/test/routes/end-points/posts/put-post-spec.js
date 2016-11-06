'use strict'

var chai = require('chai'),
    Q = require('q'),
    nodeMocksHTTP = require('node-mocks-http'),
    PutPost = require('../../../../routes/end-points/posts/put-post'),
    CONST = require('../../../../config/constant'),
    Message = require('../../../../message/message'),
    Utils = require('../../../../utils/utils'),
    onePost = require('../../../datas/one-post.json'),
    posts = require('../../../datas/posts.json'),
    reqData = require('../../../datas/req.json'),
    expect = chai.expect;

describe('Put a Post end-point', function(){

    var res, req, putPost;
    beforeEach(function(){
        req = nodeMocksHTTP.createRequest(reqData);
        res = nodeMocksHTTP.createResponse();
        req.CEMS.postInput.post_id = '580fce78a25f5125f00405e1';
        req.CEMS.postInput.content = onePost.data[0].content;
        putPost = PutPost();
    });

    it('should update an article', function(done){
        putPost.__findPostById = function(post_id){
            var deferred = Q.defer();
            deferred.resolve({result:posts.data, post_id:post_id});
            return deferred.promise;
        };
        putPost.__updatePost = function(post_id){
            var deferred = Q.defer();
            deferred.resolve({
                msgType:'put-post',
                msg: Message.translate(req.CEMS.server.lang, CONST.MONGO.POST_UPDATED),
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        };
        putPost.__success = function(param){
            expect(param.msg).to.equal(Message.translate(req.CEMS.server.lang, CONST.MONGO.POST_UPDATED));
            done();
        };
        putPost.init(req, res);
    });

    it('should raise an error if post_id was not provided', function(done){
        var post_id = req.CEMS.postInput.post_id
        req.CEMS.postInput.post_id = '';
        putPost.__error = function(param){
            expect(param).not.to.be.defined;
            req.CEMS.postInput.post_id = post_id;
            done();
        };
        putPost.init(req, res);
    });

    it('should raise an error if mongo couldn\'t find the article', function(done){
        putPost.__findPostById = function(){
            var deferred = Q.defer();
            deferred.reject({
                msgType:'put-post',
                errorMsg: Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR),
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            })
            return deferred.promise;
        }
        putPost.__error = function(param){
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR));
            done();
        };
        putPost.init(req, res);
    });

    it('should raise an error if user doesn\'t have rights to update the article', function(done){
        var id = req.CEMS.jwt.validateDecodedToken.id,
            role = req.CEMS.jwt.role;
        req.CEMS.jwt.validateDecodedToken.id = 'badmongoid';
        req.CEMS.jwt.role = CONST.USER.ROLE.WRITER;
        putPost.__findPostById = function(post_id){
            var deferred = Q.defer();
            deferred.resolve({result:onePost.data, post_id:post_id});
            return deferred.promise;
        };
        putPost.__error = function(param){
            expect(param).not.to.be.defined;
            req.CEMS.jwt.validateDecodedToken.id = id;
            req.CEMS.jwt.role = role;
            done();
        };
        putPost.init(req, res);
    });

    it('should raise an error if mongo couldn\'t update the article', function(done){
        putPost.__findPostById = function(post_id){
            var deferred = Q.defer();
            deferred.resolve({result:onePost.data, post_id:post_id});
            return deferred.promise;
        };
        putPost.__updatePost = function(post_id){
            var deferred = Q.defer();
            deferred.reject({
                msgType:'put-post',
                errorMsg: Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR),
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        };
        putPost.__error = function(param){
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR));
            done();
        };
        putPost.init(req, res);
    });
});