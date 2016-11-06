'use strict'

var chai = require('chai'),
    sinon = require('sinon'),
    mongoose = require('mongoose'),
    Category = require('../../mongo-models/category'),
    expect = chai.expect;

require('sinon-as-promised');
require('sinon-mongoose');

describe('Category model', function(){
    
    var Category = mongoose.model('Category'),
        catData = {
            name: 'default'
        },
        CatMock,
        newCat;
    
    beforeEach(function(){
        CatMock = sinon.mock(Category);
        newCat = Category.create(catData);
    });

    afterEach(function(){
        CatMock.verify();
        CatMock.restore();
    });

    describe('#create method', function(){
        it('should create a category object', function(){
            var json = require('../../config/first-time');
            expect(newCat._id).to.exist;
            expect(newCat.date).to.exist;
            expect(newCat.name).to.exist;
            expect(newCat.defaultCat).to.equal(json.start)
        });
    });

    describe('#findAll method', function(){
        it('should retrieve all categories', function(done){
            CatMock
                .expects('find')
                .chain('select').withArgs('id date active name defaultCat')
                .resolves(newCat);

            Category.findAll().then(function(result){
                expect(result).to.deep.equal(newCat);
                done();
            });
        });

        it('should retrieve an error', function(done){
            CatMock
                .expects('find')
                .chain('select').withArgs('id date active name defaultCat')
                .rejects('an error occured');

            Category.findAll().catch(function(result){
                expect(result.message).to.equal('an error occured');
                done();
            });
        });
    });

    describe('#findBy method', function(){
        it('should retrieve a category by name', function(done){
            CatMock
                .expects('find').withArgs({name:'default'})
                .chain('select').withArgs('id date active name defaultCat')
                .resolves(newCat);

            Category.findBy({name:'default'}).then(function(result){
                expect(result.name).to.equal('default');
                done();
            });
        });

        it('should retrieve an error', function(done){
            CatMock
                .expects('find').withArgs({name:'default'})
                .chain('select').withArgs('id date active name defaultCat')
                .rejects('an error occured');

            Category.findBy({name:'default'}).catch(function(result){
                expect(result.message).to.equal('an error occured');
                done();
            })
        });
    });

    describe('#update a category', function(){
        it('should update a category', function(done){
            CatMock
                .expects('findByIdAndUpdate').withArgs(newCat._id, {name:'test'}, {new:true})
                .resolves({_id:newCat._id, date:newCat.date, name:'test', defaultCat:newCat.defaultCat});

            Category.update(newCat._id, {name:'test'}).then(function(result){
                expect(result.name).to.equal('test');
                done();
            });
        });

        it('should retrieve an error', function(done){
            CatMock
                .expects('findByIdAndUpdate').withArgs(newCat._id, {name:'test'}, {new:true})
                .rejects('an error occured');

            Category.update(newCat._id, {name:'test'}).catch(function(result){
                expect(result.message).to.equal('an error occured');
                done();
            });
        });
    });

    describe('#delete a category', function(){
        it('should delete a category', function(done){
            CatMock
                .expects('findByIdAndRemove').withArgs(newCat._id)
                .chain('select').withArgs('id date active name defaultCat')
                .resolves(newCat);
            
            Category.delete(newCat._id).then(function(result){
                expect(result).to.deep.equal(newCat);
                done();
            });
        });

        it('should retrieve an error', function(done){
            CatMock
                .expects('findByIdAndRemove').withArgs(newCat._id)
                .chain('select').withArgs('id date active name defaultCat')
                .rejects('an error occured');
            
            Category.delete(newCat._id).catch(function(result){
                expect(result.message).to.equal('an error occured');
                done();
            });
        });
    });

    describe('#record a category', function(){
        it('should record a new category', function(done){
            var catInstanceMock = sinon.mock(newCat);
            catInstanceMock
                .expects('save')
                .resolves(newCat);

            newCat.save()
                .then(function(result){
                    expect(result._id).to.exist;
                    expect(result.active).to.exist;
                    expect(result.defaultCat).to.exist;
                    expect(result.date).to.exist;
                    expect(result.name).to.equal('default');
                    done();
                });
        });

        it('should raise a technical error if save fails', function(){
            var catInstanceMock = sinon.mock(newCat);
            catInstanceMock
                .expects('save')
                .rejects('an error occured');

            newCat.save().catch(function (result) {
                expect(result.message).to.equal('an error occured');
                done();
            });
        });

        it('should raise an error if category\'s name already exists', function(){
            var catInstanceMock = sinon.mock(newCat);
            catInstanceMock
                .expects('save')
                .rejects({code: 11000});

            newCat.save().catch(function (result) {
                expect(result.code).to.equal(11000);
                done();
            });
        });

    });
});