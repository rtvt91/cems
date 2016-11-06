'use strict'

var chai = require('chai'),
    sinon = require('sinon'),
    mongoose = require('mongoose'),
    User = require('../../mongo-models/user'),
    CONST = require('../../config/constant'),
    expect = chai.expect;

require('sinon-as-promised');
require('sinon-mongoose');

describe('User model', function(){

    var User = mongoose.model('User'),
        userData = {
            email: 'test@test.com',
            password: 'mypassword',
            firstname: 'John',
            lastname: 'Doe'
        },
        UserMock,
        newUser,
        returnUser,
        returnUserWithPass;

    beforeEach(function(){
        UserMock = sinon.mock(User);
        newUser = User.create(userData);
        returnUser = {active:newUser.active, date:newUser.date, email:newUser.email, firstname:newUser.firstname, lastname:newUser.lastname, role: newUser.role};
        returnUserWithPass = {active:newUser.active, date:newUser.date, email:newUser.email, firstname:newUser.firstname, lastname:newUser.lastname, role: newUser.role, password:newUser.password};
    });

    afterEach(function(){
        UserMock.verify();
        UserMock.restore();
    });

    describe('#create method', function(){
        it('should create a user object', function(){
            var json = require('../../config/first-time');
            expect(newUser._id).to.exist;
            expect(newUser.date).to.exist;
            expect(newUser.active).to.exist;
            expect(newUser.role).to.exist;
            expect(newUser.firstname).to.equal(userData.firstname);
            expect(newUser.lastname).to.equal(userData.lastname);
            expect(newUser.active).to.equal(json.start)
            expect(newUser.password).not.to.equal(userData.password);
        });
    });

    describe('#findAll method', function(){
        it('should retrieve all users', function(done){
            UserMock
                .expects('find')
                .chain('select').withArgs('active date email firstname lastname role')
                .resolves(returnUser);

            User.findAll().then(function(result){
                expect(result).to.deep.equal(returnUser);
                done();
            });
        });

        it('should retrieve an error if no user were found', function(done){
            UserMock
                .expects('find')
                .chain('select').withArgs('active date email firstname lastname role')
                .rejects('an error occured');

            User.findAll().catch(function (result) {
                expect(result.message).to.equal('an error occured');
                done();
            });
        });
    });

    describe('#findBy method', function(){
        it('should retrieve user by : email (with password)', function (done) {
            UserMock
                .expects('find').withArgs({email:'test@test.com'})
                .chain('select').withArgs('active date email password firstname lastname role')
                .resolves(returnUserWithPass);

            User.findBy({email:'test@test.com'}, true).then(function (result) {
                expect(result).to.deep.equal(returnUserWithPass);
                done();
            });
        });
        it('should retrieve user by : email (no password)', function (done) {
            UserMock
                .expects('find').withArgs({email:'test@test.com'})
                .chain('select').withArgs('active date email firstname lastname role')
                .resolves(returnUser);

            User.findBy({email:'test@test.com'}).then(function (result) {
                expect(result).to.deep.equal(returnUser);
                done();
            });
        });
        it('should retrieve no user', function (done) {
            UserMock
                .expects('find').withArgs({email:'test@test.com'})
                .chain('select').withArgs('active date email firstname lastname role')
                .rejects('an error occured');

            User.findBy({email:'test@test.com'}).catch(function (result) {
                expect(result.message).to.equal('an error occured');
                done();
            });
        });
    });

    describe('#update method', function(){
        it('should update a user object', function(done){
            var updateData = {
                email: 'janedane@toto.com',
                firstname: 'Jane',
                lastname: 'Dane'
            };

            UserMock
                .expects('findByIdAndUpdate').withArgs(newUser._id, updateData)
                .resolves(updateData);

            User.update(newUser._id, updateData).then(function (result) {
                expect(result.email).to.equal('janedane@toto.com');
                expect(result.firstname).to.equal('Jane');
                expect(result.lastname).to.equal('Dane');
                done();
            });
        });

         it('should should raise an error if update fails', function(done){
             var updateData = {
                    email: 'janedane@toto.com',
	                firstname: 'Jane',
                    lastname: 'Dane'
                };

            UserMock
                .expects('findByIdAndUpdate').withArgs(newUser._id, updateData)
                .rejects('an error occured');

            User.update(newUser._id, updateData).catch(function (result) {
                expect(result.message).to.equal('an error occured');
                done();
            });
         });
     });

     describe('#delete method', function(){
        it('should delete a user', function(done){
            var id = 123;
            UserMock
                .expects('findByIdAndRemove').withArgs(id)
                .chain('select').withArgs('active date email firstname lastname role')
                .resolves(userData);
            
            User.delete(id).then(function(result){
                expect(result.email).to.equal('test@test.com');
                done();
            });
        });

        it('should raise an error if delete fails', function(done){
            var id = 123;
            UserMock
                .expects('findByIdAndRemove').withArgs(id)
                .chain('select').withArgs('active date email firstname lastname role')
                .rejects('an error occured');
            
            User.delete(id).catch(function(result){
                expect(result.message).to.equal('an error occured');
                done();
            });
        });
    });

    describe('#record method', function(){
        it('should save a user object', function(){
            var userInstanceMock = sinon.mock(newUser);
            userInstanceMock
                .expects('save')
                .resolves(newUser);

            newUser.save()
                .then(function(result){
                    expect(result._id).to.exist;
                    expect(result.role).to.exist;
                    expect(result.email).to.equal('test@test.com');
                    expect(result.role).to.equal(CONST.USER.ROLE.WRITER);
                    done();
                });
        });

        it('should raise a technical error if save fails', function(){
            var userInstanceMock = sinon.mock(newUser);
            userInstanceMock
                .expects('save')
                .rejects('an error occured');

            newUser.save().then(function (result) {
                expect(result.message).to.equal('an error occured');
                done();
            });
        });

        it('should raise an error if user\'s email already exists', function(){
            var userInstanceMock = sinon.mock(newUser);
            userInstanceMock
                .expects('save')
                .rejects({code: 11000});

            newUser.save(function (result) {
                expect(result.code).to.equal(11000);
                done();
            });
        });
    });

});