'use strict'

var chai = require('chai'),
    sinon = require('sinon'),
    httpMocks = require('node-mocks-http'),
    Namespace = require('../../../routes/interceptors/namespace'),
    expect = chai.expect;

var req, res, nextSpy, reqSpy;

beforeEach(function(){
    //mock req.acceptsLanguages because it doesn't exists in node-mocks-http'
    reqSpy = sinon.spy();
    req = httpMocks.createRequest({
        headers:{
            authorization: 'bearer zoidjizdjiozdizdizdhizdhzi.zjiduhizadhzad5845z4dzad.zadazd5zd45zd4z',
        },
        acceptsLanguages: reqSpy
    });
    res = httpMocks.createResponse();
    nextSpy = sinon.spy();
});

describe('Namespace middleware', function(){

    it('should create a CEMS object on the req object', function(done){

        Namespace.create(req, res, nextSpy);
        
        expect(req).to.have.property('CEMS');
        expect(req.CEMS).to.have.property('server');
        expect(req.CEMS.server).to.have.property('token');
        expect(reqSpy.calledOnce).to.be.true;
        expect(nextSpy.calledOnce).to.be.true;
        done();

    });

});