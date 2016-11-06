'use strict'

var chai = require('chai'),
    Q = require('q'),
    nodeMocksHTTP = require('node-mocks-http'),
    PostCategory = require('../../../../routes/end-points/categories/post-category'),
    CONST = require('../../../../config/constant'),
    Message = require('../../../../message/message'),
    Utils = require('../../../../utils/utils'),
    reqData = require('../../../datas/req.json'),
    expect = chai.expect;

describe('Post Category', function(){

    var req, res, postCat;
    var data = {
        "_id":"580fb9266a14531fec19dd3f",
        "date":"Tue Oct 25 2016 21:57:04 GMT+0200 (Paris, Madrid (heure d’été))",
        "name":"new-category",
        "defaultCat":true,
        "active":true
    };

    beforeEach(function(){
        req = nodeMocksHTTP.createRequest(reqData);
        req.CEMS.categoryInput.name = 'new-category';
        res = nodeMocksHTTP.createResponse();
        postCat = PostCategory();
    });

    it('should save a new category', function(done){
        postCat.__saveCategory = function(){
            var deferred = Q.defer();
            deferred.resolve({
                data: data,
                msgType:'post-category',
                msg: Message.translate(req.CEMS.server.lang, CONST.CATEGORY.SUCCESS.CATEGORY_RECORDED),
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        };
        postCat.__success = function(param){
            expect(param.data.name).to.equal('new-category');
            expect(param.msg).to.equal(Message.translate(req.CEMS.server.lang, CONST.CATEGORY.SUCCESS.CATEGORY_RECORDED));
            done();
        };
        postCat.init(req, res);
    });

    it('should raise an error if no name were found in the CEMS namespace', function(done){
        req.CEMS.categoryInput.name = '';
        postCat.__error = function(param){
            expect(param).to.not.be.defined;
            done();
        };
        postCat.init(req, res);
    });

    it('should raise a 11000 error if category name already exist', function(done){
        postCat.__saveCategory = function(){
            var deferred = Q.defer();
            deferred.reject({
                msgType:'post-category',
                errorMsg: Message.translate(req.CEMS.server.lang, CONST.MONGO.CATEGORY_ALREADY_EXIST),
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        };
        postCat.__error = function(param){
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.MONGO.CATEGORY_ALREADY_EXIST));
            done();
        };
        postCat.init(req, res);
    });

    it('should raise an error if mongo couldn\'t save the category', function(done){
        postCat.__saveCategory = function(){
            var deferred = Q.defer();
            deferred.reject({
                msgType:'post-category',
                errorMsg: Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR),
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        };
        postCat.__error = function(param){
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR));
            done();
        };
        postCat.init(req, res);
    });

});