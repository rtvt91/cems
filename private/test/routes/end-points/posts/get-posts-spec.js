'use strict'

var chai = require('chai'),
    Q = require('q'),
    nodeMocksHTTP = require('node-mocks-http'),
    GetPosts = require('../../../../routes/end-points/posts/get-posts'),
    CONST = require('../../../../config/constant'),
    Message = require('../../../../message/message'),
    Utils = require('../../../../utils/utils'),
    onePost = require('../../../datas/one-post.json'),
    reqData = require('../../../datas/req.json'),
    expect = chai.expect;

describe('Get Posts end-point', function(){

    var res, req, getPost;
    beforeEach(function(){
        req = nodeMocksHTTP.createRequest(reqData);
        res = nodeMocksHTTP.createResponse();
        getPost = GetPosts();
    });

    it('should return posts', function(done){
        getPost.__findAllPosts = function(category_name){
            var deferred = Q.defer();
            deferred.resolve(onePost.data);
            return deferred.promise;
        };
        getPost.__success = function(param){
            expect(param.data.length).to.equal(1);
            expect(param.data[0].url).to.equal('my-first-article');
            expect(param.data[0].conflict).to.equal(false);
            done();
        };
        getPost.init(req, res);
    });

    it('should raise an error if mongo couldn\'t retrieve posts', function(done){
        getPost.__findAllPosts = function(category_name){
            var deferred = Q.defer();
            deferred.reject({
                msgType:'get-posts',
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
