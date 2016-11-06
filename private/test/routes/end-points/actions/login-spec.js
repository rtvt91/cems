'use strict'

var chai = require('chai'),
    sinon = require('sinon'),
    Q = require('q'),
    bcrypt = require('bcryptjs'),
    httpMock = require('node-mocks-http'),
    login = require('../../../../routes/end-points/actions/login'),
    CONST = require('../../../../config/constant'),
    Message = require('../../../../message/message'),
    reqData = require('../../../datas/req.json'),
    expect = chai.expect;

describe('Login', function(){
    
    var req, res, data, log;

    beforeEach(function(){
        req = httpMock.createRequest(reqData);
        res = httpMock.createResponse();
        req.CEMS.userInput = {
            email: 'test@test.com',
            password: 'P@ssw0rd'
        };
        data = {
            _id: '507f1f77bcf86cd799439011',
            firstname: 'John',
            lastname: 'Doe',
            role: CONST.USER.ROLE.WRITER,
            date: new Date(),
            active: false,
            password: bcrypt.hashSync('P@ssw0rd', bcrypt.genSaltSync(10))
        };
        log = login();
    });

    it('should log valid credentials', function(done){
        log.__findUser = function(userInfo){
            var deferred = Q.defer();
            deferred.resolve({
                data:data,
                password: userInfo.password
            });
            return deferred.promise;
        };
        log.__success = function(param){
            expect(param.data.firstname).to.equal(data.firstname);
            expect(param.data.lastname).to.equal(data.lastname);
            expect(param.data.date).to.equal(data.date);
            expect(param.data.role).to.equal(data.role);
            expect(param.data.active).to.equal(data.active);
            done();
        };
        log.init(req, res);
    });

    it('should not log unvalid credentials', function(done){
        log.__infoExists = function(userInfo){
            var deferred = Q.defer();
            deferred.reject({
                msgType:'login',
                errorMsg: Message.translate(req.CEMS.server.lang, CONST.USER.ERROR.WRONG_EMAIL_AND_PASSWORD)
            });
            return deferred.promise;
        };
        log.__error = function(param){
            expect(param.msgType).to.equal('login');
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.USER.ERROR.WRONG_EMAIL_AND_PASSWORD));
            done();
        };
        log.init(req, res);
    });

    it('should not log user if no user were found', function(done){
        log.__findUser = function(userInfo){
            var deferred = Q.defer();
            deferred.reject({
                msgType:'login',
                errorMsg: Message.translate(req.CEMS.server.lang, CONST.USER.ERROR.WRONG_EMAIL)
            });
            return deferred.promise;
        };
        log.__error = function(param){
            expect(param.msgType).to.equal('login');
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.USER.ERROR.WRONG_EMAIL));
            done();
        };
        log.init(req, res);
    });

    it('should not log user if mongodb raise an error', function(done){
        log.__findUser = function(userInfo){
            var deferred = Q.defer();
            deferred.reject({
                msgType:'login',
                errorMsg: Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR)
            });
            return deferred.promise;
        };
        log.__error = function(param){
            expect(param.msgType).to.equal('login');
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR));
            done();
        };
        log.init(req, res);
    });

    it('should not log user if password do not match', function(done){
        log.__findUser = function(userInfo){
            var deferred = Q.defer();
            deferred.resolve({
                data:data,
                password: 'test'
            });
            return deferred.promise;
        };
        log.__error = function(param){
            expect(param.msgType).to.equal('login');
            expect(param.errorMsg).to.equal('You must enter a valid email and password.');
            done();
        };
        log.init(req, res);
    });
});