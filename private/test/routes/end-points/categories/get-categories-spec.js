'use strict'

var chai = require('chai'),
    Q = require('q'),
    nodeMocksHTTP = require('node-mocks-http'),
    GetCategories = require('../../../../routes/end-points/categories/get-categories'),
    CONST = require('../../../../config/constant'),
    Message = require('../../../../message/message'),
    Utils = require('../../../../utils/utils'),
    reqData = require('../../../datas/req.json'),
    categoriesData = require('../../../datas/categories.json'),
    expect = chai.expect;

describe('Get Categories', function(){

    var req, res, getCat;
    beforeEach(function(){
        req = nodeMocksHTTP.createRequest(reqData);
        res = nodeMocksHTTP.createResponse();
        getCat = GetCategories();
    });

    it('should retrieve all categories', function(done){
        getCat.__findAll = function(){
            var deferred = Q.defer();
            deferred.resolve({
                data: categoriesData.data,
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        };

        getCat.__success = function(param){
            expect(param.data.length).to.equal(3);
            expect(param.data[0].defaultCat).to.be.true;
            expect(param.data[1].defaultCat).to.be.false;
            done();
        };

        getCat.init(req, res);
    });

    it('should retrieve all categories', function(done){
        getCat.__findAll = function(){
            var deferred = Q.defer();
            deferred.reject({
                msgType:'get-categories',
                errorMsg: Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR),
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        };

        getCat.__error = function(param){
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR));
            done();
        };

        getCat.init(req, res);
    });

});