'use strict'

var chai = require('chai'),
    Q = require('q'),
    nodeMocksHTTP = require('node-mocks-http'),
    GetPostByCategory = require('../../../../routes/end-points/posts/get-post-by-category'),
    CONST = require('../../../../config/constant'),
    Message = require('../../../../message/message'),
    Utils = require('../../../../utils/utils'),
    catData = require('../../../datas/categories.json'),
    onePost = require('../../../datas/one-post.json'),
    reqData = require('../../../datas/req.json'),
    expect = chai.expect;

describe('Get Post by category name end-point', function(){

    var res, req, getPost;
    beforeEach(function(){
        req = nodeMocksHTTP.createRequest(reqData);
        req.CEMS.postInput.category_name = 'default';
        res = nodeMocksHTTP.createResponse();
        getPost = GetPostByCategory();
    });

    it('should return posts by category name', function(done){
        getPost.__findCategoryByName = function(category_name){
            var deferred = Q.defer();
            deferred.resolve(catData.data[0]._id);
            return deferred.promise;
        };
        getPost.__findPostByCategoryId = function(categoryId){
            var deferred = Q.defer();
            deferred.resolve(onePost.data);
            return deferred.promise;
        };
        getPost.__success = function(param){
            expect(param.data).to.be.defined;
            expect(param.data[0].h1).to.equal('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
            expect(param.data[0].h2).to.equal('Ut vehicula risus a sem vestibulum semper.  In commodo ex auctor neque euismod, non fringilla sapien fringilla.');
            expect(param.data[0]._id).to.equal('580fce78a25f5125f00405e1');
            done();
        };
        getPost.init(req, res);
    });

    it('should raise an error if no category_name was provided', function(done){
        var name = req.CEMS.postInput.category_name;
        req.CEMS.postInput.category_name = '';
        getPost.__error = function(param){
            expect(param).not.to.be.defined;
            req.CEMS.postInput.category_name = name;
            done();
        };
        getPost.init(req, res);
    });

    it('should raise an error if no category was found', function(done){
        getPost.__findCategoryByName = function(category_name){
            var deferred = Q.defer();
            deferred.reject({status:404});
            return deferred.promise;
        };
        getPost.__error = function(param){
            expect(param).to.be.defined;
            expect(param.status).to.equal(404);
            done();
        };
        getPost.init(req, res);
    });

    it('should raise an error if mongo couldn\'t retrieve posts', function(done){
        getPost.__findCategoryByName = function(category_name){
            var deferred = Q.defer();
            deferred.resolve(catData.data[0]._id);
            return deferred.promise;
        };
        getPost.__findPostByCategoryId = function(categoryId){
            var deferred = Q.defer();
            deferred.reject({
                msgType:'get-post-by-category',
                errorMsg: Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR),
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        };
        getPost.__error = function(param){
            expect(param).to.be.defined;
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR));
            done();
        };
        getPost.init(req, res);
    });
});