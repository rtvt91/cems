'use strict'

var chai = require('chai'),
    Message = require('../../message/message'),
    CONST = require('../../config/constant'),
    expect = chai.expect;

describe('Message', function(){

    it('should print a french error message', function(){
        var msg = Message.translate('fr', CONST.USER.ERROR.INVALID_EMAIL);
        expect(msg).to.equal('Vous devez rentrer un email valide.');
    });

    it('should print an english error message', function(){
        var msg = Message.translate('en', CONST.USER.SUCCESS.AUTHENTICATION_GRANTED);
        expect(msg).to.equal('Authentication granted.');
    });

    it('should print an english error message when false is passed as a language', function(){
        var msg = Message.translate(false, CONST.MONGO.TECHNICAL_ERROR);
        expect(msg).to.equal('A mongodb technical error occured. Please try again next time.');
    });

    it('should print a default error message when no other exist', function(){
        var msg = Message.translate('fr', 'COMMON.HELLO_WORLD');
        expect(msg).to.equal('Une erreur technique est survenue. Merci de réessayer ultérieurement.');
    });

});