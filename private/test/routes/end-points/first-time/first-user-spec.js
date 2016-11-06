'use strict'

var chai = require('chai'),
    Q = require('q'),
    nodeMocksHTTP = require('node-mocks-http'),
    FirstUser = require('../../../../routes/end-points/first-time/first-user'),
    CONST = require('../../../../config/constant'),
    Message = require('../../../../message/message'),
    Utils = require('../../../../utils/utils'),
    reqData = require('../../../datas/req.json'),
    expect = chai.expect;

describe('FirstUser', function(){

    var req, res, next, firstU;
    beforeEach(function(){
        req = nodeMocksHTTP.createRequest(reqData);
        req.CEMS.userInput = {
            email: 'test@test.com',
            password: 'P@ssw0rd',
            password2: 'P@ssw0rd',
            firstname: 'John',
            lastname: 'Doe'
        };
        res = nodeMocksHTTP.createResponse();
        next = function(){};
        firstU = FirstUser();
    });

    it('should save the first user', function(done){
        firstU.__saveUser = function(){
            var deferred = Q.defer();
            req.CEMS.server.token = '5454646464';
            deferred.resolve(req.CEMS);
            return deferred.promise;
        };
        firstU.__next = function(cems){
            expect(cems.server.token).to.equal('5454646464');
            done();
        };
        firstU.init(req, res, next);
    });
    
    it('should raise an error if credentials contains no email', function(done){
        req.CEMS.userInput.email = '';
        firstU.__error = function(param){
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.USER.ERROR.INVALID_EMAIL));
            done();
        };
        firstU.init(req, res, next);
    });

    it('should raise an error if credentials contains no password', function(done){
        req.CEMS.userInput.password = '';
        firstU.__error = function(param){
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.USER.ERROR.INVALID_PASSWORD));
            done();
        };
        firstU.init(req, res, next);
    });

    it('should raise an error if credentials contains no password2', function(done){
        req.CEMS.userInput.password2 = '';
        firstU.__error = function(param){
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.USER.ERROR.INVALID_PASSWORD));
            done();
        };
        firstU.init(req, res, next);
    });

    it('should raise an error if password and password2 do not match', function(done){
        req.CEMS.userInput.password2 = 'hello@123';
        firstU.__error = function(param){
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.USER.ERROR.INVALID_PASSWORD));
            done();
        };
        firstU.init(req, res, next);
    });

    it('should raise an error if credentials contains no firstname', function(done){
        req.CEMS.userInput.firstname = '';
        firstU.__error = function(param){
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.USER.ERROR.INVALID_FIRSTNAME));
            done();
        };
        firstU.init(req, res, next);
    });

    it('should raise an error if credentials contains no lastname', function(done){
        req.CEMS.userInput.lastname = '';
        firstU.__error = function(param){
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.USER.ERROR.INVALID_LASTNAME));
            done();
        };
        firstU.init(req, res, next);
    });

    it('should raise an error if email already exists', function(done){
        firstU.__saveUser = function(){
            var deferred = Q.defer();
            deferred.reject({
                msgType:'first-user',
                errorMsg: Message.translate(req.CEMS.server.lang, CONST.MONGO.EMAIL_ALREADY_EXIST)
            });
            return deferred.promise;
        };
        firstU.__error = function(param){
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.MONGO.EMAIL_ALREADY_EXIST));
            done();
        };
        firstU.init(req, res, next);
    });

    it('should raise an error if mongod couldn\'t save the user', function(done){
        firstU.__saveUser = function(){
            var deferred = Q.defer();
            deferred.reject({
                msgType:'first-user',
                errorMsg: Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR)
            });
            return deferred.promise;
        };
        firstU.__error = function(param){
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR));
            done();
        };
        firstU.init(req, res, next);
    });
});