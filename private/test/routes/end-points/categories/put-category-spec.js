'use strict'

var chai = require('chai'),
    Q = require('q'),
    nodeMocksHTTP = require('node-mocks-http'),
    PutCategory = require('../../../../routes/end-points/categories/put-category'),
    CONST = require('../../../../config/constant'),
    Message = require('../../../../message/message'),
    Utils = require('../../../../utils/utils'),
    reqData = require('../../../datas/req.json'),
    expect = chai.expect;

describe('Put Category', function(){

    var req, res, putCat;
    var data = {
        "_id":"580fb9266a14531fec19dd3f",
        "date":"Tue Oct 25 2016 21:57:04 GMT+0200 (Paris, Madrid (heure d’été))",
        "name":"new-category",
        "defaultCat":true,
        "active":true
    };

    beforeEach(function(){
        req = nodeMocksHTTP.createRequest(reqData);
        req.CEMS.categoryInput.category_id = '580fb9266a14531fec19dd3f';
        res = nodeMocksHTTP.createResponse();
        putCat = PutCategory();
    });

    it('should update a category', function(done){
        putCat.__updateCategory = function(){
            var deferred = Q.defer();
            deferred.resolve({
                data: data,
                msgType:'put-category',
                msg: Message.translate(req.CEMS.server.lang, CONST.MONGO.CATEGORY_UPDATED),
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        };
        putCat.__success = function(param){
            expect(param.data.name).to.equal('new-category');
            expect(param.msg).to.equal(Message.translate(req.CEMS.server.lang, CONST.MONGO.CATEGORY_UPDATED));
            done();
        };

        putCat.init(req, res);
    });

    it('should raise an error if no category_id were found', function(done){
        var category_id = req.CEMS.categoryInput.category_id;
        req.CEMS.categoryInput.category_id = '';
        putCat.__error = function(param){
            expect(param).not.to.be.defined;
            req.CEMS.categoryInput.category_id = category_id;
            done();
        };

        putCat.init(req, res);
    });

    it('should raise an error if mongo couldn\'t update category', function(done){
        putCat.__updateCategory = function(){
            var deferred = Q.defer();
            deferred.reject({
                msgType:'put-category',
                errorMsg: Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR),
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        };
        putCat.__error = function(param){
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR));
            done();
        };

        putCat.init(req, res);
    });
});