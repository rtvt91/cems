'use strict'

var chai = require('chai'),
    nodeMocksHTTP = require('node-mocks-http'),
    Q = require('q'),
    getUser = require('../../../../routes/end-points/users/get-user'),
    CONST = require('../../../../config/constant'),
    Message = require('../../../../message/message'),
    Utils = require('../../../../utils/utils'),
    reqData = require('../../../datas/req.json'),
    expect = chai.expect;

describe('Get-User end-point', function(){
    
    var req, res, data, getU;
    beforeEach(function(){
        data = {
            email: 'test@test.com',
            firstname: 'John',
            lastname: 'Doe',
            active: true,
            role: CONST.USER.ROLE.WRITER,
            date: new Date()
        };
        req = nodeMocksHTTP.createRequest(reqData);
        req.CEMS.userInput = {
            user_id: '580fb9266a14531fec19dd3e'
        };
        res = nodeMocksHTTP.createResponse();
        getU = getUser();
    });

    it('should return a user', function(done){
        getU.__findUser = function(){
            var deferred = Q.defer();
            deferred.resolve({
                data: data,
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        };
        getU.__success = function(param){
            expect(param.data).to.deep.equal(data);
            done()
        };
        getU.init(req, res);
    });

    it('should raise an error if there were no user_id in credentials', function(done){
        req.CEMS.userInput.user_id = '';
        getU.__error = function(param){
            expect(param).not.to.be.defined;
            done()
        };
        getU.init(req, res);
    });

    it('should raise an error if no user were found in the db', function(done){
        getU.__findUser = function(){
            var deferred = Q.defer();
            deferred.reject({
                msgType:'get-user',
                errorMsg: Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR),
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        };
        getU.__error = function(param){
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR));
            done()
        };
        getU.init(req, res);
    });
});