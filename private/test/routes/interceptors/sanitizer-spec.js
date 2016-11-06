'use strict'

var chai = require('chai'),
    sinon = require('sinon'),
    nodeMocksHTTP = require('node-mocks-http'),
    Sanitizer = require('../../../routes/interceptors/sanitizer'),
    expect = chai.expect;

describe('Sanitizer middleware', function(){

    describe('#clean method', function(){

        describe('the params key of the req object', function(){

            var req, res, nextSpy;

            beforeEach(function(){
                req = nodeMocksHTTP.createRequest({
                    params: {
                        user_id: '562bbdb1a261ab0c10e2781a',
                        category_name: 'my new category name',
                        post_id: '507c35dd8fada716c89d0013',
                        category: 'cat2',
                        article: 'my-first-article',
                        '0': 'default',
                        '1': 'my-new-article'
                    },
                    CEMS:{}
                });
                nodeMocksHTTP.createResponse();
                nextSpy = sinon.spy();
            });

            it('should stock user_id parameter in the req.CEMS.userInput object for /users/ url', function(){
                var user_id = req.params.user_id;
                req.url = '/api/users/' + user_id;
                Sanitizer.clean(req, res, nextSpy);
                expect(req.params).to.be.undefined;
                expect(req.CEMS.userInput.user_id).to.equal(user_id);
            });

            it('should stock user_id parameter in the req.CEMS.postInput object for /posts/article-user-id/ url', function(){
                var user_id = req.params.user_id;
                req.url = '/api/posts/article-user-id/' + user_id;
                Sanitizer.clean(req, res, nextSpy);
                expect(req.params).to.be.undefined;
                expect(req.CEMS.postInput.user_id).to.equal(user_id);
            });

            it('should stock category_name parameter in the req.CEMS.postInput object for /posts/article-category-name/ url', function(){
                var category_name = req.params.category_name;
                req.url = '/api/posts/article-category-name/' + category_name;
                Sanitizer.clean(req, res, nextSpy);
                expect(req.params).to.be.undefined;
                expect(req.CEMS.postInput.category_name).to.equal('my-new-category-name');
            });

            it('should stock post_id parameter in the req.CEMS.articleInput object for /posts/article-url/ url', function(){
                var post_id = req.params.post_id;
                req.url = '/api/posts/article-url/' + post_id;
                Sanitizer.clean(req, res, nextSpy);
                expect(req.params).to.be.undefined;
                expect(req.CEMS.articleInput.post_id).to.equal(post_id);
            });

            it('should stock categoryName && url parameter in the req.CEMS.articleInput object for /posts/article-url/ url', function(){
                var categoryName = req.params[0],
                    url = req.params[1];
                req.url = '/api/posts/article-url/' + categoryName + '/' + url;
                Sanitizer.clean(req, res, nextSpy);
                expect(req.params).to.be.undefined;
                expect(req.CEMS.articleInput.categoryName).to.equal(categoryName);
                expect(req.CEMS.articleInput.url).to.equal(url);
            });

            it('should stock postId parameter in the req.CEMS.postInput object for /posts/ url', function(){
                var postId = req.params.postId
                req.url = '/api/posts/' + postId;
                Sanitizer.clean(req, res, nextSpy);
                expect(req.params).to.be.undefined;
                expect(req.CEMS.postInput.postId).to.equal(postId);
            });

            it('should stock category_id parameter in the req.CEMS.categoryInput object for /categories/ url', function(){
                var category_id = req.params.category_id
                req.url = '/api/categories/' + category_id;
                Sanitizer.clean(req, res, nextSpy);
                expect(req.params).to.be.undefined;
                expect(req.CEMS.categoryInput.category_id).to.equal(category_id);
            });
        });

        describe('the body key of the req object', function(){
            
            var req, res, nextSpy;

            beforeEach(function(){
                req = nodeMocksHTTP.createRequest({
                    body: {
                        email: 'test@test.com',
                        password: 'P@ssw0rd',
                        password2: 'P@ssw0rd',
                        newPassword: 'CEMSP@ssw0rd',
                        newPassword2: 'CEMSP@ssw0rd',
                        firstname: 'John',
                        lastname: 'Doe',
                        active: 'true',
                        name: 'new category',
                        userId: '562bbdb1a261ab0c10e2781a',
                        categoryId: '507c35dd8fada716c89d0013',
                        postId: '50634dbcbe4617f17bb159d0',
                        url: 'my-first-article',
                        title: 'my new title',
                        content: '<div><p>hello world</p></div>',
                        description: 'my new image',
                        previousImgSrc: 'img/post/media/my-old-img.png',
                        imgData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAwFBMVEXm7NK41k3w8fDv7+q01Tyy0zqv0DeqyjOszDWnxjClxC6iwCu11z6y1DvA2WbY4rCAmSXO3JZDTxOiwC3q7tyryzTs7uSqyi6tzTCmxSukwi9aaxkWGga+3FLv8Ozh6MTT36MrMwywyVBziSC01TbT5ZW9z3Xi6Mq2y2Xu8Oioxy7f572qxzvI33Tb6KvR35ilwTmvykiwzzvV36/G2IPw8O++02+btyepyDKvzzifvSmw0TmtzTbw8PAAAADx8fEC59dUAAAA50lEQVQYV13RaXPCIBAG4FiVqlhyX5o23vfVqUq6mvD//1XZJY5T9xPzzLuwgKXKslQvZSG+6UXgCnFePtBE7e/ivXP/nRvUUl7UqNclvO3rpLqofPDAD8xiu2pOntjamqRy/RqZxs81oeVzwpCwfyA8A+8mLKFku9XfI0YnSKXnSYZ7ahSII+AwrqoMmEFKriAeVrqGM4O4Z+ADZIhjg3R6LtMpWuW0ERs5zunKVHdnnnMLNQqaUS0kyKkjE1aE98b8y9x9JYHH8aZXFMKO6JFMEvhucj3Wj0kY2D92HlHbE/9Vk77mD6srRZqmVEAZAAAAAElFTkSuQmCC',
                        category: 'cat1',
                        article: 'my-first-article'
                    },
                    CEMS:{
                        jwt:{
                            role: 'ADMIN'
                        }
                    }
                });
                nodeMocksHTTP.createResponse();
                nextSpy = sinon.spy();
            });

            it('should stock email, password, password2, newPassword, newPassword2, firstname, lastname, active parameter in the req.CEMS.userInput object for /users/ or /login url', function(){
                var email = req.body.email,
                    password = req.body.password,
                    password2 = req.body.password2,
                    newPassword = req.body.newPassword,
                    newPassword2 = req.body.newPassword2,
                    firstname = req.body.firstname,
                    lastname = req.body.lastname,
                    active = req.body.active;
                req.url = '/action/login/';
                Sanitizer.clean(req, res, nextSpy);
                expect(req.body).to.be.undefined;
                expect(req.CEMS.userInput.email).to.equal(email);
                expect(req.CEMS.userInput.password).to.equal(password);
                expect(req.CEMS.userInput.password2).to.equal(password2);
                expect(req.CEMS.userInput.newPassword).to.equal(newPassword);
                expect(req.CEMS.userInput.newPassword2).to.equal(newPassword2);
                expect(req.CEMS.userInput.firstname).to.equal(firstname);
                expect(req.CEMS.userInput.lastname).to.equal(lastname);
                expect(req.CEMS.userInput.active).to.equal(true);
            });

            it('should stock name and active parameter in the req.CEMS.userInput object for /categories/ url', function(){
                var name = req.body.name,
                    active = req.body.active;
                req.url = '/api/categories/';
                Sanitizer.clean(req, res, nextSpy);
                expect(req.body).to.be.undefined;
                expect(req.CEMS.categoryInput.name).to.equal('new-category');
                expect(req.CEMS.categoryInput.active).to.equal(true);
            });

            it('should stock active, userId, categoryId, url, title and content parameter in the req.CEMS.postInput object for /posts/ url', function(){
                var active = req.body.active,
                    userId = req.body.userId,
                    categoryId = req.body.categoryId,
                    url = req.body.url,
                    title = req.body.title,
                    content = req.body.content;
                req.url = '/api/posts/';
                Sanitizer.clean(req, res, nextSpy);
                expect(req.body).to.be.undefined;
                expect(req.CEMS.postInput.active).to.equal(true);
                expect(req.CEMS.postInput.userId).to.equal(userId);
                expect(req.CEMS.postInput.categoryId).to.equal(categoryId);
                expect(req.CEMS.postInput.url).to.equal(url);
                expect(req.CEMS.postInput.title).to.equal(title);
                expect(req.CEMS.postInput.content).to.deep.equal([{"tagName":"div","attributes":{},"children":[{"tagName":"p","attributes":{},"children":[{"content":"hello world","type":"Text"}],"type":"Element"}],"type":"Element"}]);
            });


            it('should stock postId, title, description, previousImgSrc and imgData parameter in the req.CEMS.imageInput object for /save-img url', function(){
                var postId = req.body.postId,
                    title = req.body.title,
                    description = req.body.description,
                    previousImgSrc = req.body.previousImgSrc,
                    imgData = req.body.imgData;
                req.url = '/action/save-img';
                Sanitizer.clean(req, res, nextSpy);
                expect(req.body).to.be.undefined;
                expect(req.CEMS.imageInput.postId).to.equal(postId);
                expect(req.CEMS.imageInput.title).to.equal('my-new-title');
                expect(req.CEMS.imageInput.description).to.equal(description);
                expect(req.CEMS.imageInput.previousImgSrc).to.equal(previousImgSrc);
                expect(req.CEMS.imageInput.imgData.mediaType).to.be.defined;
                expect(req.CEMS.imageInput.imgData.base64).to.be.defined;
                expect(req.CEMS.imageInput.imgData.data).to.be.defined;
                expect(req.CEMS.imageInput.imgData.toBuffer).to.be.defined;
            });

            it('should stock category and article parameter in the req.CEMS.postInput object for /article-exists/ url', function(){
                var category = req.body.category,
                    article = req.body.article;
                req.url = '/action/article-exists/';
                Sanitizer.clean(req, res, nextSpy);
                expect(req.body).to.be.undefined;
                expect(req.CEMS.postInput.category).to.equal(category);
                expect(req.CEMS.postInput.article).to.equal(article);
            });

            it('should stock email, password, password2, firstname, lastname parameter in the req.CEMS.postInput object for /first-time/ url', function(){
                var email = req.body.email,
                    password = req.body.password,
                    password2 = req.body.password2,
                    firstname = req.body.firstname,
                    lastname = req.body.lastname;
                req.url = '/action/first-time/';
                Sanitizer.clean(req, res, nextSpy);
                expect(req.body).to.be.undefined;
                expect(req.CEMS.userInput.email).to.equal(email);
                expect(req.CEMS.userInput.password).to.equal(password);
                expect(req.CEMS.userInput.password2).to.equal(password2);
                expect(req.CEMS.userInput.firstname).to.equal(firstname);
                expect(req.CEMS.userInput.lastname).to.equal(lastname);
            });
        });

    });

});