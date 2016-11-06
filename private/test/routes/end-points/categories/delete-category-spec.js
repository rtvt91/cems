'use strict'

var chai = require('chai'),
    Q = require('q'),
    nodeMocksHTTP = require('node-mocks-http'),
    DeleteCategory = require('../../../../routes/end-points/categories/delete-category'),
    CONST = require('../../../../config/constant'),
    Message = require('../../../../message/message'),
    Utils = require('../../../../utils/utils'),
    reqData = require('../../../datas/req.json'),
    expect = chai.expect;

describe('Delete Category', function(){

    var req, res, deleteCat;
    beforeEach(function(){
        req = nodeMocksHTTP.createRequest(reqData);
        req.CEMS.categoryInput.category_id = '55545454545';
        res = nodeMocksHTTP.createResponse();
        deleteCat = DeleteCategory();
    });

    it('should delete a category', function(done){

        deleteCat.__findCategory = function(){
            var deferred = Q.defer();
            deferred.resolve();
            return deferred.promise;
        };

        deleteCat.__deleteCategory = function(category_id){
            var deferred = Q.defer();
            deferred.resolve();
            return deferred.promise;
        };

        deleteCat.__findDefaultCategory = function(){
            var deferred = Q.defer();
            deferred.resolve();
            return deferred.promise;
        };

        deleteCat.__updatePosts = function(){
            var deferred = Q.defer();
            deferred.resolve({
                msgType:'delete-category',
                msg: Message.translate(req.CEMS.server.lang, CONST.MONGO.POST_DELETED),
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        };

        deleteCat.__success = function(param){
            expect(param.msg).to.equal(Message.translate(req.CEMS.server.lang, CONST.MONGO.POST_DELETED));
            done();
        };

        deleteCat.init(req, res);
    });

    it('should raise an error if no category_id were found in CEMS object', function(done){
        req.CEMS.categoryInput.category_id = '';
        deleteCat.__error = function(param){
            expect(param).not.to.be.defined;
            done();
        };

        deleteCat.init(req, res);
    });

    it('should raise an error if category were found or if current category is defaultCat', function(done){
        deleteCat.__findCategory = function(){
            var deferred = Q.defer();
            deferred.reject();
            return deferred.promise;
        };
        deleteCat.__error = function(param){
            expect(param).not.to.be.defined;
            done();
        };

        deleteCat.init(req, res);
    });

    it('should raise an error if mongo couldn\'t delete it', function(done){
        deleteCat.__findCategory = function(){
            var deferred = Q.defer();
            deferred.resolve();
            return deferred.promise;
        };
        deleteCat.__deleteCategory = function(){
            var deferred = Q.defer();
            deferred.reject({
                msgType:'delete-category',
                errorMsg: Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR),
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        };
        deleteCat.__error = function(param){
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR));
            done();
        };

        deleteCat.init(req, res);
    });

    it('should raise an error if mongo couldn\'t find default category', function(done){
        deleteCat.__findCategory = function(){
            var deferred = Q.defer();
            deferred.resolve();
            return deferred.promise;
        };
        deleteCat.__deleteCategory = function(){
            var deferred = Q.defer();
            deferred.resolve();
            return deferred.promise;
        };
        deleteCat.__findDefaultCategory = function(){
            var deferred = Q.defer();
            deferred.reject({
                msgType:'delete-category',
                errorMsg: Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR),
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        };
        deleteCat.__error = function(param){
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR));
            done();
        };

        deleteCat.init(req, res);
    });

    it('should raise an error if mongo couldn\'t update article', function(done){
        deleteCat.__findCategory = function(){
            var deferred = Q.defer();
            deferred.resolve();
            return deferred.promise;
        };
        deleteCat.__deleteCategory = function(){
            var deferred = Q.defer();
            deferred.resolve();
            return deferred.promise;
        };
        deleteCat.__findDefaultCategory = function(){
            var deferred = Q.defer();
            deferred.resolve();
            return deferred.promise;
        };
        deleteCat.__updatePosts = function(){
            var deferred = Q.defer();
            deferred.reject({
                msgType:'delete-category',
                errorMsg: Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR),
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        };
        deleteCat.__error = function(param){
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR));
            done();
        };

        deleteCat.init(req, res);
    });

});