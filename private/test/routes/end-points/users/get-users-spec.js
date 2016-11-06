'use strict'

var chai = require('chai'),
    Q = require('q'),
    httpMock = require('node-mocks-http'),
    getUsers = require('../../../../routes/end-points/users/get-users'),
    CONST = require('../../../../config/constant'),
    Message = require('../../../../message/message'),
    Utils = require('../../../../utils/utils'),
    reqData = require('../../../datas/req.json'),
    expect = chai.expect;

describe('Get-Users end-point', function(){
    
    var req, res, getU;
    var data = [{
        email: 'admin@admin.com',
        firstname: 'John',
        lastname: 'Doe',
        active: true,
        role: CONST.USER.ROLE.ADMIN,
        date: new Date()
    }];
    beforeEach(function(){
        req = httpMock.createRequest(reqData);
        res = httpMock.createResponse();
        getU = getUsers();
    });

    it('should return all users', function(done){
        getU.__findAll = function(){
            var deferred = Q.defer();
            deferred.resolve({
                data:data,
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        };
        getU.__success = function(param){
            expect(param.data).to.be.defined;
            expect(param.data.length).to.equal(1);
            expect(param.data[0].email).to.equal('admin@admin.com');
            done();
        };
        getU.init(req, res);
    });

    it('should raise a technical error', function(done){
        getU.__findAll = function(){
            var deferred = Q.defer();
            deferred.reject({
                msgType:'get-users',
                errorMsg: Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR),
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        };
        getU.__error = function(param){
            expect(param).to.be.defined;
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR));
            done();
        };
        getU.init(req, res);
    });

});