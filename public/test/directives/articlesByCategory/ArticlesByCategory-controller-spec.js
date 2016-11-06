'use strict'

describe('ArticlesByCategoryController', function(){

    var ArticlesByCategoryController,
        UtilsService,
        PostHTTPService,
        $stateParams,
        $state;
    
    beforeEach(function(){
        angular.mock.module('app');
        angular.mock.inject(function($controller, _UtilsService_, _PostHTTPService_, _$stateParams_, _$state_){
            UtilsService = _UtilsService_;
            PostHTTPService = _PostHTTPService_;
            $stateParams = _$stateParams_;
            $state = _$state_;

            ArticlesByCategoryController = $controller('ArticlesByCategoryController');
        });
    });

    describe('#manageData', function(){

        it('it should prepare data for the template', function(){
            ArticlesByCategoryController.articles = undefined;
            var param ={
                data: [{
                    h1: 'My title',
                    h2: 'My sub title',
                    div: '<div>Lorem ipsum</div>',
                    date: new Date(),
                    url: 'my-first-article',
                    categoryId:{
                        name: 'default'
                    },
                    userId:{
                        firstname: 'John',
                        lastname: 'Doe'
                    }
                }]
            }
            ArticlesByCategoryController.internal.manageData(param);

            expect(ArticlesByCategoryController.articles.length).toEqual(1);
            expect(ArticlesByCategoryController.articles[0].compute.username).toEqual('John Doe');
            expect(ArticlesByCategoryController.articles[0].compute.url).toEqual('default/my-first-article');
        });

    });

    describe('#gotoArticle', function(){

        it('should navigate to the article page', function(){
            spyOn($state, 'go');

            ArticlesByCategoryController.gotoArticle('cat1', 'my-url');

            expect($state.go).toHaveBeenCalledWith('article', {category: 'cat1', article: 'my-url'});
        });

    });

    describe('#isConnectedUser', function(){

        it('should detect if the user is connected', function(){
            spyOn(UtilsService, 'getIdFromJWT').and.returnValue('zd5d45z4d5z4d5z4d5z4d5dz5d1z');

            var test = ArticlesByCategoryController.isConnectedUser('zd5d45z4d5z4d5z4d5z4d5dz5d1z');

            expect(test).toEqual(true);
        });

    });

    describe('#init', function(){

        it('should init the controller', function(){
            $stateParams.name = 'hello';
            spyOn(PostHTTPService, 'getPostByCategory');

            ArticlesByCategoryController.init();

            expect(PostHTTPService.getPostByCategory).toHaveBeenCalled();
        });

    });

});