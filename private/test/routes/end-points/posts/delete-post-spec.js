'use strict'

var chai = require('chai'),
    Q = require('q'),
    nodeMocksHTTP = require('node-mocks-http'),
    DeletePost = require('../../../../routes/end-points/posts/delete-post'),
    CONST = require('../../../../config/constant'),
    Message = require('../../../../message/message'),
    Utils = require('../../../../utils/utils'),
    onePost = require('../../../datas/one-post.json'),
    posts = require('../../../datas/posts.json'),
    reqData = require('../../../datas/req.json'),
    expect = chai.expect;

describe('Delete Post end-point', function(){

    var res, req, delPost;
    beforeEach(function(){
        req = nodeMocksHTTP.createRequest(reqData);
        req.CEMS.postInput.post_id = '580fce78a25f5125f00405e1';
        res = nodeMocksHTTP.createResponse();
        delPost = DeletePost();
    });

    it('should delete a post', function(done){
        delPost.__findBy = function(post_id){
            var deferred = Q.defer();
            deferred.resolve({result:posts.data, post_id:post_id});
            return deferred.promise;
        };
        delPost.__deletePost = function(post_id){
            var deferred = Q.defer();
            deferred.resolve({
                msgType:'delete-post',
                msg: Message.translate(req.CEMS.server.lang, CONST.MONGO.POST_DELETED),
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        };
        delPost.__success = function(param){
            expect(param.msg).to.equal(Message.translate(req.CEMS.server.lang, CONST.MONGO.POST_DELETED))
            expect(param.token).to.equal(req.CEMS.jwt.validateToken);
            done();
        };
        delPost.init(req, res);
    });

    it('should raise an error if no post_id was found', function(done){
        var id = req.CEMS.postInput.post_id;
        req.CEMS.postInput.post_id = '';
        delPost.__error = function(param){
            expect(param).not.to.be.defined;
            req.CEMS.postInput.post_id = id;
            done();
        };
        delPost.init(req, res);
    });

    it('should raise an error if no post was found', function(done){
        delPost.__findBy = function(){
            var deferred = Q.defer();
            deferred.reject({
                msgType:'delete-post',
                    errorMsg: Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR),
                    token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
                });
            return deferred.promise;
        };
        delPost.__error = function(param){
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR));
            done();
        };
        delPost.init(req, res);
    });

    it('should raise an error if user didn\'t write the article or is not admin', function(done){
        var id = req.CEMS.jwt.validateDecodedToken.id,
            role = req.CEMS.jwt.role;
        req.CEMS.jwt.validateDecodedToken.id = 'ozjdozjdzd455z4d54zd4';
        req.CEMS.jwt.role = CONST.USER.ROLE.WRITER;
        delPost.__findBy = function(post_id){
            var deferred = Q.defer();
            deferred.resolve({result:posts.data, post_id:post_id});
            return deferred.promise;
        };
        delPost.__error = function(param){
            expect(param).not.to.be.defined;
            req.CEMS.jwt.validateDecodedToken.id = id;
            req.CEMS.jwt.role = role;
            done();
        };
        delPost.init(req, res);
    });

    it('should raise an error if mongo couldn\'t delete the article', function(done){
        delPost.__findBy = function(post_id){
            var deferred = Q.defer();
            deferred.resolve({result:posts.data, post_id:post_id});
            return deferred.promise;
        };
        delPost.__deletePost = function(post_id){
            var deferred = Q.defer();
            deferred.reject({
                msgType:'delete-post',
                errorMsg: Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR),
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        };
        delPost.__error = function(param){
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR));
            done();
        };
        delPost.init(req, res);
    });

});