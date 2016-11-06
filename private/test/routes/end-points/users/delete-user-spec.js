'use strict'

var chai = require('chai'),
    Q = require('q'),
    nodeMocksHTTP = require('node-mocks-http'),
    deleteUser = require('../../../../routes/end-points/users/delete-user'),
    CONST = require('../../../../config/constant'),
    Message = require('../../../../message/message'),
    Utils = require('../../../../utils/utils'),
    reqData = require('../../../datas/req.json'),
    expect = chai.expect;

describe('Delete-User end-point', function(){

    var req, res, deleteU;
    var admin = {
        email: 'admin@admin.com',
        firstname: 'John',
        lastname: 'Doe',
        role: CONST.USER.ROLE.ADMIN,
        active: true,
        date: new Date()
    };
    beforeEach(function(){
        req = nodeMocksHTTP.createRequest(reqData);
        req.CEMS.userInput = {
            user_id: '581073265353950b4c99ec56'
        };
        res = nodeMocksHTTP.createResponse();
        deleteU = deleteUser();
    });

    it('should delete a user and reaffect his/her posts to admin', function(done){
        deleteU.__deleteUser = function(user_id){
            var deferred = Q.defer();
            deferred.resolve(user_id);
            return deferred.promise;
        };
        deleteU.__findAdmin = function(user_id){
            var deferred = Q.defer();
            deferred.resolve({admin:admin, user_id:user_id});
            return deferred.promise;
        };
        deleteU.__swapPostsToAdmin = function(param){
            var deferred = Q.defer();
            deferred.resolve({
                data: [{
                    email: param.admin.email,
                    firstname: param.admin.firstname,
                    lastname: param.admin.lastname,
                    role: param.admin.role,
                    active: param.admin.active,
                    date: param.admin.date,
                }],
                msgType:'delete-user',
                msg: Message.translate(req.CEMS.server.lang, CONST.MONGO.USER_DELETED),
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        };
        deleteU.__success = function(param){
            expect(param.msg).to.equal(Message.translate(req.CEMS.server.lang, CONST.MONGO.USER_DELETED));
            expect(param.data[0].firstname).to.equal('John');
            expect(param.data[0].active).to.be.true;
            done();
        };
        deleteU.init(req, res);
    });

    it('should raise an error if a user try to delete his own account', function(done){
        req.CEMS.userInput.user_id = '580fb9266a14531fec19dd3e';
        deleteU.__error = function(){
            expect(arguments[0]).not.to.be.defined;
            done();
        };
        deleteU.init(req, res);
    });

    it('should raise an error if mongodb couldn\'t delete user', function(done){
        deleteU.__deleteUser = function(){
            var deferred = Q.defer();
            deferred.reject({
                msgType:'delete-user',
                errorMsg: Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR),
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        };
        deleteU.__error = function(param){
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR));
            done();
        };
        deleteU.init(req, res);
    });

    it('should raise an error if no admin were found', function(done){
        deleteU.__deleteUser = function(){
            var deferred = Q.defer();
            deferred.resolve();
            return deferred.promise;
        };
        deleteU.__findAdmin = function(){
            var deferred = Q.defer();
            deferred.reject();
            return deferred.promise;
        };
        deleteU.__error = function(param){
            expect(arguments[0]).not.to.be.defined;
            done();
        };
        deleteU.init(req, res);
    });

    it('should raise an error if mongodb couldn\'t swap articles to admin account', function(done){
        deleteU.__deleteUser = function(){
            var deferred = Q.defer();
            deferred.resolve();
            return deferred.promise;
        };
        deleteU.__findAdmin = function(){
            var deferred = Q.defer();
            deferred.resolve();
            return deferred.promise;
        };
        deleteU.__swapPostsToAdmin = function(param){
            var deferred = Q.defer();
            deferred.reject({
                msgType:'delete-user',
                errorMsg: Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR),
                token: (Utils.keyInObject('CEMS.jwt.validateToken', req))? req.CEMS.jwt.validateToken : ''
            });
            return deferred.promise;
        };
        deleteU.__error = function(param){
            expect(param.errorMsg).to.equal(Message.translate(req.CEMS.server.lang, CONST.COMMON.TECHNICAL_ERROR));
            done();
        };
        deleteU.init(req, res);
    });
});
