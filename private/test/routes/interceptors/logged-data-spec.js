'use strict'

var chai = require('chai'),
    sinon = require('sinon'),
    Q = require('q'),
    nodeMocksHTTP = require('node-mocks-http'),
    loggedData = require('../../../routes/interceptors/logged-data'),
    CONST = require('../../../config/constant'),
    expect = chai.expect;

require('sinon-as-promised');

describe('LoggedData middleware', function(){

    var req,
        res,
        nextSpy,
        parse;

    beforeEach(function(){
        req = nodeMocksHTTP.createRequest();
        res = nodeMocksHTTP.createResponse({
            eventEmitter: require('events').EventEmitter
        });
        nextSpy = sinon.spy();
        parse = loggedData.parse()
    });

    describe('#parse', function(){
        it('should fill the CEMS.jwt object with jsonwebtoken info', function(done){
            req.CEMS = {};
            parse.__hasToken = function(){
                var deferred = Q.defer();
                deferred.resolve();
                return deferred.promise;
            };
            parse.__validateJWT = function(){
                var deferred = Q.defer();
                deferred.resolve({validateToken:'545454545454'});
                return deferred.promise;
            };
            parse.__findUser = function(tokenObject){
                var deferred = Q.defer();
                req.CEMS.jwt = tokenObject;
                req.CEMS.jwt.role = CONST.USER.ROLE.ADMIN;
                deferred.resolve(req.CEMS);
                return deferred.promise;
            };
            sinon.stub(parse, '__next', function(cems){
                expect(req.CEMS.jwt).to.be.defined;
                expect(req.CEMS.jwt.role).to.equal(CONST.USER.ROLE.ADMIN);
                done();
            });
            parse.init(req, res, nextSpy);
        });

        it('should set the CEMS.jwt object to undefined if no jsonwebtoken is given', function(done){
            req.CEMS = {};
            parse.__hasToken = function(){
                var deferred = Q.defer();
                deferred.reject({errorMsg: 'error'});
                return deferred.promise;
            };
            sinon.stub(parse, '__error', function(reason){
                expect(reason.errorMsg).to.equal('error');
                done();
            });
            parse.init(req, res, nextSpy);
        });

        it('should set the CEMS.jwt object to undefined if the given jsonwebtoken is invalid', function(done){
            req.CEMS = {};
            parse.__hasToken = function(){
                var deferred = Q.defer();
                deferred.resolve();
                return deferred.promise;
            };
            parse.__validateJWT = function(){
                var deferred = Q.defer();
                deferred.reject({errorMsg: 'error'});
                return deferred.promise;
            };
            sinon.stub(parse, '__error', function(reason){
                expect(reason.errorMsg).to.equal('error');
                done();
            });
            parse.init(req, res, nextSpy);
        });

        it('should set the CEMS.jwt object to undefined if no user were found', function(done){
            req.CEMS = {};
            parse.__hasToken = function(){
                var deferred = Q.defer();
                deferred.resolve();
                return deferred.promise;
            };
            parse.__validateJWT = function(){
                var deferred = Q.defer();
                deferred.resolve({validateToken:'545454545454'});
                return deferred.promise;
            };
            parse.__findUser = function(){
                var deferred = Q.defer();
                deferred.reject({errorMsg: 'error'});
                return deferred.promise;
            };
            sinon.stub(parse, '__error', function(reason){
                expect(reason.errorMsg).to.equal('error');
                done();
            });
            parse.init(req, res, nextSpy);
        });
    });

});