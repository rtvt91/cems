'use strict'

var chai = require('chai'),
    Q = require('q'),
    nodeMocksHTTP = require('node-mocks-http'),
    ArticleExists = require('../../../../routes/end-points/actions/article-exists'),
    CONST = require('../../../../config/constant'),
    Message = require('../../../../message/message'),
    Utils = require('../../../../utils/utils'),
    reqData = require('../../../datas/req.json'),
    expect = chai.expect;

describe('#ArticleExists end-point', function(){

    var req, res, artEx;

    beforeEach(function(){
        req = nodeMocksHTTP.createRequest(reqData);
        req.CEMS.postInput.category = 'default';
        req.CEMS.postInput.article = 'my-new-article';
        res = nodeMocksHTTP.createResponse();
        artEx = ArticleExists();
    });

    it('should return true if the article exists for this category', function(done){
        artEx.__findPost = function(param){
            var deferred = Q.defer();
            deferred.resolve({
                exists: true,
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        };
        artEx.__send = function(param){
            expect(param.exists).to.be.true;
            done();
        };
        artEx.init(req, res);
    });

    it('should return true if the article didn\'t exist for this category', function(done){
        artEx.__findPost = function(param){
            var deferred = Q.defer();
            deferred.resolve({
                exists: false,
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        };
        artEx.__send = function(param){
            expect(param.exists).to.be.false;
            done();
        };
        artEx.init(req, res);
    });

    it('should raise an error if mongo couldn\'t find any article', function(done){
        artEx.__findPost = function(param){
            var deferred = Q.defer();
            deferred.reject({
                 msgType:'article-exists',
                errorMsg: Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR),
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        };
        artEx.__error = function(param){
            expect(param).to.be.defined;
            done();
        };
        artEx.init(req, res);
    });

    it('should raise an error if no category || article are given', function(done){
        req.CEMS.postInput.category = '';
        req.CEMS.postInput.article = 'my-new-article';
        artEx.__error = function(param){
            expect(param).not.to.be.defined;
            done();
        };
        artEx.init(req, res);
    });
});
