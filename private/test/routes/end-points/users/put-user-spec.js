'use strict'

var chai = require('chai'),
    Q = require('q'),
    bcrypt= require('bcryptjs'),
    nodeMocksHTTP = require('node-mocks-http'),
    PutUser = require('../../../../routes/end-points/users/put-user'),
    CONST = require('../../../../config/constant'),
    Message = require('../../../../message/message'),
    Utils = require('../../../../utils/utils'),
    reqData = require('../../../datas/req.json'),
    expect = chai.expect;

describe('Put-User end-point', function(){
    
    var req, res, putU;
    var data = {
        user_id: '580fb9266a14531fec19dd3e',
        email: 'admin@admin.com',
        firstname: 'John',
        lastname: 'Doe',
        password: bcrypt.hashSync('P@ssw0rd', bcrypt.genSaltSync(10)),
        role: CONST.USER.ROLE.WRITER,
        date: new Date(),
        active: true
    };

    beforeEach(function(){
        req = nodeMocksHTTP.createRequest(reqData);
        req.CEMS.userInput = {
            user_id: '580fb9266a14531fec19dd3e',
            email: 'admin@admin.com',
            firstname: 'John',
            lastname: 'Doe',
            password: 'P@ssw0rd',
            role: CONST.USER.ROLE.ADMIN,
            date: new Date(),
            active: false
        };
        res = nodeMocksHTTP.createResponse();
        putU = PutUser();
    });

    it('should update user info', function(done){
        putU.__findUser = function(){
            var deferred = Q.defer();
            deferred.resolve(data);
            return deferred.promise;
        };
        putU.__updateUser = function(){
            var deferred = Q.defer();
            deferred.resolve({
                data: [{
                    email: data.email,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    role: data.role,
                    active: data.active,
                    date: data.date,
                }],
                msgType:'put-user',
                msg: Message.translate(req.CEMS.server.lang, CONST.MONGO.USER_UPDATED),
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        };
        putU.__success = function(param){
            expect(param.data.length).to.equal(1);
            expect(param.data[0].email).to.equal(data.email);
            expect(param.data[0].role).to.equal(data.role);
            expect(param.msg).to.equal(Message.translate(req.CEMS.server.lang, CONST.MONGO.USER_UPDATED));
            done();
        }
        putU.init(req, res);
    });

    it('should raise an error if no jwt was sent', function(done){
        var jwt = req.CEMS.jwt;
        req.CEMS.jwt = undefined;
        putU.__error = function(param){
            expect(param).not.to.be.defined;
            req.CEMS.jwt = jwt;
            done();
        };
        putU.init(req, res);
    });

    it('should raise an error if mongodb couldn\'t find user', function(done){
        putU.__findUser = function(){
            var deferred = Q.defer();
            deferred.reject({
                msgType:'put-user',
                errorMsg: Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR),
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        };
        putU.__error = function(param){
            expect(param).to.be.defined;
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR));
            done();
        };
        putU.init(req, res);
    });

    it('should raise an error if newPassword and newPassword2 did not match', function(done){
        req.CEMS.userInput.password = 'P@ssw0rd';
        req.CEMS.userInput.newPassword = 'hell0m@n12';
        req.CEMS.userInput.newPassword2 = 'hell0m@n1';
        putU.__findUser = function(){
            var deferred = Q.defer();
            deferred.resolve(data);
            return deferred.promise;
        };
        putU.__error = function(param){
            expect(param).to.be.defined;
            expect(param.errorMsg).to.equal('You must enter a valid password.');
            done();
        };
        putU.init(req, res);
    });

    it('should raise an error if old entered password did not match the recorded one', function(done){
        req.CEMS.userInput.password = 'P@ssw0rd123';
        req.CEMS.userInput.newPassword = 'hell0m@n';
        req.CEMS.userInput.newPassword2 = 'hell0m@n';
        putU.__findUser = function(){
            var deferred = Q.defer();
            deferred.resolve(data);
            return deferred.promise;
        };
        putU.__error = function(param){
            expect(param).to.be.defined;
            expect(param.errorMsg).to.equal('You must enter a valid password.');
            done();
        };
        putU.init(req, res);
    });

    it('should raise an error if the old or the new password were not valid', function(done){
        req.CEMS.userInput.password = 'password';
        req.CEMS.userInput.newPassword = 'password1';
        req.CEMS.userInput.newPassword2 = 'password1';
        putU.__findUser = function(){
            var deferred = Q.defer();
            deferred.resolve(data);
            return deferred.promise;
        };
        putU.__error = function(param){
            expect(param).to.be.defined;
            expect(param.errorMsg).to.equal('You must enter a valid password.');
            done();
        };
        putU.init(req, res);
    });

    it('should raise an error if mongo couldn\'t update user', function(done){
        putU.__findUser = function(){
            var deferred = Q.defer();
            deferred.resolve(data);
            return deferred.promise;
        };
        putU.__updateUser = function(){
            var deferred = Q.defer();
            deferred.reject({
                msgType:'put-user',
                errorMsg: Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR),
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        };
        putU.__error = function(param){
            expect(param).to.be.defined;
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR));
            done();
        };
        putU.init(req, res);
    });
});