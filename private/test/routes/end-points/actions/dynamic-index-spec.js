'use strict'

var chai = require('chai'),
    nodeMocksHTTP = require('node-mocks-http'),
    Q = require('q'),
    DynamicIndex = require('../../../../routes/end-points/actions/dynamic-index'),
    expect = chai.expect;

describe('DynamicIndex end-point', function(){

    var req = nodeMocksHTTP.createRequest(),
        res = nodeMocksHTTP.createResponse(),
        index = DynamicIndex();
    
    it('should send index.html', function(done){

        index.__readFile = function(){
            var deferred = Q.defer();
            deferred.resolve({start: false});
            return deferred.promise;
        };
        index.__sendHTMLFile = function(firstTime){
            expect(firstTime.start).to.be.false;
            done();
        };

        index.init(req, res);
    });

    it('should send first-time.html', function(done){

        index.__readFile = function(){
            var deferred = Q.defer();
            deferred.resolve({start: true});
            return deferred.promise;
        };
        index.__sendHTMLFile = function(firstTime){
            expect(firstTime.start).to.be.true;
            done();
        };

        index.init(req, res);
    });
});