'use strict'

var chai = require('chai'),
    sinon = require('sinon'),
    Q = require('q'),
    nodeMocksHTTP = require('node-mocks-http'),
    JWT = require('../../../utils/jwt'),
    Access = require('../../../routes/interceptors/access'),
    CONST = require('../../../config/constant'),
    expect = chai.expect;

require('sinon-as-promised');

describe('Access middleware', function(){

    var req,
        res,
        nextSpy;

    beforeEach(function(){
        req = nodeMocksHTTP.createRequest();
        res = nodeMocksHTTP.createResponse({
            eventEmitter: require('events').EventEmitter
        });
        nextSpy = sinon.spy();
    });

    describe('#xhrOnly method', function(){
        it('should validate xhr request only', function(){
            req.xhr = true;
            Access.xhrOnly(req, res, nextSpy);
            expect(nextSpy.calledOnce).to.be.true;
        });

        it('should raise a 401 error for none xhr request', function(){
            res.on('end', function(){
                expect(res._getStatus()).to.equal(401);
            });
        });
    });

    describe('#loggedOnly method', function(){
        
        var loggedOnly;
        beforeEach(function(){
            loggedOnly = Access.loggedOnly();
        });
        
        it('should validate jsonwebtoken, verify the user id and push jwt object to the CEMS namespace', function(done){
            req.CEMS = {
                server:{
                    token : JWT.createJWT({id:'562bbdb1a261ab0c10e2781a'})
                }
            };
            sinon.stub(loggedOnly, '__findUser', function(tokenObject){
                req.CEMS.jwt = tokenObject;
                return [{
                    role: CONST.USER.ROLE.ADMIN,
                    active: true
                }];
            });
            sinon.stub(loggedOnly, '__next', function(cems){
                expect(req.CEMS.jwt).to.be.defined;
                expect(req.CEMS.jwt.validateToken).to.be.defined;
                expect(req.CEMS.jwt.validateDecodedToken).to.be.defined;
                expect(req.CEMS.jwt.role).to.equal(CONST.USER.ROLE.ADMIN);
                done();
            });
            loggedOnly.init(req, res, nextSpy);
        });

        it('should raise an error with a bad jsonwebtoken', function(done){

            loggedOnly.__hasToken = function(){
                var deferred = Q.defer();
                deferred.reject({errorMsg: 401});
                return deferred.promise;
            };
            sinon.stub(loggedOnly, '__error', function(reason){
                expect(reason.errorMsg).to.equal(401);
                done();
            });
            loggedOnly.init(req, res, nextSpy);
        });

        it('should raise an error if no user exists', function(done){
            loggedOnly.__findUser = function(){
                var deferred = Q.defer();
                deferred.reject({errorMsg: 401});
                return deferred.promise;
            };
            var stub = sinon.stub(loggedOnly, '__error', function(reason){
                expect(reason.errorMsg).to.equal(401);
                done();
            });
            loggedOnly.init(req, res, nextSpy);
        });

        it('should raise an error if user is not active', function(done){
            loggedOnly.__isUserActive = function(){
                var deferred = Q.defer();
                deferred.reject({errorMsg: 401});
                return deferred.promise;
            };
            var stub = sinon.stub(loggedOnly, '__error', function(reason){
                expect(reason.errorMsg).to.equal(401);
                done();
            });
            loggedOnly.init(req, res, nextSpy);
        });

    });

    describe('#adminOnly method', function(){

        var adminOnly;
        beforeEach(function(){
            adminOnly = Access.adminOnly();
        });

        it('should leave access to admin', function(done){
            sinon.stub(adminOnly, '__hasToken', function(){
                return;
            });
            sinon.stub(adminOnly, '__findUser', function(){
                return [{
                    role: CONST.USER.ROLE.ADMIN,
                    active: true
                }];
            });
            sinon.stub(adminOnly, '__next', function(user){
                expect(user[0].role).to.equal(CONST.USER.ROLE.ADMIN);
                expect(user[0].active).to.be.true;
                done();
            });
            adminOnly.init(req, res, nextSpy);
        });

        it('should raise an error if user is not admin', function(done){
            adminOnly.__hasToken = function(){
                var deferred = Q.defer();
                deferred.reject({errorMsg: 401});
                return deferred.promise;
            };
            sinon.stub(adminOnly, '__error', function(reason){
                expect(reason.errorMsg).to.equal(401);
                done();
            });
            adminOnly.init(req, res, nextSpy);
        });
    });

});