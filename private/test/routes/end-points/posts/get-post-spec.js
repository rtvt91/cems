'use strict'

var chai = require('chai'),
    Q = require('q'),
    nodeMocksHTTP = require('node-mocks-http'),
    GetPost = require('../../../../routes/end-points/posts/get-post'),
    CONST = require('../../../../config/constant'),
    Message = require('../../../../message/message'),
    Utils = require('../../../../utils/utils'),
    posts = require('../../../datas/posts.json'),
    onePost = require('../../../datas/one-post.json'),
    reqData = require('../../../datas/req.json'),
    expect = chai.expect;

describe('Get Post end-point', function(){

    var res, req, getPost;
    beforeEach(function(){
        req = nodeMocksHTTP.createRequest(reqData);
        req.CEMS.postInput.post_id = "580fce78a25f5125f00405e1";
        res = nodeMocksHTTP.createResponse();
        getPost = GetPost();
    });

    it('should return a post', function(done){
        getPost.__findBy = function(post_id){
            var deferred = Q.defer();
            deferred.resolve(onePost.data);
            return deferred.promise;
        };
        getPost.__success = function(param){
            expect(param.data).to.be.defined;
            expect(param.data[0].h1).to.equal('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
            expect(param.data[0].h2).to.equal('Ut vehicula risus a sem vestibulum semper.  In commodo ex auctor neque euismod, non fringilla sapien fringilla.');
            expect(param.data[0].userId._id).to.equal(req.CEMS.jwt.validateDecodedToken.id);
            done();
        };
        getPost.init(req, res);
    });

    it('should return an error if no post_id was found', function(done){
        var post_id = req.CEMS.postInput.post_id;
        req.CEMS.postInput.post_id = '';
        getPost.__error = function(param){
            expect(param).not.to.be.defined;
            req.CEMS.postInput.post_id = post_id;
            done();
        };
        getPost.init(req, res);
    });

    it('should return an error if mongo couldn\'t find the article', function(done){
        getPost.__findBy = function(post_id){
            var deferred = Q.defer();
            deferred.reject({
                msgType:'get-posts',
                errorMsg: Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR),
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            })
            return deferred.promise;
        };
        getPost.__error = function(param){
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR));
            done();
        };
        getPost.init(req, res);
    });
});