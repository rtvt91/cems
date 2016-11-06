'use strict'

var chai = require('chai'),
    Q = require('q'),
    nodeMocksHTTP = require('node-mocks-http'),
    PostUser = require('../../../../routes/end-points/users/post-user'),
    CONST = require('../../../../config/constant'),
    Message = require('../../../../message/message'),
    Utils = require('../../../../utils/utils'),
    reqData = require('../../../datas/req.json'),
    expect = chai.expect;

describe('PostUser end-point', function(){

    var req, res, postU;
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
        postU = PostUser();
    });

    it('should save the new user', function(done){
        postU.__saveUser = function(){
            var deferred = Q.defer();
            req.CEMS.userInput.active = true;
            req.CEMS.userInput.date = new Date();
            deferred.resolve({
                data: req.CEMS.userInput,
                msgType:'post-user',
                msg: Message.translate(req.CEMS.server.lang, CONST.USER.SUCCESS.AUTHENTICATION_GRANTED),
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        };
        postU.__success = function(param){
            expect(param.msg).to.equal(Message.translate(req.CEMS.server.lang, CONST.USER.SUCCESS.AUTHENTICATION_GRANTED));
            expect(param.token).to.equal(req.CEMS.jwt.validateToken);
            expect(param.data.active).to.be.true;
            done();
        };
        postU.init(req, res);
    });
    
    it('should raise an error if credentials contains no email', function(done){
        req.CEMS.userInput.email = '';
        postU.__error = function(param){
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.USER.ERROR.INVALID_EMAIL));
            done();
        };
        postU.init(req, res);
    });

    it('should raise an error if credentials contains no password', function(done){
        req.CEMS.userInput.password = '';
        postU.__error = function(param){
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.USER.ERROR.INVALID_PASSWORD));
            done();
        };
        postU.init(req, res);
    });

    it('should raise an error if credentials contains no password2', function(done){
        req.CEMS.userInput.password2 = '';
        postU.__error = function(param){
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.USER.ERROR.INVALID_PASSWORD));
            done();
        };
        postU.init(req, res);
    });

    it('should raise an error if credentials password and password2 are not the same string', function(done){
        req.CEMS.userInput.password1 = 'P@ssw0rd';
        req.CEMS.userInput.password2 = 'P@ssw0rd1';
        postU.__error = function(param){
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.USER.ERROR.INVALID_PASSWORD));
            done();
        };
        postU.init(req, res);
    });

    it('should raise an error if credentials contains no firstname', function(done){
        req.CEMS.userInput.firstname = '';
        postU.__error = function(param){
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.USER.ERROR.INVALID_FIRSTNAME));
            done();
        };
        postU.init(req, res);
    });

    it('should raise an error if credentials contains no lastname', function(done){
        req.CEMS.userInput.lastname = '';
        postU.__error = function(param){
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.USER.ERROR.INVALID_LASTNAME));
            done();
        };
        postU.init(req, res);
    });

    it('should raise an error if email already exists', function(done){
        postU.__saveUser = function(){
            var deferred = Q.defer();
            deferred.reject({
                msgType:'first-user',
                errorMsg: Message.translate(req.CEMS.server.lang, CONST.MONGO.EMAIL_ALREADY_EXIST),
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        };
        postU.__error = function(param){
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.MONGO.EMAIL_ALREADY_EXIST));
            done();
        };
        postU.init(req, res);
    });

    it('should raise an error if mongod couldn\'t save the user', function(done){
        postU.__saveUser = function(){
            var deferred = Q.defer();
            deferred.reject({
                msgType:'first-user',
                errorMsg: Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR),
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        };
        postU.__error = function(param){
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR));
            done();
        };
        postU.init(req, res);
    });
});