'use strict'

var chai = require('chai'),
    Q = require('q'),
    nodeMocksHTTP = require('node-mocks-http'),
    GetPostByUser = require('../../../../routes/end-points/posts/get-post-by-user'),
    CONST = require('../../../../config/constant'),
    Message = require('../../../../message/message'),
    Utils = require('../../../../utils/utils'),
    onePost = require('../../../datas/one-post.json'),
    reqData = require('../../../datas/req.json'),
    expect = chai.expect;

describe('Get Post by user name end-point', function(){

    var res, req, getPost;
    beforeEach(function(){
        req = nodeMocksHTTP.createRequest(reqData);
        req.CEMS.postInput.user_id = "580fb9266a14531fec19dd3e";
        res = nodeMocksHTTP.createResponse();
        getPost = GetPostByUser();
    });

    it('should return posts by user_id', function(done){
        getPost.__findPostByUserId = function(category_name){
            var deferred = Q.defer();
            deferred.resolve(onePost.data);
            return deferred.promise;
        };
        getPost.__success = function(param){
            expect(param.data[0].url).to.equal('my-first-article');
            expect(param.data[0].userId.firstname).to.equal('John');
            expect(param.data[0].userId.role).to.equal(CONST.USER.ROLE.ADMIN);
            expect(param.data[0].active).to.be.true;
            done();
        };
        getPost.init(req, res);
    });

    it('should raise an error if no user_id was provided', function(done){
        var user_id = req.CEMS.postInput.user_id;
        req.CEMS.postInput.user_id = "";
        getPost.__error = function(param){
            expect(param).not.to.be.defined;
            req.CEMS.postInput.user_id = user_id;
            done();
        };
        getPost.init(req, res);
    });

    it('should raise an error if mongo couldn\'t find posts', function(done){
        getPost.__findPostByUserId = function(category_name){
            var deferred = Q.defer();
            deferred.reject({
                msgType:'get-post-by-user',
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