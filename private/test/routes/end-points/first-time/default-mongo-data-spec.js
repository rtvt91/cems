'use strict'

var chai = require('chai'),
    Q = require('q'),
    nodeMocksHTTP = require('node-mocks-http'),
    DefaultMongoData = require('../../../../routes/end-points/first-time/default-mongo-data'),
    CONST = require('../../../../config/constant'),
    Message = require('../../../../message/message'),
    Utils = require('../../../../utils/utils'),
    reqData = require('../../../datas/req.json'),
    categoriesData = require('../../../datas/categories.json'),
    expect = chai.expect;

describe('Default mongo data', function(){

    var req, res, defMongDat;
    var categories = categoriesData.data;

    beforeEach(function(){
        req = nodeMocksHTTP.createRequest(reqData);
        res = nodeMocksHTTP.createResponse();
        defMongDat = DefaultMongoData();
    });

    it('should populate mongo CEMS database with default data', function(done){
        defMongDat.__buildCategories = function(){
            var deferred = Q.defer();
            deferred.resolve(categories);
            return deferred.promise;
        };
        defMongDat.__buildPosts = function(){
            var deferred = Q.defer();
            deferred.resolve({
                msgType:'default-mongo-data',
                msg: Message.translate(req.CEMS.server.lang, CONST.USER.SUCCESS.AUTHENTICATION_GRANTED),
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        };
        defMongDat.__success = function(param){
            expect(param.msgType).to.equal('default-mongo-data');
            expect(param.msg).to.equal(Message.translate(req.CEMS.server.lang, CONST.USER.SUCCESS.AUTHENTICATION_GRANTED));
            done();
        };
        defMongDat.init(req, res);
    });

    it('should raise an error if mongodb could not save categories', function(done){
        defMongDat.__buildCategories = function(){
            var deferred = Q.defer();
            deferred.reject({
                msgType:'default-mongo-data',
                errorMsg: Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR)
            });
            return deferred.promise;
        };
        defMongDat.__error = function(param){
            expect(param.msgType).to.equal('default-mongo-data');
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR));
            done();
        };
        defMongDat.init(req, res);
    });

    it('should raise an error if mongodb could not save posts', function(done){
        defMongDat.__buildCategories = function(){
            var deferred = Q.defer();
            deferred.resolve(categories);
            return deferred.promise;
        };
        defMongDat.__buildPosts = function(){
            var deferred = Q.defer();
            deferred.reject({
                msgType:'default-mongo-data',
                errorMsg: Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR)
            });
            return deferred.promise;
        };
        defMongDat.__error = function(param){
            expect(param.msgType).to.equal('default-mongo-data');
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR));
            done();
        };
        defMongDat.init(req, res);
    });
});