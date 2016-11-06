'use strict'

var chai = require('chai'),
    sinon = require('sinon'),
    jwt = require('jsonwebtoken'),
    JWT = require('../../utils/jwt'),
    CONFIG = require('../../config/config'),
    expect = chai.expect;

describe('JWT', function(){

    var payload = {
        id: "562bbdb1a261ab0c10e2781a"
    };

    describe('#createJWT method', function(){
        it('should create a json web token from an id', function(done){
            var jsonWebToken = JWT.createJWT(payload);
            jwt.verify(jsonWebToken, CONFIG.TOKEN.SECRET, function(err, decoded){
                expect(decoded).to.exist;
                expect(decoded.iat).to.be.a.number;
                expect(decoded.exp).to.be.a.number;
                expect(decoded.id).to.equal(payload.id);
                done();
            });
        });
    });

    describe('#validateJWT method', function(){

        it('should validate Json Web Token', function(done){
            var jsonWebToken = JWT.createJWT(payload);
            JWT
                .validateJWT(jsonWebToken)
                .then(function(tokenObject){
                    expect(tokenObject).to.exist;
                    expect(tokenObject.validateToken).to.equal(jsonWebToken);
                    expect(tokenObject.validateDecodedToken).to.exist;
                    expect(tokenObject.validateDecodedToken.id).to.equal(payload.id);                    
                    expect(tokenObject.errorMsg).to.equal('');                    
                    done();
                });
        });

        it('should unvalidate Json Web Token', function(done){
            var badJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';
            JWT
                .validateJWT(badJWT)
                .catch(function(tokenObject){
                    expect(tokenObject).to.exist;
                    expect(tokenObject.validateToken).to.equal('');
                    expect(tokenObject.validateDecodedToken).to.equal('');
                    expect(tokenObject.errorMsg).to.equal('JsonWebTokenError');                 
                    done();
                });
        });

        it('should raise an error if it\'s an expired time Json Web Token', function(done){
            var configExpiration = CONFIG.TOKEN.EXPIRATION;
            CONFIG.TOKEN.EXPIRATION = '1s';
            this.timeout(3000);

            var expiredJWT = JWT.createJWT(payload);

            setTimeout(function(){
                JWT
                    .validateJWT(expiredJWT)
                    .catch(function(tokenObject){
                        expect(tokenObject).to.exist;
                        expect(tokenObject.validateToken).to.equal('');
                        expect(tokenObject.validateDecodedToken).to.equal('');
                        expect(tokenObject.errorMsg).to.equal('TokenExpiredError');
                        CONFIG.TOKEN.EXPIRATION = configExpiration;
                    });
                done();
            }, 2000);
        });

    });
    
});