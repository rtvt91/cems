'use strict'

var chai = require('chai'),
    Q = require('q'),
    nodeMocksHTTP = require('node-mocks-http'),
    GetCategory = require('../../../../routes/end-points/categories/get-category'),
    CONST = require('../../../../config/constant'),
    Message = require('../../../../message/message'),
    Utils = require('../../../../utils/utils'),
    reqData = require('../../../datas/req.json'),
    categoriesData = require('../../../datas/categories.json'),
    expect = chai.expect;

describe('Get Category', function(){

    var req, res, getCat;
    beforeEach(function(){
        req = nodeMocksHTTP.createRequest(reqData);
        req.CEMS.categoryInput.category_id = '580fb9266a14531fec19dd3f';
        res = nodeMocksHTTP.createResponse();
        getCat = GetCategory();
    });

    it('should retrieve all categories', function(done){
        getCat.__findBy = function(){
            var deferred = Q.defer();
            deferred.resolve({
                data: categoriesData.data[0],
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        };

        getCat.__success = function(param){
            expect(param.data.defaultCat).to.be.true;
            expect(param.data.defaultCat).to.be.true;
            done();
        };

        getCat.init(req, res);
    });

    it('should retrieve all categories', function(done){
        getCat.__findBy = function(){
            var deferred = Q.defer();
            deferred.reject({
                msgType:'get-category',
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