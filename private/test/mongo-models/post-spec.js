'use strict'

var chai = require('chai'),
    sinon = require('sinon'),
    mongoose = require('mongoose'),
    Post = require('../../mongo-models/post'),
    expect = chai.expect;

require('sinon-as-promised');
require('sinon-mongoose');

describe('Post model', function(){

    var Post = mongoose.model('Post'),
        postData = {
            userId: '5808d1f713d51d1a7cfa7ebe',
            categoryId: '5808d1f713d51d1a7cfa7ebf',
            url: 'my-first-article',
            title: 'my first article',
            content: [{"type": "Element", "children": [{"type": "Text", "content": "\n    "}],"attributes": {},"tagName": "section"}]
        },
        returnPostData = {
            userId: {
                "_id" : "5808d1f713d51d1a7cfa7ebe",
                "email" : "admin@admin.com",
                "password" : "$2a$10$Nk4OEE12SDcYHfTUrA4ki.ccsYSkGYVbppkJL9QfpXzNnYeOAXM8q",
                "firstname" : "First",
                "lastname" : "Last",
                "date" : "Thu Oct 20 2016 16:17:27 GMT+0200 (Paris, Madrid (heure d’été))",
                "role" : "ADMIN",
                "active" : true
            },
            categoryId: {
                "_id" : "5808d1f713d51d1a7cfa7ebf",
                "date" : "Thu Oct 20 2016 16:17:27 GMT+0200 (Paris, Madrid (heure d’été))",
                "name" : "default",
                "defaultCat" : true,
                "active" : true
            },
            url: 'my-first-article',
            title: 'my first article',
            content: [{"type": "Element", "children": [{"type": "Text", "content": "\n    "}],"attributes": {},"tagName": "section"}]
        },
        PostMock,
        newPost;

    beforeEach(function(){
        PostMock = sinon.mock(Post);
        newPost = Post.create(postData);
    });

    afterEach(function(){
        PostMock.verify();
        PostMock.restore();
    });

    describe('#create method', function(){
        it('should create a new Post', function(){
            expect(newPost._id).to.exist;
            expect(newPost.date).to.exist;
            expect(newPost.active).to.exist;
            expect(newPost.userId).to.exist;
            expect(newPost.categoryId).to.exist;
            expect(newPost.url).to.exist;
            expect(newPost.title).to.exist;
            expect(newPost.content).to.exist;
        });
    });

    describe('#findAll method', function(){
        it('should retrieve all the posts', function(done){
            PostMock
                .expects('find')
                .chain('sort').withArgs({'date': 'descending'})
                .chain('populate').withArgs({path:'categoryId', select:'name active'})
                .chain('populate').withArgs({path:'userId', select:'firstname lastname email active role'})
                .resolves(returnPostData);
            
            Post.findAll().then(function(result){
                expect(result).to.deep.equal(returnPostData);
                done();
            });
        });

        it('should retrieve an error', function(done){
            PostMock
                .expects('find')
                .chain('sort').withArgs({'date': 'descending'})
                .chain('populate').withArgs({path:'categoryId', select:'name active'})
                .chain('populate').withArgs({path:'userId', select:'firstname lastname email active role'})
                .rejects('an error occured');
            
            Post.findAll().catch(function(result){
                expect(result.message).to.equal('an error occured');
                done();
            });
        });
    });

    describe('#findBy method', function(){
        it('should retrieve a post by : id', function(done){
            PostMock
                .expects('find').withArgs({_id: newPost._id})
                .chain('sort').withArgs({'date': 'descending'})
                .chain('populate').withArgs({path:'categoryId', select:'name active'})
                .chain('populate').withArgs({path:'userId', select:'firstname lastname email active role'})
                .resolves(returnPostData);
            
            Post.findBy({_id: newPost._id}).then(function(result){
                expect(result).to.deep.equal(returnPostData);
                done();
            });
        });

        it('should retrieve an error', function(done){
            PostMock
                .expects('find').withArgs({_id: newPost._id})
                .chain('sort').withArgs({'date': 'descending'})
                .chain('populate').withArgs({path:'categoryId', select:'name active'})
                .chain('populate').withArgs({path:'userId', select:'firstname lastname email active role'})
                .rejects('an error occured');
            
            Post.findBy({_id: newPost._id}).catch(function(result){
                expect(result.message).to.equal('an error occured');
                done();
            });
        });
    });

    describe('#modify method', function(){
        it('should update a post', function(done){
            returnPostData.title = 'modified title';
            PostMock
                .expects('findByIdAndUpdate').withArgs({_id: newPost._id}, {title: 'modified title'},  {new: true})
                .resolves(returnPostData);
            
            Post.modify({_id: newPost._id}, {title: 'modified title'}).then(function(result){
                expect(result).to.deep.equal(returnPostData);
                returnPostData.title = 'my first article';
                done();
            });
        });

        it('should retrieve an error', function(done){
            PostMock
                .expects('findByIdAndUpdate').withArgs({_id: newPost._id}, {title: 'modified title'},  {new: true})
                .rejects('an error occured');
            
            Post.modify({_id: newPost._id}, {title: 'modified title'}).catch(function(result){
                expect(result.message).to.equal('an error occured');
                done();
            });
        });
    });

    describe('#delete method', function(){
        it('should delete a post', function(done){
            PostMock
                .expects('findByIdAndRemove').withArgs(newPost._id)
                .chain('select')
                .resolves(newPost);
            
            Post.delete(newPost._id).then(function(result){
                expect(result).to.deep.equal(newPost);
                done();
            });
        });

        it('should retrieve an error', function(done){
            PostMock
                .expects('findByIdAndRemove').withArgs(newPost._id)
                .chain('select')
                .rejects('an error occured');
            
            Post.delete(newPost._id).catch(function(result){
                expect(result.message).to.equal('an error occured');
                done();
            });
        });
    });

    describe('#record method', function(){
        it('should record a post', function(done){
            var postInstanceMock = sinon.mock(newPost);
            postInstanceMock
                .expects('save')
                .resolves(newPost);
            
            newPost.record().then(function(result){
                expect(result).to.deep.equal(newPost);
                done();
            });
        });

        it('should retrieve an error', function(done){
            var postInstanceMock = sinon.mock(newPost);
            postInstanceMock
                .expects('save')
                .rejects('an error occured');
            
            newPost.record().catch(function(result){
                expect(result.message).to.equal('an error occured');
                done();
            });
        });
    });

});